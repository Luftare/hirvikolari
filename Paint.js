class Paint {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.viewTransform = {
      angle: 0,
      offset: { x: 0, y: 0 },
      scale: 1,
    };
    this.images = {};
  }
  fullScreen() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }
  loadImages(sources) {
    return Promise.all(
      sources.map(
        (source) =>
          new Promise((resolve) => {
            this.images[source] = new Image();
            this.images[source].onload = resolve;
            this.images[source].src = source;
          })
      )
    );
  }
  setViewAngle(angle) {
    this.viewTransform.angle = angle;
  }
  setViewScale(scale) {
    this.viewTransform.scale = scale;
  }
  setViewOffset(x, y) {
    this.viewTransform.offset = { x, y };
  }
  clear() {
    this.canvas.width = this.canvas.width;
  }
  rect(props) {
    const { ctx } = this;
    const dimensions = this.getRectFinalDimensions(props);
    ctx === null || ctx === void 0 ? void 0 : ctx.save();
    this.applyViewTransform();
    this.applyTransform(props, dimensions);
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0
      ? void 0
      : ctx.rect(0, 0, dimensions.width, dimensions.height);
    ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
    this.paintShape(props);
    ctx === null || ctx === void 0 ? void 0 : ctx.restore();
  }
  image(props) {
    const { ctx } = this;
    const { image } = props;
    const imageElement = typeof image === 'string' ? this.images[image] : image;
    if (!imageElement) return;
    const dimensions = this.getImageFinalDimensions(props);
    ctx === null || ctx === void 0 ? void 0 : ctx.save();
    this.applyViewTransform();
    this.applyTransform(props, dimensions);
    this.applyAlpha(props);
    ctx === null || ctx === void 0
      ? void 0
      : ctx.drawImage(imageElement, 0, 0, dimensions.width, dimensions.height);
    ctx === null || ctx === void 0 ? void 0 : ctx.restore();
  }
  circle(props) {
    const { ctx } = this;
    const { position = Paint.origin, radius, scale = 1 } = props;
    ctx === null || ctx === void 0 ? void 0 : ctx.save();
    this.applyViewTransform();
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0
      ? void 0
      : ctx.arc(position.x, position.y, radius * scale, 0, Math.PI * 2);
    ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
    this.paintShape(props);
    ctx === null || ctx === void 0 ? void 0 : ctx.restore();
  }
  path(props) {
    const { ctx } = this;
    const { points, closePath, scale = 1 } = props;
    const dimensions = this.getPathFinalDimensions(props);
    ctx === null || ctx === void 0 ? void 0 : ctx.save();
    this.applyViewTransform();
    this.applyTransform(props, dimensions);
    this.connectPoints(points, scale);
    if (closePath) {
      ctx === null || ctx === void 0 ? void 0 : ctx.closePath();
    }
    this.paintShape(props);
    ctx === null || ctx === void 0 ? void 0 : ctx.restore();
  }
  applyViewTransform() {
    const { ctx, canvas, viewTransform } = this;
    const { width, height } = canvas;
    const { angle, offset, scale } = viewTransform;
    ctx === null || ctx === void 0
      ? void 0
      : ctx.translate(width * 0.5, height * 0.5);
    ctx === null || ctx === void 0 ? void 0 : ctx.rotate(-angle);
    ctx === null || ctx === void 0
      ? void 0
      : ctx.translate(-offset.x, -offset.y);
    ctx === null || ctx === void 0 ? void 0 : ctx.scale(scale, scale);
    ctx === null || ctx === void 0
      ? void 0
      : ctx.translate(-width * 0.5, -height * 0.5);
  }
  applyTransform(props, dimensions) {
    this.applyRotation(props);
    this.applyAnchor(props, dimensions);
    this.applyPosition(props);
  }
  getImageFinalDimensions({ image, scale = 1 }) {
    const imageElement = image;
    return {
      width: imageElement.width * scale,
      height: imageElement.height * scale,
    };
  }
  getRectFinalDimensions({ width, height, scale = 1 }) {
    return { width: width * scale, height: height * scale };
  }
  getPathFinalDimensions({ points, scale = 1 }) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    points.forEach(({ x, y }) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });
    const width = maxX - minX;
    const height = maxY - minY;
    return {
      width: width * scale,
      height: height * scale,
    };
  }
  connectPoints(points, scale = 1) {
    const { ctx } = this;
    points.forEach(({ x, y }, index) => {
      if (index === 0) {
        ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        ctx === null || ctx === void 0
          ? void 0
          : ctx.moveTo(x * scale, y * scale);
      } else {
        ctx === null || ctx === void 0
          ? void 0
          : ctx.lineTo(x * scale, y * scale);
      }
    });
  }
  applyRotation({ position = Paint.origin, angle = 0 }) {
    const { ctx } = this;
    ctx === null || ctx === void 0
      ? void 0
      : ctx.translate(position.x, position.y);
    ctx === null || ctx === void 0 ? void 0 : ctx.rotate(angle);
    ctx === null || ctx === void 0
      ? void 0
      : ctx.translate(-position.x, -position.y);
  }
  applyPosition({ position = Paint.origin }) {
    var _a;
    (_a = this.ctx) === null || _a === void 0
      ? void 0
      : _a.translate(position.x, position.y);
  }
  applyAnchor({ anchor = Paint.origin }, dimensions) {
    var _a;
    (_a = this.ctx) === null || _a === void 0
      ? void 0
      : _a.translate(
          -dimensions.width * anchor.x,
          -dimensions.height * anchor.y
        );
  }
  applyAlpha({ alpha = 1 }) {
    if (!this.ctx) return;
    this.ctx.globalAlpha = alpha;
  }
  paintShape(props) {
    const { ctx } = this;
    if (!ctx) return;
    const {
      fill,
      stroke,
      scaleLineWidth,
      lineWidth = 1,
      lineCap,
      lineJoin,
      scale = 1,
    } = props;
    this.applyAlpha(props);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      if (lineCap) ctx.lineCap = lineCap;
      if (lineJoin) ctx.lineJoin = lineJoin;
      ctx.lineWidth = scaleLineWidth ? lineWidth * scale : lineWidth;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }
}
Paint.origin = { x: 0, y: 0 };
