import React, { useState } from 'react';

const HardwareSimulator = () => {
  const [vehicleDetails, setVehicleDetails] = useState({
    vinNumber: '',
    location: ''
  });

  const [additionalData, setAdditionalData] = useState({
    impactSeverity: '',
    throttlePosition: '',
    brakePosition: ''
  });

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleInputChange = (event, category) => {
    const { name, value } = event.target;
    if (category === 'vehicle') {
      setVehicleDetails({ ...vehicleDetails, [name]: value });
    } else if (category === 'additional') {
      setAdditionalData({ ...additionalData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = [
      vehicleDetails.vinNumber, 
      vehicleDetails.location, 
      additionalData.impactSeverity,
      additionalData.throttlePosition,
      additionalData.brakePosition
    ];

    if (requiredFields.some(field => !field)) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    
    // Append file if uploaded
    if (uploadedFile) {
      formData.append('file', uploadedFile);
    }

    // Append vehicle details
    formData.append('vinNumber', vehicleDetails.vinNumber);
    formData.append('location', vehicleDetails.location);

    // Append additional data
    formData.append('impactSeverity', additionalData.impactSeverity);
    formData.append('throttlePosition', additionalData.throttlePosition);
    formData.append('brakePosition', additionalData.brakePosition);

    try {
      const response = await fetch('http://localhost:3000/api/upload-and-process', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert(`Data uploaded successfully. Group ID: ${result.groupId}`);
        console.log('Upload details:', result);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit data');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Crash Data Simulator</h2>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Upload Photo/Video (Optional)</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VIN Number *</label>
            <input
              type="text"
              name="vinNumber"
              value={vehicleDetails.vinNumber}
              onChange={(e) => handleInputChange(e, 'vehicle')}
              required
              className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              placeholder="Enter VIN Number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={vehicleDetails.location}
              onChange={(e) => handleInputChange(e, 'vehicle')}
              required
              className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              placeholder="Enter Crash Location"
            />
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Crash Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Impact Severity *</label>
            <input
              type="text"
              name="impactSeverity"
              value={additionalData.impactSeverity}
              onChange={(e) => handleInputChange(e, 'additional')}
              required
              className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              placeholder="Severity Level"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Throttle Position *</label>
            <input
              type="text"
              name="throttlePosition"
              value={additionalData.throttlePosition}
              onChange={(e) => handleInputChange(e, 'additional')}
              required
              className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              placeholder="Throttle Position"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brake Position *</label>
            <input
              type="text"
              name="brakePosition"
              value={additionalData.brakePosition}
              onChange={(e) => handleInputChange(e, 'additional')}
              required
              className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              placeholder="Brake Position"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-500 text-white py-3 px-6 rounded-lg shadow-lg text-lg font-medium hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Submit Crash Data
        </button>
      </div>
    </div>
  );
};

export default HardwareSimulator;