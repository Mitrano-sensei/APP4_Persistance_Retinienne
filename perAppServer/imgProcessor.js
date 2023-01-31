const Jimp = require('jimp');
const fs = require('fs');

async function resizeImage(src, dest, width = 28, height = 28) {
  let image = await Jimp.read(src);
  image.resize(width, height);
  await image.write(dest);
  return image;
}

async function setImageContrast(src, dest, contrast) {
  let image = await Jimp.read(src);
  image.contrast(contrast);
  await image.write(dest);
  return image;
}

async function setImageBrightness(src, dest, brightness) {
  let image = await Jimp.read(src);
  image.brightness(brightness);
  await image.write(dest);
  return image;
}

async function setImageSaturation(src, dest, saturation) {
  let image = await Jimp.read(src);
  image.color([
    { apply: 'saturate', params: [saturation] }
  ]);
  await image.write(dest);
  return image;
}


async function getMatrixFromImage(src) {
  let matrix = [];
  let row = [];
  let pixel = 0;
  let image = await Jimp.read(src);
  for (let i = 0; i < image.bitmap.height; i += 1) {
    row = [];
    for (let j = 0; j < image.bitmap.width; j += 1) {
      pixel = image.getPixelColor(j, i);
      row.push(pixel);
    }
    matrix.push(row);
  }
  return matrix;
}

async function getImageFromMatrix(matrix) {
  let image = new Jimp(matrix[0].length, matrix.length, 0x00000000);
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix[i].length; j += 1) {
      image.setPixelColor(matrix[i][j], j, i);
    }
  }
  return image;
}

(async () => {
  // // test resize
  // let image = await resizeImage('images/test.png', 32, 32);
  // image.write('images/tests/resize.png');
  // // test contrast
  // image = await setImageContrast('images/test.png', 0.5);
  // image.write('images/tests/contrast.png');
  // // test brightness
  // image = await setImageBrightness('images/test.png', 0.5);
  // image.write('images/tests/brightness.png');
  // // test saturation
  // image = await setImageSaturation('images/test.png', 0.5);
  // image.write('images/tests/saturation.png');
  // // test matrix && image from matrix
  // let matrix = await getMatrixFromImage({ id: 'test' });
  // image = await getImageFromMatrix(matrix);
  // image.write('images/tests/matrix.png');
})();

module.exports = {
  resizeImage,
  setImageContrast,
  setImageBrightness,
  setImageSaturation,
  getMatrixFromImage,
  getImageFromMatrix
};
