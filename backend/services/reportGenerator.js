const PDFDocument = require("pdfkit");
const fs = require("fs");

function generateCrashReport(analysis, outputPath) {
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

        // Clean and format text
        let cleanedAnalysis = analysis
            .replace(/#/g, "") // Remove all occurrences of `#`
            .replace(/\*\*(.*?)\*\*/g, "$1") // Remove Markdown bold (`**text**`) but keep content
            .replace(/- /g, "• "); // Convert hyphen bullet points to proper bullets

        // Process sections properly
        const sections = cleanedAnalysis.split("\n\n");
        sections.forEach((section, index) => {
            const lines = section.split("\n");
            lines.forEach((line) => {
                if (line.trim() === "") return;

                if (line.match(/^Crash Likelihood|Detected Anomalies|Possible Causes|Recommendations/)) {
                    // Main section headers
                    applyStyle(styles.sectionHeader);
                    doc.text(line.trim());
                    doc.moveDown(1);
                } else if (line.match(/^\d+\./)) {
                    // Numbered lists
                    applyStyle(styles.normal);
                    doc.text(line.trim(), { indent: styles.bulletPoint.indent });
                    doc.moveDown(styles.bulletPoint.spacing);
                } else if (line.startsWith("•")) {
                    // Bullet points
                    applyStyle(styles.normal);
                    doc.text(line.trim(), { indent: styles.bulletPoint.indent * 2 });
                    doc.moveDown(styles.bulletPoint.spacing);
                } else {
                    // Regular text
                    applyStyle(styles.normal);
                    doc.text(line.trim(), { align: "left" });
                    doc.moveDown(0.5);
                }
            });

            if (index < sections.length - 1) {
                doc.moveDown(1);
            }
        });

        // Finalize PDF
        doc.end();

        stream.on("finish", () => resolve(outputPath));
        stream.on("error", (err) => reject(err));
    });
}

module.exports = { generateCrashReport };
