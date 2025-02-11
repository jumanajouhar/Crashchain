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
    location: '',
    impactSeverity: ''
  });

  const [additionalData, setAdditionalData] = useState({
    brakePosition: '',
    engineRpm: ''
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
    } else if (category === 'additional') {
      setAdditionalData(prev => ({ ...prev, [stateKey]: value }));
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
    Object.entries(additionalData).forEach(([key, value]) => formData.append(key, value));

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Hardware Data Simulator</h2>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Upload Files</h3>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Upload Photo/Video</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleFileUpload(e, 'media')}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mb-4"
          />
          <label className="block text-lg font-medium text-gray-700 mb-2">Upload CSV/Excel File</label>
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={(e) => handleFileUpload(e, 'data')}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Vehicle Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {['VIN Number', 'ECU Identifier', 'Distance Traveled'].map((label, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                name={label}
                onChange={(e) => handleInputChange(e, 'vehicle')}
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Crash Event Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {['Date', 'Time', 'Location', 'Impact Severity'].map((label, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                name={label}
                onChange={(e) => handleInputChange(e, 'crash')}
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Additional Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {['Brake Position', 'Engine RPM'].map((label, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                name={label}
                onChange={(e) => handleInputChange(e, 'additional')}
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-500 text-white py-3 px-6 rounded-lg shadow-lg text-lg font-medium hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Submit Data
        </button>
      </div>
    </div>
  );
};

export default HardwareSimulator;
