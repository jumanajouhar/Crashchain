import React, { useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Chart from 'chart.js/auto';
import './ReportPage.css';

const ReportPage = () => {
  const speedChartRef = useRef(null);
  const rpmChartRef = useRef(null);
  const throttleChartRef = useRef(null);
  const brakeChartRef = useRef(null);
  const fuelChartRef = useRef(null);

  useEffect(() => {
    // Destroy previous charts if they exist
    if (speedChartRef.current) speedChartRef.current.destroy();
    if (rpmChartRef.current) rpmChartRef.current.destroy();
    if (throttleChartRef.current) throttleChartRef.current.destroy();
    if (brakeChartRef.current) brakeChartRef.current.destroy();
    if (fuelChartRef.current) fuelChartRef.current.destroy();

    // Initialize Speed Chart
    const speedCtx = document.getElementById('speedChart').getContext('2d');
    speedChartRef.current = new Chart(speedCtx, {
      type: 'line',
      data: {
        labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
        datasets: [{
          label: 'Speed (km/h)',
          data: [0, 20, 50, 80, 70, 0],
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // Initialize RPM Chart
    const rpmCtx = document.getElementById('rpmChart').getContext('2d');
    rpmChartRef.current = new Chart(rpmCtx, {
      type: 'line',
      data: {
        labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
        datasets: [{
          label: 'Engine RPM',
          data: [500, 1500, 2000, 3000, 2500, 0],
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // Initialize Throttle Position Chart
    const throttleCtx = document.getElementById('throttleChart').getContext('2d');
    throttleChartRef.current = new Chart(throttleCtx, {
      type: 'line',
      data: {
        labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
        datasets: [{
          label: 'Throttle Position (%)',
          data: [10, 30, 50, 70, 40, 20],
          borderColor: 'rgba(255, 206, 86, 1)',
          fill: false
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // Initialize Brake Pressure Chart
    const brakeCtx = document.getElementById('brakeChart').getContext('2d');
    brakeChartRef.current = new Chart(brakeCtx, {
      type: 'line',
      data: {
        labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
        datasets: [{
          label: 'Brake Pressure (PSI)',
          data: [100, 80, 60, 30, 40, 90],
          borderColor: 'rgba(54, 162, 235, 1)',
          fill: false
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // Initialize Fuel Pressure Chart
    const fuelCtx = document.getElementById('fuelChart').getContext('2d');
    fuelChartRef.current = new Chart(fuelCtx, {
      type: 'line',
      data: {
        labels: ['0s', '1s', '2s', '3s', '4s', '5s'],
        datasets: [{
          label: 'Fuel Pressure (kPa)',
          data: [300, 320, 340, 360, 330, 310],
          borderColor: 'rgba(153, 102, 255, 1)',
          fill: false
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // Cleanup: Destroy the charts when the component unmounts
    return () => {
      if (speedChartRef.current) speedChartRef.current.destroy();
      if (rpmChartRef.current) rpmChartRef.current.destroy();
      if (throttleChartRef.current) throttleChartRef.current.destroy();
      if (brakeChartRef.current) brakeChartRef.current.destroy();
      if (fuelChartRef.current) fuelChartRef.current.destroy();
    };
  }, []);

  // Function to generate the PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add text
    doc.text(20, 20, 'Crash Report');
    doc.text(20, 30, 'Vehicle Details');
    doc.text(20, 40, 'VIN Number: 1HGBH41JXMN109186');
    doc.text(20, 50, 'ECU Identifier: ABC12345');
    doc.text(20, 60, 'Distance Traveled: 150 km');
    doc.text(20, 70, 'Crash Event Details');
    doc.text(20, 80, 'Date: 2024-10-10');
    doc.text(20, 90, 'Time: 14:30');
    doc.text(20, 100, 'Location: 45.4215 N, 75.6972 W');
    doc.text(20, 110, 'Impact Severity: High');

    // Capture each chart as an image and add to the PDF
    const charts = ['speedChart', 'rpmChart', 'throttleChart', 'brakeChart', 'fuelChart'];
    let yOffset = 120;

    charts.forEach((chartId, index) => {
      html2canvas(document.querySelector(`#${chartId}`)).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 15, yOffset, 180, 60);  // Smaller height for charts
        yOffset += 70;  // Adjust vertical spacing between charts

        if (index === charts.length - 1) {
          doc.save('crash_report.pdf');
        }
      });
    });
  };

  return (
    <div className="report-container">
      <h2>Full Crash Report</h2>

      {/* Vehicle Details */}
      <div className="report-section">
        <h3>Vehicle Details</h3>
        <ul>
          <li>VIN Number: <strong>1HGBH41JXMN109186</strong></li>
          <li>ECU Identifier: <strong>ABC12345</strong></li>
          <li>Distance Traveled: <strong>150 km</strong></li>
        </ul>
      </div>

      {/* Crash Event Details */}
      <div className="report-section">
        <h3>Crash Event Details</h3>
        <ul>
          <li>Date: <strong>2024-10-10</strong></li>
          <li>Time: <strong>14:30</strong></li>
          <li>Location: <strong>45.4215 N, 75.6972 W</strong></li>
          <li>Impact Severity: <strong>High</strong></li>
        </ul>
      </div>

      {/* Vehicle Dynamics */}
      <div className="report-section">
        <h3>Vehicle Dynamics</h3>
        <canvas id="speedChart" width="300" height="200"></canvas>
        <canvas id="rpmChart" width="300" height="200"></canvas>
        <canvas id="throttleChart" width="300" height="200"></canvas>
        <canvas id="brakeChart" width="300" height="200"></canvas>
        <canvas id="fuelChart" width="300" height="200"></canvas>
      </div>

      <button className="download-button" onClick={generatePDF}>
        Download PDF Report
      </button>
    </div>
  );
};

export default ReportPage;
