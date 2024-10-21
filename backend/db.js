const uri = "mongodb+srv://user13:user01@cluster0.b0rsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// MongoDB connection function
// Import mongoose
const mongoose = require('mongoose');

// MongoDB connection function
const connectDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    const conn = await mongoose.connect(uri );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Export the connection function
module.exports = connectDB;
