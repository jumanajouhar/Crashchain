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

        const styles = {
            title: { font: "Helvetica-Bold", size: 24, spacing: 2, color: "#000000" },
            sectionHeader: { font: "Helvetica-Bold", size: 18, spacing: 1.5, color: "#000000" },
            normal: { font: "Helvetica", size: 12, spacing: 1, color: "#000000" },
        };

        function applyStyle(style) {
            doc.font(style.font).fontSize(style.size).lineGap(style.spacing * 12).fillColor(style.color);
        }

        function drawBorder() {
            doc.save();
            doc.lineWidth(2).strokeColor("#000000");
            doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).stroke();
            doc.restore();
        }

        doc.on("pageAdded", drawBorder);
        drawBorder();

        applyStyle(styles.title);
        doc.text("Crash Detection Report", { align: "center" });
        doc.moveDown(1);

        applyStyle(styles.sectionHeader);
        doc.text("Event Details", { align: "left" });
        doc.moveDown(0.5);

        applyStyle(styles.normal);
        const eventDetails = [
            ["VIN Number", data.vinNumber || "Not Provided"],
            ["ECU Identifier", data.ecuIdentifier || "Not Provided"],
            ["Distance Traveled", data.distanceTraveled || "Not Provided"],
            ["Date", data.date || "Not Provided"],
            ["Time", data.time || "Not Provided"],
            ["Location", data.location || "Not Provided"],
        ];

        const tableStartX = 50;
        const tableStartY = doc.y;
        const columnWidths = [150, 300];

        eventDetails.forEach(([key, value], index) => {
            const rowY = tableStartY + index * 20;
            doc.text(key, tableStartX, rowY, { width: columnWidths[0], continued: false });
            doc.text(value, tableStartX + columnWidths[0], rowY, { width: columnWidths[1] });
        });

        doc.moveDown(1);

        applyStyle(styles.sectionHeader);
        doc.text("OBD Data Analysis", { align: "left" });
        doc.moveDown(0.5);

        applyStyle(styles.normal);
        const formattedAnalysis = formatAnalysis(data.analysis);
        doc.text(formattedAnalysis, {
            align: "left",
            paragraphGap: 5,
            lineGap: 2,
        });

        doc.end();

        stream.on("finish", () => resolve(outputPath));
        stream.on("error", (err) => reject(err));
    });
}

module.exports = { generateCrashReport };