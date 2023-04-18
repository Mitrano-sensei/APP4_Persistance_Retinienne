const Jimp = require('jimp');

async function resizeImage(src, dest, width = 28, height = 28) {
  let image = null;
  let retry = 0;
  while (image === null && retry < 25) {
    try {
        image = await Jimp.read(src);
        image.resize(width, height);
        await image.write(dest);
    } catch (err) {
      console.log(err);
      retry += 1;
    }
  }
  return image;
}

async function setImageContrast(src, dest, contrast) {
  let image = null;
  let retry = 0;
  while (image === null && retry < 25) {
    try {
        image = await Jimp.read(src);
        image.contrast(contrast);
        await image.write(dest);
    } catch (err) {
      console.log(err);
      retry += 1;
    }
  }
  return image;
}

async function setImageBrightness(src, dest, brightness) {
  let image = null;
  let retry = 0;
  while (image === null && retry < 25) {
    try {
        image = await Jimp.read(src);
        image.brightness(brightness);
        await image.write(dest);
    } catch (err) {
      console.log(err);
      retry += 1;
    }
  }
  return image;
}

async function setImageSaturation(src, dest, saturation) {
  let image = null;
  let retry = 0;
  while (image === null && retry < 25) {
    try {
        image = await Jimp.read(src);
        image.color([
          { apply: 'saturate', params: [saturation] }
        ]);
        await image.write(dest);
    } catch (err) {
      console.log(err);
      retry += 1;
    }
  }
  return image;
}


async function getMatrixFromImage(src) {
  let matrix = [];
  let row = [];
  let pixel = 0;
  let rgb = 0;
  let image = null;
  let retry = 0;
  while (image === null && retry < 25) {
    try {
        image = await Jimp.read(src);
        for (let i = 0; i < image.bitmap.height; i += 1) {
          row = [];
          for (let j = 0; j < image.bitmap.width; j += 1) {
            pixel = image.getPixelColor(j, i);
            rgb = Jimp.intToRGBA(pixel);
            // ignore alpha channel
            rgb = (rgb.r << 16) | (rgb.g << 8) | rgb.b;
            row.push(rgb);
          }
          matrix.push(row);
        }
    } catch (err) {
      console.log(err);
      retry += 1;
    }
  }
  return matrix;
}

async function getImageFromMatrix(matrix) {
  let image = null;
  let retry = 0;
  while (image === null && retry < 25) {
    try {
        image = new Jimp(matrix[0].length, matrix.length, 0x00000000);
        for (let i = 0; i < matrix.length; i += 1) {
          for (let j = 0; j < matrix[i].length; j += 1) {
            image.setPixelColor(matrix[i][j], j, i);
          }
        }
    } catch (err) {
      console.log(err);
      retry += 1;
    }
  }

  return image;
}


module.exports = {
  resizeImage,
  setImageContrast,
  setImageBrightness,
  setImageSaturation,
  getMatrixFromImage,
  getImageFromMatrix
};
