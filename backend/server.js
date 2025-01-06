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
    field => body[field] && body[field].trim() !== ''
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

app.post('/api/upload-and-process', upload.single('file'), async (req, res) => {
  try {
    if (!requiredFieldsPresent(req.body)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a Pinata group for this upload
    const group = await pinata.groups.create({
      name: `Upload-Group-${Date.now()}`,
    });

    const groupCids = [];

    // Handle uploaded file
    let imageIpfsHash = null;
    if (req.file) {
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
      groupCids.push(imageIpfsHash);
    }

    // Generate and save PDF
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

    // Add CIDs to the Pinata group
    const addCidsResponse = await pinata.groups.addCids({
      groupId: group.id,
      cids: groupCids,
    });

    res.json({
      message: 'Upload successful',
      groupName: group.name,
      groupId: group.id,
      cids: groupCids,
      addCidsResponse,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

// Define MongoDB schema for OBD data
const obdDataSchema = new mongoose.Schema({
  vin: String,
  data: String, // OBD data as JSON
  location: String,
  timestamp: { type: Date, default: Date.now },
});

const OBDData = mongoose.model('OBDData', obdDataSchema);

// Express setup
const port = process.env.PORT || 3000;
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
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Store full data in MongoDB
    const obdData = new OBDData({ vin, data, location });
    const savedData = await obdData.save();

    // Store metadata in blockchain
    const dataId = savedData._id.toString(); // MongoDB document ID
    const accounts = await web3.eth.getAccounts();
    await crashContract.methods.storeMetadata(dataId, vin, location).send({
      from: accounts[0],
      gas: 3000000,
    });

    res.json({ message: 'Data stored successfully', dataId });
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({ error: 'Error storing data' });
  }
});

// Endpoint to verify metadata
app.get('/verify-metadata/:index', async (req, res) => {
  const { index } = req.params;

  try {
    const metadata = await crashContract.methods.getMetadata(index).call();
    res.json(metadata);
  } catch (error) {
    console.error('Error verifying metadata:', error);
    res.status(500).json({ error: 'Error verifying metadata' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
