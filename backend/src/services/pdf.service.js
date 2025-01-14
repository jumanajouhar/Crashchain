const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generatePDF(data) {
  const doc = new PDFDocument();
  const currentTime = new Date();
  const pdfPath = path.join(process.env.UPLOAD_DIR, `report-${Date.now()}.pdf`);
  const writeStream = fs.createWriteStream(pdfPath);

  doc.pipe(writeStream);

  // Add title
  doc.fontSize(20).text('Crash Report', { align: 'center' });
  doc.moveDown();

  // Add timestamp
  doc.fontSize(12).text(`Generated on: ${currentTime.toLocaleString()}`, { align: 'right' });
  doc.moveDown();

  // Vehicle Details
  doc.fontSize(16).text('Vehicle Details');
  doc.fontSize(12);
  doc.text(`VIN Number: ${data.vinNumber || 'Not Provided'}`);
  doc.text(`ECU Identifier: ${data.ecuIdentifier || 'Not Provided'}`);
  doc.text(`Distance Traveled: ${data.distanceTraveled || 'Not Provided'}`);
  doc.moveDown();

  // Crash Details
  doc.fontSize(16).text('Crash Details');
  doc.fontSize(12);
  doc.text(`Timestamp: ${currentTime.toLocaleString()}`);
  doc.text(`Location: ${data.location}`);
  doc.text(`Impact Severity: ${data.impactSeverity}`);
  doc.moveDown();

  // Vehicle State
  doc.fontSize(16).text('Vehicle State at Time of Incident');
  doc.fontSize(12);
  doc.text(`Throttle Position: ${data.throttlePosition}%`);
  doc.text(`Brake Position: ${data.brakePosition}%`);

  if (data.telemetryData) {
    doc.moveDown();
    doc.fontSize(16).text('Telemetry Data');
    doc.fontSize(12);
    
    const telemetry = JSON.parse(data.telemetryData);
    if (telemetry.length > 0) {
      const lastReading = telemetry[telemetry.length - 1];
      doc.text(`Last Recorded Speed: ${lastReading.speed} km/h`);
      doc.text(`Last Recorded Engine RPM: ${lastReading.engineRpm} RPM`);
    }
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(pdfPath));
    writeStream.on('error', reject);
  });
}

module.exports = { generatePDF };