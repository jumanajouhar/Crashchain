const express = require('express');
const multer = require('multer');
const app = express();

// Multer configuration
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  console.log('File received:', req.file);
  res.status(200).send('File upload successful.');
});


app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http:// 192.168.248.91:3000');
});
