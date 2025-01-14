import React, { useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import Chart from 'chart.js/auto';

const ReportPage = () => {
  const speedChartRef = useRef(null);
  const rpmChartRef = useRef(null);
  const throttleChartRef = useRef(null);
  const brakeChartRef = useRef(null);
  const fuelChartRef = useRef(null);

  useEffect(() => {
    const createChart = (ref, id, data, label, borderColor) => {
      if (ref.current) ref.current.destroy();
      const ctx = document.getElementById(id).getContext('2d');
      ref.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
          datasets: [{
            label,
            data,
            borderColor,
            fill: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    };

    createChart(speedChartRef, 'speedChart', [0, 20, 50, 80, 70, 0], 'Speed (km/h)', 'rgb(75, 192, 192)');
    createChart(rpmChartRef, 'rpmChart', [500, 1500, 2000, 3000, 2500, 0], 'Engine RPM', 'rgb(255, 99, 132)');
    createChart(throttleChartRef, 'throttleChart', [10, 30, 50, 70, 40, 20], 'Throttle Position (%)', 'rgb(255, 206, 86)');
    createChart(brakeChartRef, 'brakeChart', [100, 80, 60, 30, 40, 90], 'Brake Pressure (PSI)', 'rgb(54, 162, 235)');
    createChart(fuelChartRef, 'fuelChart', [300, 320, 340, 360, 330, 310], 'Fuel Pressure (kPa)', 'rgb(153, 102, 255)');

    return () => {
      [speedChartRef, rpmChartRef, throttleChartRef, brakeChartRef, fuelChartRef].forEach(ref => {
        if (ref.current) ref.current.destroy();
      });
    };
  }, []);

  const addChartToPdf = async (doc, chartId, title, yPosition) => {
    const chart = document.getElementById(chartId);
    if (!chart) return yPosition;

    // Create a clean canvas copy
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = chart.width;
    tempCanvas.height = chart.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(chart, 0, 0);

    // Add title
    doc.setFontSize(12);
    doc.text(title, 20, yPosition - 5);

    // Add chart
    doc.addImage(
      tempCanvas.toDataURL('image/png'),
      'PNG',
      20,
      yPosition,
      170,
      50
    );

    return yPosition + 60;
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(24);
      doc.text('Full Crash Report', 105, 20, { align: 'center' });
      
      // Add timestamp
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
      
      // Vehicle Details Section
      doc.setFontSize(16);
      doc.text('Vehicle Details', 20, 45);
      
      doc.setFontSize(12);
      const vehicleDetails = [
        'VIN Number: 1HGBH41JXMN109186',
        'ECU Identifier: ABC12345',
        'Distance Traveled: 150 km'
      ];
      vehicleDetails.forEach((detail, index) => {
        doc.text(detail, 30, 55 + (index * 7));
      });
      
      // Crash Event Details Section
      doc.setFontSize(16);
      doc.text('Crash Event Details', 20, 85);
      
      doc.setFontSize(12);
      const crashDetails = [
        'Date: 2024-10-10',
        'Time: 14:30',
        'Location: 45.4215 N, 75.6972 W',
        'Impact Severity: High'
      ];
      crashDetails.forEach((detail, index) => {
        doc.text(detail, 30, 95 + (index * 7));
      });
      
      // Add charts
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Vehicle Dynamics Data', 20, 20);
      
      let currentY = 30;
      
      // Add each chart
      currentY = await addChartToPdf(doc, 'speedChart', 'Vehicle Speed Over Time', currentY);
      currentY = await addChartToPdf(doc, 'rpmChart', 'Engine RPM Over Time', currentY);
      
      // Add new page for remaining charts
      doc.addPage();
      currentY = 30;
      
      currentY = await addChartToPdf(doc, 'throttleChart', 'Throttle Position Over Time', currentY);
      currentY = await addChartToPdf(doc, 'brakeChart', 'Brake Pressure Over Time', currentY);
      currentY = await addChartToPdf(doc, 'fuelChart', 'Fuel Pressure Over Time', currentY);
      
      // Add summary page
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Analysis Summary', 20, 20);
      
      doc.setFontSize(12);
      const summary = [
        'Maximum Speed: 80 km/h',
        'Maximum RPM: 3000',
        'Average Throttle Position: 36.7%',
        'Impact Analysis:',
        '- Rapid deceleration observed in final second',
        '- High brake pressure application detected',
        '- Engine RPM shows emergency shutdown pattern',
        '- All systems showed normal operation until impact'
      ];
      
      summary.forEach((line, index) => {
        doc.text(line, 30, 35 + (index * 10));
      });
      
      doc.save('crash_report.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Full Crash Report</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Vehicle Details</h3>
        <ul className="list-none p-0 space-y-2">
          <li>VIN Number: <strong>1HGBH41JXMN109186</strong></li>
          <li>ECU Identifier: <strong>ABC12345</strong></li>
          <li>Distance Traveled: <strong>150 km</strong></li>
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Crash Event Details</h3>
        <ul className="list-none p-0 space-y-2">
          <li>Date: <strong>2024-10-10</strong></li>
          <li>Time: <strong>14:30</strong></li>
          <li>Location: <strong>45.4215 N, 75.6972 W</strong></li>
          <li>Impact Severity: <strong>High</strong></li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative h-64">
          <canvas id="speedChart"></canvas>
        </div>
        <div className="relative h-64">
          <canvas id="rpmChart"></canvas>
        </div>
        <div className="relative h-64">
          <canvas id="throttleChart"></canvas>
        </div>
        <div className="relative h-64">
          <canvas id="brakeChart"></canvas>
        </div>
        <div className="relative h-64">
          <canvas id="fuelChart"></canvas>
        </div>
      </div>

      <button
        onClick={generatePDF}
        style={{ 
          width: '100%',
          backgroundColor: '#22c55e',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Download PDF Report
      </button>
    </div>
  );
};

export default ReportPage;