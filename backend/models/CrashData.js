const mongoose = require('mongoose');

// Define the schema for crash data
const CrashDataSchema = new mongoose.Schema({
  vin: String,
  timestamp: Date,
  dataSource: String,
  location: String,
  vehicleDetails: Object,   // Includes VIN, identifiers, etc.
  crashEventDetails: Object, // Date, time, location, severity
  vehicleDynamics: Object,   // OBD2 data like speed, RPM, etc.
  videoFootage: String,      // Optional video footage (URL or base64)
});

// Export the Mongoose model
module.exports = mongoose.model('CrashData', CrashDataSchema);
