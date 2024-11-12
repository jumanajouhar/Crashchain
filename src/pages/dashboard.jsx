import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleViewReport = () => {
    navigate('/report');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Vehicle Crash Reports</h1>
      <p className="text-gray-700 mb-8 text-lg">View recent crash reports and analyze vehicle data</p>

      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-8">
        <input
          type="text"
          placeholder="Search Crash ID"
          className="p-3 border border-gray-300 rounded-lg w-72 shadow-sm focus:ring focus:ring-blue-300 outline-none"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          Search
        </button>
      </div>

      {/* Crash Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 w-80 shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
          <h3 className="font-semibold text-xl text-gray-800 mb-4">Crash ID: #00124</h3>
          <p className="text-gray-600 mb-2">Location: <strong>Main St & 5th Ave</strong></p>
          <p className="text-gray-600 mb-2"><strong>OBD Data:</strong> Speed: 60 km/h, Throttle: 80%</p>
          <button
            onClick={handleViewReport}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 shadow-md transition-transform transform hover:scale-105"
          >
            View Full Report
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 w-80 shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
          <h3 className="font-semibold text-xl text-gray-800 mb-4">Crash ID: #00123</h3>
          <p className="text-gray-600 mb-2">Location: <strong>2nd Ave & Elm St</strong></p>
          <p className="text-gray-600 mb-2"><strong>OBD Data:</strong> Speed: 45 km/h, Throttle: 70%</p>
          <button
            onClick={handleViewReport}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-4 shadow-md transition-transform transform hover:scale-105"
          >
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
