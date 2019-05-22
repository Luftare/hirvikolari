class VisibleObject {
  constructor(position) {
    this.position = position.clone();
    this.dimensions = {
      width: 1,
      height: 1
    };
    this.scale = 1;
  }

  render() {
    const projected = this.getProjected(this.position);
    const scale = this.getScaleAt(this.position);
    if (scale <= 0) return;

    const distance = this.position.distance(camera.position);
    const alpha = Math.min(1, Math.max(0, (meters(200) - distance) / meters(200)))

    paint.image({
      width: this.dimensions.width,
      height: this.dimensions.height,
      scale: scale * this.scale,
      position: projected,
      anchor: { x: 0.5, y: 1 },
      image: tintImages[this.imageSrc].image,
    });

    paint.image({
      width: this.dimensions.width,
      height: this.dimensions.height,
      scale: scale * this.scale,
      position: projected,
      anchor: { x: 0.5, y: 1 },
      image: paint.images[this.imageSrc],
      alpha,
    });
  }


  getProjected(position) {
    const relativePosition = position.clone().subtract(camera.position);

    return {
      x: relativePosition.x * camera.viewDistance / relativePosition.z + canvas.width * 0.5,
      y: relativePosition.y * camera.viewDistance / relativePosition.z + canvas.height * 0.5,
    };
  }

  getScaleAt(position) {
    return camera.viewDistance / (position.z - camera.position.z);
  }
}