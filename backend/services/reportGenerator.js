const PDFDocument = require("pdfkit");
const fs = require("fs");

function generateCrashReport(data, outputPath) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            margin: 50,
            size: "A4",
        });

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Define text styles
        const styles = {
            title: { font: "Helvetica-Bold", size: 24, spacing: 2 },
            sectionHeader: { font: "Helvetica-Bold", size: 18, spacing: 1.5 },
            subHeader: { font: "Helvetica-Bold", size: 14, spacing: 1 },
            normal: { font: "Helvetica", size: 12, spacing: 1 },
            bulletPoint: { indent: 20, spacing: 0.5 },
        };

        // Function to apply styles
        function applyStyle(style) {
            doc.font(style.font).fontSize(style.size).lineGap(style.spacing * 12);
        }

        // Add title
        applyStyle(styles.title);
        doc.text("Crash Detection Report", { align: "center" });
        doc.moveDown(2);

        // Add vehicle and crash details
        applyStyle(styles.sectionHeader);
        doc.text("Vehicle Details", { align: "left" });
        applyStyle(styles.normal);
        doc.text(`VIN: ${data.vinNumber || 'Not Provided'}`);
        doc.text(`ECU: ${data.ecuIdentifier || 'Not Provided'}`);
        doc.text(`Distance: ${data.distanceTraveled || 'Not Provided'}`);
        doc.moveDown(1);

        applyStyle(styles.sectionHeader);
        doc.text("Crash Details", { align: "left" });
        applyStyle(styles.normal);
        doc.text(`Date: ${data.date || 'Not Provided'}`);
        doc.text(`Time: ${data.time || 'Not Provided'}`);
        doc.text(`Location: ${data.location || 'Not Provided'}`);
        doc.text(`Severity: ${data.impactSeverity || 'Not Provided'}`);
        doc.moveDown(1);

        applyStyle(styles.sectionHeader);
        doc.text("Additional Data", { align: "left" });
        applyStyle(styles.normal);
        doc.text(`Brake Position: ${data.brakePosition || 'Not Provided'}`);
        doc.text(`Engine RPM: ${data.engineRpm || 'Not Provided'}`);
        doc.moveDown(1);

        // Add analysis from DeepSeek
        applyStyle(styles.sectionHeader);
        doc.text("DeepSeek Analysis", { align: "left" });
        applyStyle(styles.normal);
        doc.text(data.analysis);
        doc.moveDown(1);

        // Finalize PDF
        doc.end();

        stream.on("finish", () => resolve(outputPath));
        stream.on("error", (err) => reject(err));
    });
}

module.exports = { generateCrashReport };
