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

        // Function to format analysis data
        function formatAnalysis(analysis) {
            if (Array.isArray(analysis)) {
                return analysis.map(item => {
                    let text = `File: ${item.file}\n\n`;
                    if (typeof item.analysis === 'string') {
                        text += item.analysis
                            .replace(/\*\*/g, '') // Remove bold markers
                            .replace(/###/g, '') // Remove large heading markers
                            .replace(/---/g, '') // Remove horizontal rule markers
                            .replace(/1\./g, '•') // Replace numbered lists with bullets
                            .replace(/2\./g, '•')
                            .replace(/3\./g, '•')
                            .replace(/4\./g, '•');
                    } else if (typeof item.analysis === 'object') {
                        text += JSON.stringify(item.analysis, null, 2);
                    }
                    return text;
                }).join('\n\n');
            } else if (typeof analysis === 'string') {
                return analysis
                    .replace(/\*\*/g, '') // Remove bold markers
                    .replace(/###/g, '') // Remove large heading markers
                    .replace(/---/g, '') // Remove horizontal rule markers
                    .replace(/1\./g, '•') // Replace numbered lists with bullets
                    .replace(/2\./g, '•')
                    .replace(/3\./g, '•')
                    .replace(/4\./g, '•');
            } else if (typeof analysis === 'object') {
                return JSON.stringify(analysis, null, 2);
            }
            return 'No analysis data available';
        }

        // Add title
        applyStyle(styles.title);
        doc.text("Crash Detection Report", { align: "center" });
        doc.moveDown(2);

        // Add event details
        applyStyle(styles.sectionHeader);
        doc.text("Event Details", { align: "left" });
        doc.moveDown(0.5);
        
        applyStyle(styles.normal);
        doc.text(`VIN Number: ${data.vinNumber || 'Not Provided'}`);
        doc.text(`ECU Identifier: ${data.ecuIdentifier || 'Not Provided'}`);
        doc.text(`Distance Traveled: ${data.distanceTraveled || 'Not Provided'}`);
        doc.text(`Date: ${data.date || 'Not Provided'}`);
        doc.text(`Time: ${data.time || 'Not Provided'}`);
        doc.text(`Location: ${data.location || 'Not Provided'}`);
        doc.moveDown(1);

        // Add analysis from DeepSeek
        applyStyle(styles.sectionHeader);
        doc.text("DeepSeek Analysis", { align: "left" });
        doc.moveDown(0.5);
        
        applyStyle(styles.normal);
        const formattedAnalysis = formatAnalysis(data.analysis);
        doc.text(formattedAnalysis, {
            align: 'left',
            paragraphGap: 5,
            lineGap: 2 // Add spacing between lines for better readability
        });
        doc.moveDown(1);

        // Finalize PDF
        doc.end();

        stream.on("finish", () => resolve(outputPath));
        stream.on("error", (err) => reject(err));
    });
}

module.exports = { generateCrashReport };