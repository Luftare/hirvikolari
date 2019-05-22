class TintImage {
  constructor(image, tint = [0, 0, 0]) {
    this.tint = tint;
    this.originalImage = image;
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    this.ctx = ctx;
    ctx.drawImage(image, 0, 0);
    this.image = canvas;
    this.applyTint()
  }

  applyTint() {
    const imageData = this.ctx.getImageData(0, 0, this.image.width, this.image.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] !== 0) {
        imageData.data[i] = this.tint[0];
        imageData.data[i + 1] = this.tint[1];
        imageData.data[i + 2] = this.tint[2];
        imageData.data[i + 3] = 255;
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }
}