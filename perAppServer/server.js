// server.js

const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const imgProcessor = require('./imgProcessor.js');
const fs = require('fs');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json(
  {
    limit: '50mb'
  }
));

app.get('/', (req, res) => {
  res.status(200).send(
    {
      message: 'Welcome to APP4 Images Processing API',
      matrix: []
    }
  );
});

app.post('/process', async (req, res) => {
  let id = uuid.v4();
  fs.writeFile(`tmp/${id}.png`, req.body.source, 'base64', (err) => {
    if (err) {
      console.log(err);
    }
  });

  let config = req.body.config;
  let matrix = null;
  try {
    if (Object.keys(config.resize).length > 0) {
      await imgProcessor.resizeImage(`tmp/${id}.png`, `tmp/${id}.png`, config.resize.width, config.resize.height);
    }

    await new Promise(resolve => setTimeout(resolve, 50));  
    if (config.contrast >= -1 && config.contrast <= 1) {
      await imgProcessor.setImageContrast(`tmp/${id}.png`, `tmp/${id}.png`, config.contrast);
    }

    await new Promise(resolve => setTimeout(resolve, 50));  
    if (config.brightness >= 0) {
      await imgProcessor.setImageBrightness(`tmp/${id}.png`, `tmp/${id}.png`, config.brightness);
    }

    await new Promise(resolve => setTimeout(resolve, 50));  
    if (config.saturation >= 0) {
      await imgProcessor.setImageSaturation(`tmp/${id}.png`, `tmp/${id}.png`, config.saturation);
    }

    await new Promise(resolve => setTimeout(resolve, 50));  
    if (config.toMatrix) {
      matrix = await imgProcessor.getMatrixFromImage(`tmp/${id}.png`);
      }
  } catch (err) {
    console.log(err);
  }

  // return either matrix or image
  let image = null;
  if (!config.toMatrix) {
    fs.readFile(`tmp/${id}.png`, (err, data) => {
      if (err) {
        console.log(err);
      }
      image = data;
    }); 
  }

  await new Promise(resolve => setTimeout(resolve, 50));
  res.status(200).send(
    {
      message: 'Image processed successfully', 
      payload: config.toMatrix ? matrix : image
    }
  );
  
  // Delete tmp/img and replace it with processed img 
});



app.listen(5000, () => {
  console.log('server is running at http://localhost:5000');
});


// HTTPs server

// const https = require('https');
// const fs = require('fs');

// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

// https.createServer(options, app).listen(5000, () => {
//   console.log('server is running at https://localhost:5000');
// });