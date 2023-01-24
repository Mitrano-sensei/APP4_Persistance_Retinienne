// server.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');


const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('You can post to /api/upload.');
});

app.post('/api/upload', (req, res) => {
  console.log('file', req.files);
  console.log('body', req.body);
  res.status(200).json({
    message: 'success!',
  });
});

// app.listen(process.env.PORT || 3000, () => {
//   console.log(
//     `server is running at http://localhost:${process.env.PORT || 3000}`
//   );
// });


const options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(3000, () => {
  console.log('server is running at https://localhost:3000');
});


