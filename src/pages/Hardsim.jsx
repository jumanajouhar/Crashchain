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

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleInputChange = (event, category) => {
    const { name, value } = event.target;
    if (category === 'vehicle') {
      setVehicleDetails({ ...vehicleDetails, [name]: value });
    } else if (category === 'crash') {
      setCrashDetails({ ...crashDetails, [name]: value });
    } else if (category === 'additional') {
      setAdditionalData({ ...additionalData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (uploadedFile) {
      formData.append('file', uploadedFile);
    }
    formData.append('vinNumber', vehicleDetails.vinNumber);
    formData.append('ecuIdentifier', vehicleDetails.ecuIdentifier);
    formData.append('distanceTraveled', vehicleDetails.distanceTraveled);
    formData.append('date', crashDetails.date);
    formData.append('time', crashDetails.time);
    formData.append('location', crashDetails.location);
    formData.append('impactSeverity', crashDetails.impactSeverity);
    formData.append('brakePosition', additionalData.brakePosition);
    formData.append('engineRpm', additionalData.engineRpm);

    try {
      const response = await fetch('http://localhost:3000/api/upload-and-process', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert(`Data uploaded successfully. IPFS Hash: ${result.IpfsHash}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Hardware Data Simulator</h2>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Upload Photo/Video</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Vehicle Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {['VIN Number', 'ECU Identifier', 'Distance Traveled'].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
              <input
                type="text"
                name={field.toLowerCase().replace(/\s+/g, '')}
                onChange={(e) => handleInputChange(e, 'vehicle')}
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Crash Event Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {['Date', 'Time', 'Location', 'Impact Severity'].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
              <input
                type="text"
                name={field.toLowerCase().replace(/\s+/g, '')}
                onChange={(e) => handleInputChange(e, 'crash')}
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Additional Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {['Brake Position', 'Engine RPM'].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
              <input
                type="text"
                name={field.toLowerCase().replace(/\s+/g, '')}
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
