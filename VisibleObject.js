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
    const projected = VisibleObject.getProjected(this.position);
    const scale = this.getScaleAt(this.position);
    if (scale <= 0) return;

    const distance = this.position.distance(camera.position);
    const fogVisibility = parseFloat(gameConfig.fogVisibility);
    const alpha = Math.min(1, Math.max(0, (meters(fogVisibility) - distance) / meters(fogVisibility)));
    const weightedAlpha = alpha ** 4;

    paint.image({
      scale: scale * this.scale,
      position: projected,
      anchor: { x: 0.5, y: 1 },
      image: tintImages[this.imageSrc].image,
    });

    paint.image({
      scale: scale * this.scale,
      position: projected,
      anchor: { x: 0.5, y: 1 },
      image: paint.images[this.imageSrc],
      alpha: weightedAlpha,
    });
  }

  getScaleAt(position) {
    return camera.viewDistance / (position.z - camera.position.z);
  }
}

VisibleObject.getProjected = function (position) {
  const relativePosition = position.clone().subtract(camera.position);
  const distance = position.distance(camera.position);

  return {
    x: relativePosition.x * camera.viewDistance / relativePosition.z + canvas.width * 0.5 + distance * meters(gameConfig.roadCurve * 0.000005),
    y: relativePosition.y * camera.viewDistance / relativePosition.z + canvas.height * 0.5 - distance * meters(gameConfig.roadSlope * 0.000003),
  };
}