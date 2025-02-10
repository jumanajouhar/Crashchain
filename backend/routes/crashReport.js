const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const { analyzeOBDDataWithDeepSeek } = require("../services/anomalyDetection");
const { generateCrashReport } = require("../services/reportGenerator");

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
