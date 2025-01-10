require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Web3 } = require('web3');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { PinataSDK } = require('pinata-web3');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const WebSocket = require('ws');
const http = require('http');

const app = express();
app.use(cors());

// Pinata SDK initialization
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: 'lavender-tropical-harrier-912.mypinata.cloud',
});

// Multer setup for file upload handling
const upload = multer({ storage: multer.memoryStorage() });

// Ensure the `uploads` directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper functions
function requiredFieldsPresent(body) {
  return ['date', 'time', 'location'].every(
    (field) => body[field] && body[field].trim() !== ''
  );
}

async function generatePDF(data, pdfPath) {
  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(pdfPath);

  doc.pipe(writeStream);
  doc.text(`Vehicle Details:\nVIN: ${data.vinNumber || 'Not Provided'}\nECU: ${data.ecuIdentifier || 'Not Provided'}\nDistance: ${data.distanceTraveled || 'Not Provided'}`);
  doc.text(`\nCrash Details:\nDate: ${data.date}\nTime: ${data.time}\nLocation: ${data.location}\nSeverity: ${data.impactSeverity || 'Not Provided'}`);
  doc.text(`\nAdditional Data:\nBrake: ${data.brakePosition || 'Not Provided'}\nRPM: ${data.engineRpm || 'Not Provided'}`);
  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

// Debugging middleware
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming request: ${req.method} ${req.url}`);
  console.log(`[DEBUG] Request body:`, req.body);
  next();
});

const fetchAllGroupsAndFiles = async () => {
  try {
    console.log('[DEBUG] Fetching all groups from IPFS');
    const groups = await pinata.groups.list();
    console.log(`[DEBUG] Raw groups response:`, groups);

    if (!Array.isArray(groups)) {
      console.error('[DEBUG] Invalid groups structure received:', groups);
      return [];
    }

    const groupData = await Promise.all(
      groups.map(async (group) => {
        console.log(`[DEBUG] Fetching files for group ID: ${group.id}`);
        const filesResponse = await pinata.listFiles().group(group.id);

        if (!filesResponse || !Array.isArray(filesResponse)) {
          console.error(`[DEBUG] Invalid files structure for group ID ${group.id}:`, filesResponse);
          return { groupId: group.id, groupName: group.name, files: [] };
        }
        
        const files = filesResponse.map((file) => ({
          cid: file.ipfs_pin_hash,
          name: file.metadata?.name || 'Unknown',
          mimeType: file.mime_type,
          size: file.size,
        }));
        
        console.log(`[DEBUG] Valid files processed for group ID ${group.id}:`, files);
        return { groupId: group.id, groupName: group.name, files };
      })
    );

    console.log('[DEBUG] Group data cache populated successfully');
    return groupData;
  } catch (error) {
    console.error('[DEBUG] Error fetching groups or files:', error.message);
    return [];
  }
};
// Global variable to store dashboard data
let dashboardData = [];

const initializeDashboard = async () => {
  try {
    console.log('[DEBUG] Initializing dashboard data');
    dashboardData = await fetchAllGroupsAndFiles();
    console.log('[DEBUG] Dashboard data initialized');
  } catch (error) {
    console.error('[DEBUG] Error initializing dashboard data:', error);
  }
};

// Upload and process endpoint
app.post('/api/upload-and-process', upload.single('file'), async (req, res) => {
  try {
    if (!requiredFieldsPresent(req.body)) {
      console.error('[DEBUG] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a Pinata group for this upload
    console.log('[DEBUG] Creating Pinata group');
    const group = await pinata.groups.create({
      name: `Upload-Group-${Date.now()}`,
    });
    console.log(`[DEBUG] Group created: ${JSON.stringify(group)}`);

    const groupCids = [];

    // Handle uploaded file
    let imageIpfsHash = null;
    if (req.file) {
      console.log('[DEBUG] Processing uploaded file');
      const formData = new FormData();
      formData.append('file', req.file.buffer, req.file.originalname);

      const imageUploadResponse = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            ...formData.getHeaders(),
          },
          maxBodyLength: Infinity,
        }
      );

      imageIpfsHash = imageUploadResponse.data.IpfsHash;
      console.log(`[DEBUG] Image uploaded: ${imageIpfsHash}`);
      groupCids.push(imageIpfsHash);
    }

    // Generate and save PDF
    console.log('[DEBUG] Generating PDF');
    const pdfPath = path.join(uploadsDir, `report-${Date.now()}.pdf`);
    await generatePDF(req.body, pdfPath);

    const formData = new FormData();
    formData.append('file', fs.createReadStream(pdfPath));

    const pdfUploadResponse = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          ...formData.getHeaders(),
        },
        maxBodyLength: Infinity,
      }
    );

    groupCids.push(pdfUploadResponse.data.IpfsHash);
    console.log(`[DEBUG] PDF uploaded: ${pdfUploadResponse.data.IpfsHash}`);

    // Add CIDs to the Pinata group
    console.log('[DEBUG] Adding CIDs to group');
    const addCidsResponse = await pinata.groups.addCids({
      groupId: group.id,
      cids: groupCids,
    });
    console.log(`[DEBUG] CIDs added to group: ${JSON.stringify(addCidsResponse)}`);

    await broadcastUpdate();

    res.json({
      message: 'Upload successful',
      groupName: group.name,
      groupId: group.id,
      cids: groupCids,
      addCidsResponse,
    });
  } catch (error) {
    console.error('[DEBUG] Error in upload-and-process:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch group data from IPFS
app.get('/api/fetch-group-data/:groupId', async (req, res) => {
  const { groupId } = req.params;

  try {
    console.log(`[DEBUG] Fetching data for group ID: ${groupId}`);

    const groupDetails = await pinata.groups.get({ groupId });
    console.log(`[DEBUG] Group Details: ${JSON.stringify(groupDetails)}`);

    const cids = groupDetails?.data?.cids || [];
    console.log(`[DEBUG] CIDs: ${cids}`);

    const fetchCidData = async (cid) => {
      console.log(`[DEBUG] Fetching data for CID: ${cid}`);
      const response = await axios.get(
        `https://${pinata.pinataGateway}/ipfs/${cid}`,
        { responseType: 'arraybuffer' }
      );
      console.log(`[DEBUG] Data fetched for CID: ${cid}`);
      return {
        cid,
        contentType: response.headers['content-type'],
        data: Buffer.from(response.data).toString('base64'),
      };
    };

    const groupData = await Promise.all(cids.map(fetchCidData));
    console.log(`[DEBUG] Group Data: ${JSON.stringify(groupData)}`);

    res.json({
      groupId,
      groupName: groupDetails.data.name,
      files: groupData,
    });
  } catch (error) {
    console.error('[DEBUG] Error fetching group data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to serve dashboard data
app.get('/api/dashboard-data', async (req, res) => {
  try {
    if (!dashboardData || dashboardData.length === 0) {
      // Fetch fresh data if none exists
      dashboardData = await fetchAllGroupsAndFiles();
    }
    res.json(dashboardData || []);
  } catch (error) {
    console.error('[DEBUG] Error serving dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('[DEBUG] Connecting to MongoDB');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[DEBUG] MongoDB connected successfully.');
  } catch (error) {
    console.error('[DEBUG] Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  initializeDashboard();
});

// Define MongoDB schema for OBD data
const obdDataSchema = new mongoose.Schema({
  vin: String,
  data: String,
  location: String,
  timestamp: { type: Date, default: Date.now },
});

const OBDData = mongoose.model('OBDData', obdDataSchema);

// Express setup
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

// Web3 setup
const web3 = new Web3(process.env.ETH_PROVIDER);
const contractABI = require('./blockchain/build/contracts/CrashMetadataStorage.json').abi;
const contractAddress = process.env.CONTRACT_ADDRESS;
const crashContract = new web3.eth.Contract(contractABI, contractAddress);

// Endpoint to receive ESP32 OBD data
app.post('/store-obd-data', async (req, res) => {
  const { vin, data, location } = req.body;

  if (!vin || !data || !location) {
    console.error('[DEBUG] Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('[DEBUG] Storing OBD data in MongoDB');
    // Store full data in MongoDB
    const obdData = new OBDData({ vin, data, location });
    const savedData = await obdData.save();
    console.log(`[DEBUG] OBD data saved: ${JSON.stringify(savedData)}`);

    // Store metadata in blockchain
    const dataId = savedData._id.toString(); // MongoDB document ID
    const accounts = await web3.eth.getAccounts();
    console.log(`[DEBUG] Using account: ${accounts[0]}`);

    await crashContract.methods.storeMetadata(dataId, vin, location).send({
      from: accounts[0],
      gas: 3000000,
    });

    console.log('[DEBUG] Metadata stored in blockchain');
    res.json({ message: 'Data stored successfully', dataId });
  } catch (error) {
    console.error('[DEBUG] Error storing OBD data:', error);
    res.status(500).json({ error: 'Error storing data' });
  }
});

// Endpoint to verify metadata
app.get('/verify-metadata/:index', async (req, res) => {
  const { index } = req.params;

  try {
    console.log(`[DEBUG] Verifying metadata for index: ${index}`);
    const metadata = await crashContract.methods.getMetadata(index).call();
    console.log(`[DEBUG] Metadata retrieved: ${JSON.stringify(metadata)}`);
    res.json(metadata);
  } catch (error) {
    console.error('[DEBUG] Error verifying metadata:', error);
    res.status(500).json({ error: 'Error verifying metadata' });
  }
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('[DEBUG] New WebSocket connection established');
  
  ws.isAlive = true;
  
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
  // Send initial data
  const sendInitialData = async () => {
    try {
      const data = await fetchAllGroupsAndFiles();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'initialData', data }));
      }
    } catch (error) {
      console.error('[DEBUG] Error sending initial data:', error);
    }
  };
  
  sendInitialData();
  
  ws.on('error', (error) => {
    console.error('[DEBUG] WebSocket error:', error);
  });
});

// Ping all clients every 30 seconds to keep connections alive
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('[DEBUG] Terminating inactive WebSocket connection');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

// Function to broadcast updates to all connected clients
const broadcastUpdate = async () => {
  try {
    const data = await fetchAllGroupsAndFiles();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'update', data }));
      }
    });
  } catch (error) {
    console.error('[DEBUG] Error broadcasting update:', error);
  }
};

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});