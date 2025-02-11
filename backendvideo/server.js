const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Set up multer for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `image_${timestamp}${ext}`);
  },
});

const upload = multer({ storage });

// Route for OBD data
app.post('/obd', (req, res) => {
  const obdData = req.body;

  if (!obdData.VIN || !obdData.speed || !obdData.latitude || !obdData.longitude) {
    return res.status(400).send('Invalid OBD data');
  }

  console.log('Received OBD data:', obdData);
  // Save OBD data to a file (optional)
  fs.appendFileSync('obd_data.log', JSON.stringify(obdData) + '\n');
  res.status(200).send('OBD data received successfully');
});

// Route for image uploads
app.post('/image', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded');
  }

  console.log(`Image saved as: ${req.file.path}`);
  res.status(200).send('Image uploaded successfully');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
