const express = require('express');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname)); // To serve static files if needed

let currentToken = '';
let qrCount = 1;

// Generate a random token
function generateToken() {
  return Math.random().toString(36).substring(2, 10); // 8-char random string
}

// Update the QR code every 5 seconds
setInterval(() => {
  currentToken = generateToken();
  qrCount++;
}, 5000);

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Serve QR code image
app.get('/qr', (req, res) => {
  const qrImage = qr.image(currentToken, { type: 'png' });
  res.setHeader('Content-type', 'image/png');
  qrImage.pipe(res);
});

// When student scans the QR code
app.get('/mark', (req, res) => {
  const timestamp = new Date().toISOString();
  const entry = `Attendance marked for token: ${currentToken} at ${timestamp}\n`;
  fs.appendFileSync('attendance.txt', entry);
  res.send('✅ Attendance marked successfully!');
});

// Get QR count (for frontend JS to fetch)
app.get('/qr-count', (req, res) => {
  res.json({ count: qrCount });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
