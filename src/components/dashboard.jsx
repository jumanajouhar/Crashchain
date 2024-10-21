import React from 'react';

const DashBoard = () => {
  return (
    <div className="flex flex-col justify-center   ">
      <h1 className="text-3xl text-gray-800 mb-3">Recent Vehicle Crash Reports</h1>
      <p className="mb-5">Explore detailed reports of recent vehicle crashes.</p>

      <div className="flex justify-center mb-5">
        <input
          type="text"
          placeholder="Search Crash ID"
          className="p-2 border border-gray-300 rounded-l-lg w-48 bg-white"
        />
        <button className="p-2 bg-blue-500 text-white rounded-r-lg">Search</button>
      </div>

      <div className="flex gap-5 justify-center mt-5">
        <div className="border border-gray-300 rounded-lg p-5 w-64 shadow-lg text-left bg-white">
          <h3 className="text-lg font-semibold mb-2">Crash ID: #00124</h3>
          <p>Location: Main St & 5th Ave</p>
          <p>
            <strong>OBD Data:</strong> Speed: 60 km/h, Throttle: 80%
          </p>
          <button className="mt-3 bg-blue-500 text-white py-2 px-4 rounded cursor-pointer">
            View Full Report
          </button>
        </div>

        <div className="border border-gray-300 rounded-lg p-5 w-64 shadow-lg text-left bg-white">
          <h3 className="text-lg font-semibold mb-2">Crash ID: #00123</h3>
          <p>Location: 2nd Ave & Elm St</p>
          <p>
            <strong>OBD Data:</strong> Speed: 45 km/h, Throttle: 70%
          </p>
          <button className="mt-3 bg-blue-500 text-white py-2 px-4 rounded cursor-pointer">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
