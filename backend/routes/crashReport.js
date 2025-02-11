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

const router = express.Router();
const upload = multer({ dest: "uploads/" });

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

// New route for handling upload and analysis
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

            // Read and analyze each Excel file
            const workbook = xlsx.readFile(excelFile.path);
            const sheetName = workbook.SheetNames[0];
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const analysis = await analyzeOBDDataWithDeepSeek(data);
            combinedAnalysis.push({ file: excelFile.originalname, analysis });
        }

        // Generate crash report PDF using form data and analysis
        const pdfPath = `reports/crash_report_${Date.now()}.pdf`;
        await generateCrashReport({ ...req.body, analysis: combinedAnalysis }, pdfPath);

        // Create a Pinata group for this upload
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

        // Clean up the PDF file
        fs.unlinkSync(pdfPath);

        // Delete all uploaded files
        for (const excelFile of excelFiles) fs.unlinkSync(excelFile.path);
        for (const imageFile of imageFiles) fs.unlinkSync(imageFile.path);

        res.json({
            message: "Analysis complete and files uploaded to Pinata",
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
