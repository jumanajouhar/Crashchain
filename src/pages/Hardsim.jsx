import React, { useState } from 'react';

const HardwareSimulator = () => {
  const [vehicleDetails, setVehicleDetails] = useState({
    vinNumber: '',
    ecuIdentifier: '',
    distanceTraveled: ''
  });

  const [crashDetails, setCrashDetails] = useState({
    date: '',
    time: '',
    location: ''
  });

  const [uploadedMediaFile, setUploadedMediaFile] = useState(null);
  const [uploadedDataFile, setUploadedDataFile] = useState(null);

  const handleFileUpload = (event, fileType) => {
    const file = event.target.files[0];
    if (file) {
      if (fileType === 'media') {
        setUploadedMediaFile(file);
      } else if (fileType === 'data') {
        setUploadedDataFile(file);
      }
    }
  };

  const handleInputChange = (event, category) => {
    const { name, value } = event.target;
    const stateKey = name.replace(/\s+/g, '').replace(/^./, c => c.toLowerCase());

    if (category === 'vehicle') {
      setVehicleDetails(prev => ({ ...prev, [stateKey]: value }));
    } else if (category === 'crash') {
      setCrashDetails(prev => ({ ...prev, [stateKey]: value }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    if (uploadedMediaFile) {
      formData.append('image', uploadedMediaFile);
    }
    if (uploadedDataFile) {
      formData.append('file', uploadedDataFile);
    }

    // Append other form fields
    Object.entries(vehicleDetails).forEach(([key, value]) => formData.append(key, value));
    Object.entries(crashDetails).forEach(([key, value]) => formData.append(key, value));

    try {
      const response = await fetch('http://localhost:3000/crash-report/upload-and-analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload and analysis successful:', result);
      alert('Data uploaded and analyzed successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error uploading and analyzing data: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1B1F3B]">
      <div className="w-full max-w-3xl bg-[#2C2F48] shadow-2xl rounded-lg p-8">
        <h2 className="text-4xl font-bold text-[#6C63FF] mb-8 text-center">Hardware Data Simulator</h2>

        <h3 className="text-3xl font-semibold text-[#6C63FF] mb-6">Upload Files</h3>
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-300 mb-2">Upload Photo/Video</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleFileUpload(e, 'media')}
            className="block w-full text-sm text-gray-300 border border-gray-500 rounded-lg cursor-pointer bg-[#3B3F5C] shadow-sm focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] mb-4 transition duration-200 ease-in-out transform hover:scale-105"
          />
          <label className="block text-lg font-medium text-gray-300 mb-2">Upload CSV/Excel File</label>
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={(e) => handleFileUpload(e, 'data')}
            className="block w-full text-sm text-gray-300 border border-gray-500 rounded-lg cursor-pointer bg-[#3B3F5C] shadow-sm focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition duration-200 ease-in-out transform hover:scale-105"
          />
        </div>

        <h3 className="text-3xl font-semibold text-[#6C63FF] mb-6">Event Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {[
            { label: 'VIN Number', name: 'vinNumber', category: 'vehicle' },
            { label: 'ECU Identifier', name: 'ecuIdentifier', category: 'vehicle' },
            { label: 'Distance Traveled', name: 'distanceTraveled', category: 'vehicle' },
            { label: 'Date', name: 'date', category: 'crash' },
            { label: 'Time', name: 'time', category: 'crash' },
            { label: 'Location', name: 'location', category: 'crash' }
          ].map(({ label, name, category }, index) => (
            <div key={index} className="transition duration-200 ease-in-out transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
              <input
                type="text"
                name={name}
                onChange={(e) => handleInputChange(e, category)}
                className="block w-full border border-gray-500 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] sm:text-sm p-3 bg-[#3B3F5C] text-gray-300"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#6C63FF] text-white py-4 px-6 rounded-lg shadow-lg text-lg font-medium hover:bg-[#FF6584] focus:outline-none focus:ring-4 focus:ring-[#6C63FF] transition duration-200 ease-in-out"
        >
          Submit Data
        </button>
      </div>
    </div>
  );
};

export default HardwareSimulator;