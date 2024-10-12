import React, { useState } from 'react';
import ReportPage from './ReportPage'; // Assuming you create a separate ReportPage component

const Dashboard = () => {
  const [showReport, setShowReport] = useState(false);

  const handleViewReport = () => {
    setShowReport(true); // This will show the report page
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Crash reports and statistics go here...</p>
      <button onClick={handleViewReport}>View Full Report</button>

      {showReport && (
        <div>
          <ReportPage />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
