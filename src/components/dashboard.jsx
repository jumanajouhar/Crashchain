import React from 'react';

const DashBoard = () => {
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    width: '250px',
    margin: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
  };

  const cardContainerStyle = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const headerStyle = {
    fontSize: '2em',
    color: '#333',
    marginBottom: '10px',
  };

  const searchStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  };

  const searchInputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '200px',
  };

  const searchButtonStyle = {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    marginLeft: '10px',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Recent Vehicle Crash Reports</h1>
      <p>Explore detailed reports of recent vehicle crashes.</p>
      
      <div style={searchStyle}>
        <input type="text" placeholder="Search Crash ID" style={searchInputStyle} />
        <button style={searchButtonStyle}>Search</button>
      </div>

      <div style={cardContainerStyle}>
        <div style={cardStyle}>
          <h3>Crash ID: #00124</h3>
          <p>Location: Main St & 5th Ave</p>
          <p><strong>OBD Data:</strong> Speed: 60 km/h, Throttle: 80%</p>
          <button style={buttonStyle}>View Full Report</button>
        </div>

        <div style={cardStyle}>
          <h3>Crash ID: #00123</h3>
          <p>Location: 2nd Ave & Elm St</p>
          <p><strong>OBD Data:</strong> Speed: 45 km/h, Throttle: 70%</p>
          <button style={buttonStyle}>View Full Report</button>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
