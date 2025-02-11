const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const { analyzeOBDDataWithDeepSeek } = require("../services/anomalyDetection");
const { generateCrashReport } = require("../services/reportGenerator");
const axios = require("axios");
const pinata = require("../services/pinata");
const FormData = require('form-data');
const path = require('path');
const { Web3 } = require('web3'); // Updated import syntax
const mongoose = require('mongoose');

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Web3 setup
const web3 = new Web3(process.env.ETH_PROVIDER || 'http://127.0.0.1:7545');
let contractABI;
try {
  contractABI = require('../blockchain/build/contracts/CrashMetadataStorage.json').abi;
  console.log('[DEBUG] Successfully loaded contract ABI');
} catch (error) {
  console.error('[DEBUG] Error loading contract ABI:', error);
  contractABI = null;
}


const contractAddress = process.env.CONTRACT_ADDRESS;
console.log('[DEBUG] Using contract address:', contractAddress);

// Test blockchain connection
web3.eth.net.isListening()
  .then(() => console.log('[DEBUG] Successfully connected to Ethereum network'))
  .catch(err => console.error('[DEBUG] Error connecting to Ethereum network:', err));

// Verify contract exists
web3.eth.getCode(contractAddress)
  .then(code => {
    if (code === '0x') {
      console.error('[DEBUG] No contract found at address:', contractAddress);
    } else {
      console.log('[DEBUG] Contract verified at address:', contractAddress);
    }
  })
  .catch(err => console.error('[DEBUG] Error verifying contract:', err));

const crashContract = new web3.eth.Contract(contractABI, contractAddress);

// Get the default account for transactions
let defaultAccount;
web3.eth.getAccounts().then(accounts => {
  defaultAccount = accounts[0];
  console.log('[DEBUG] Default account set:', defaultAccount);
}).catch(error => {
  console.error('[DEBUG] Error getting accounts:', error);
});

// File upload & processing route
router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        // Read the uploaded Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Analyze data with DeepSeek
        const analysis = await analyzeOBDDataWithDeepSeek(data);

        // Generate crash report PDF
        const pdfPath = `reports/crash_report_${Date.now()}.pdf`;
        await generateCrashReport(analysis, pdfPath);

        // Delete the uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            message: "Analysis complete",
            reportUrl: `/download/${pdfPath.split('/').pop()}`
        });
    } catch (error) {
        console.error("Processing error:", error);
        res.status(500).send("Error processing file.");
    }
});

// New route for handling upload, analysis, and blockchain storage
router.post("/upload-and-analyze", upload.fields([{ name: 'file', maxCount: 10 }, { name: 'image', maxCount: 10 }]), async (req, res) => {
    const excelFiles = req.files['file'] || [];
    const imageFiles = req.files['image'] || [];

    if (imageFiles.length === 0) {
        return res.status(400).json({ error: "No image files uploaded" });
    }

    try {
        let combinedAnalysis = [];

        // Process each Excel file
        for (const excelFile of excelFiles) {
            const validExtensions = ['.xls', '.xlsx'];
            const fileExtension = path.extname(excelFile.originalname).toLowerCase();

            if (!validExtensions.includes(fileExtension)) {
                console.error("Invalid file type uploaded:", fileExtension);
                return res.status(400).json({ error: "Invalid file type. Please upload an Excel file." });
            }

            // Read and analyze Excel file
            const workbook = xlsx.readFile(excelFile.path);
            const sheetName = workbook.SheetNames[0];
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const analysis = await analyzeOBDDataWithDeepSeek(data);
            combinedAnalysis.push({ file: excelFile.originalname, analysis });
        }

        // Generate crash report PDF using form data and analysis
        const pdfPath = `reports/crash_report_${Date.now()}.pdf`;
        await generateCrashReport({ ...req.body, analysis: combinedAnalysis }, pdfPath);

        // Create a Pinata group
        console.log('[DEBUG] Creating Pinata group');
        const group = await pinata.groups.create({
            name: `Upload-Group-${Date.now()}`,
        });
        console.log(`[DEBUG] Group created: ${JSON.stringify(group)}`);

        const groupCids = [];

        // Upload all images to Pinata
        for (const imageFile of imageFiles) {
            console.log(`[DEBUG] Uploading image ${imageFile.originalname} to Pinata`);
            const formData = new FormData();
            formData.append('file', fs.createReadStream(imageFile.path));

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

            const imageIpfsHash = imageUploadResponse.data.IpfsHash;
            console.log(`[DEBUG] Image uploaded to IPFS with hash: ${imageIpfsHash}`);
            groupCids.push(imageIpfsHash);
        }

        // Upload the PDF to Pinata
        console.log('[DEBUG] Uploading PDF to Pinata');
        const pdfFormData = new FormData();
        pdfFormData.append('file', fs.createReadStream(pdfPath));

        const pdfUploadResponse = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            pdfFormData,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PINATA_JWT}`,
                    ...pdfFormData.getHeaders(),
                },
                maxBodyLength: Infinity,
            }
        );

        const pdfIpfsHash = pdfUploadResponse.data.IpfsHash;
        console.log(`[DEBUG] PDF uploaded to IPFS with hash: ${pdfIpfsHash}`);
        groupCids.push(pdfIpfsHash);

        // Add CIDs to the Pinata group
        console.log(`[DEBUG] Adding CIDs to group: ${groupCids.join(', ')}`);
        await pinata.groups.addCids({
            cids: groupCids,
            groupId: group.id,
        });

        // Clean up temporary files
        fs.unlinkSync(pdfPath);
        for (const excelFile of excelFiles) fs.unlinkSync(excelFile.path);
        for (const imageFile of imageFiles) fs.unlinkSync(imageFile.path);

        try {
            console.log('[DEBUG] Fetching blockchain accounts...');
            const accounts = await web3.eth.getAccounts();
            const senderAccount = accounts[0];
        
            if (!senderAccount) {
                throw new Error('No Ethereum account available.');
            }
            console.log(`[DEBUG] Using account: ${senderAccount}`);
        
            console.log('[DEBUG] Checking contract deployment...');
            const contractCode = await web3.eth.getCode(contractAddress);
            if (contractCode === '0x') {
                throw new Error(`No smart contract deployed at ${contractAddress}`);
            }
            console.log('[DEBUG] Smart contract verified at:', contractAddress);
        
            console.log('[DEBUG] Storing metadata in blockchain...');
            const dataId = new mongoose.Types.ObjectId().toString();
        
            // Get gas estimate
            const gasEstimate = await crashContract.methods.storeMetadata(
                dataId, 
                req.body.vinNumber || '', 
                req.body.location, 
                groupCids
            ).estimateGas({ from: senderAccount });
        
            // Convert gas estimate to BigInt and add buffer
            const gasLimit = BigInt(gasEstimate) + BigInt(100000);
        
            const transaction = await crashContract.methods.storeMetadata(
                dataId,
                req.body.vinNumber || '',
                req.body.location,
                groupCids
            ).send({
                from: senderAccount,
                gas: gasLimit.toString(), // Convert BigInt to string for web3
            });
        
            console.log('[DEBUG] Blockchain transaction successful:', transaction.transactionHash);
        } catch (error) {
            console.error('[DEBUG] Error storing metadata in blockchain:', error.message || error);
        }

        res.json({
            message: "Analysis complete, files uploaded to Pinata, and metadata stored in blockchain",
            groupName: group.name,
            groupId: group.id,
            files: groupCids.map(cid => ({
                cid,
                url: `https://${process.env.GATEWAY_URL}/ipfs/${cid}`
            }))
        });

    } catch (error) {
        console.error("Processing error:", error);
        res.status(500).send("Error processing files.");
    }
});

// Serve the generated PDF for download
router.get("/download/:filename", (req, res) => {
    const filePath = `reports/${req.params.filename}`;
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send("File not found.");
    }
});

module.exports = router;
