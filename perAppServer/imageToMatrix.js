const Jimp = require('jimp');
const fs = require('fs');

async function imageToMatrix(config) {
  let matrix = [];
  let row = [];
  let pixel = 0;
  let ratio = 0;
  if (config.id) {
    let image = await Jimp.read(`images/${config.id}.png`);
    image.resize(32, 32);
    for (let i = 0; i < image.bitmap.height; i += 1) {
      row = [];
      for (let j = 0; j < image.bitmap.width; j += 1) {
        pixel = image.getPixelColor(j, i);
        row.push(pixel);
      }
      matrix.push(row);
    }
  }

  return matrix;
}

async function matrixToImage(matrix, path) {
  let image = new Jimp(matrix[0].length, matrix.length, 0x00000000);
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix[i].length; j += 1) {
      image.setPixelColor(matrix[i][j], j, i);
    }
  }
  image.write(path);
}



(async () => {
  const matrix = await imageToMatrix({ id: 1 });
  matrixToImage(matrix, 'test.png');
})();

module.exports = imageToMatrix;
