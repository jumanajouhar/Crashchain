import React, { useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Chart from 'chart.js/auto';

const ReportPage = () => {
  const speedChartRef = useRef(null);
  const rpmChartRef = useRef(null);
  const throttleChartRef = useRef(null);
  const brakeChartRef = useRef(null);
  const fuelChartRef = useRef(null);

  useEffect(() => {
    // Chart initialization helper
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

    // Initialize each chart
    createChart(speedChartRef, 'speedChart', [0, 20, 50, 80, 70, 0], 'Speed (km/h)', 'rgba(75, 192, 192, 1)');
    createChart(rpmChartRef, 'rpmChart', [500, 1500, 2000, 3000, 2500, 0], 'Engine RPM', 'rgba(255, 99, 132, 1)');
    createChart(throttleChartRef, 'throttleChart', [10, 30, 50, 70, 40, 20], 'Throttle Position (%)', 'rgba(255, 206, 86, 1)');
    createChart(brakeChartRef, 'brakeChart', [100, 80, 60, 30, 40, 90], 'Brake Pressure (PSI)', 'rgba(54, 162, 235, 1)');
    createChart(fuelChartRef, 'fuelChart', [300, 320, 340, 360, 330, 310], 'Fuel Pressure (kPa)', 'rgba(153, 102, 255, 1)');

    // Cleanup charts on component unmount
    return () => {
      if (speedChartRef.current) speedChartRef.current.destroy();
      if (rpmChartRef.current) rpmChartRef.current.destroy();
      if (throttleChartRef.current) throttleChartRef.current.destroy();
      if (brakeChartRef.current) brakeChartRef.current.destroy();
      if (fuelChartRef.current) fuelChartRef.current.destroy();
    };
  }, []);

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(20, 20, 'Crash Report');
    // Add more text as needed

    const charts = ['speedChart', 'rpmChart', 'throttleChart', 'brakeChart', 'fuelChart'];
    let yOffset = 30;

    charts.forEach((chartId, index) => {
      html2canvas(document.querySelector(`#${chartId}`)).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, yOffset, 190, 60); // Adjust chart size in PDF
        yOffset += 70;

        if (index === charts.length - 1) {
          doc.save('crash_report.pdf');
        }
      });
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Full Crash Report</h2>

      {/* Vehicle Details */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Vehicle Details</h3>
        <ul className="list-none p-0 space-y-2">
          <li>VIN Number: <strong>1HGBH41JXMN109186</strong></li>
          <li>ECU Identifier: <strong>ABC12345</strong></li>
          <li>Distance Traveled: <strong>150 km</strong></li>
        </ul>
      </div>

      {/* Crash Event Details */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Crash Event Details</h3>
        <ul className="list-none p-0 space-y-2">
          <li>Date: <strong>2024-10-10</strong></li>
          <li>Time: <strong>14:30</strong></li>
          <li>Location: <strong>45.4215 N, 75.6972 W</strong></li>
          <li>Impact Severity: <strong>High</strong></li>
        </ul>
      </div>

      {/* Vehicle Dynamics */}
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
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg"
      >
        Download PDF Report
      </button>
    </div>
  );
};

export default ReportPage;
