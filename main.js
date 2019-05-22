const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function kmhToMs(num) {
  return num / 3.6;
}

function meters(num) {
  return num * 300;
}
const input = new GameInput(canvas);
const paint = new Paint(canvas);
const tintImages = {};
const imageSources = [
  ...Tree.imageSources,
  'images/cockpit.png',
  'images/wheel.png'
];

(async () => {
  await paint.loadImages(imageSources);

  imageSources.forEach(src => {
    tintImages[src] = new TintImage(paint.images[src], [40, 40, 40]);
  });

  loop.start();
})()


const loop = new Loop({
  onTick: (dtInMs) => {
    const dt = dtInMs / 1000;
    update(dt);
    render(paint);
  },
  animationFrame: true,
})

function handleResize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientWidth;
}

handleResize();

window.addEventListener('resize', handleResize);

const player = new Player(new V3(meters(5), meters(-1.2), meters(0)));

let trees = [...Array(300)].map((_, i) => {
  const sign = i % 2 ? 1 : -1;
  const x = sign * (meters(10) + Math.random() * meters(50));
  const y = 0;
  const z = i * meters(0.3) + meters(150);
  const position = new V3(x, y, z);
  return new Tree(position)
})

let renderList = [...trees];

const camera = {
  position: player.position.clone(),
  width: canvas.width,
  height: canvas.height,
  viewDistance: meters(0.5),
};

function update(dt) {
  player.update(dt);

  trees.forEach(tree => tree.update(dt))
  camera.position = player.position.clone();
  input.clearState();
}

function drawGround() {
  const gradient = ctx.createLinearGradient(0, canvas.clientHeight / 2, 0, canvas.clientHeight);
  gradient.addColorStop(0, "rgb(40, 40, 40)");
  gradient.addColorStop(1, "#186A3B");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.clientHeight / 2, canvas.clientWidth, canvas.clientHeight / 2);
}

function drawRoad() {
  const gradient = ctx.createLinearGradient(0, canvas.clientHeight / 2, 0, canvas.clientHeight);
  gradient.addColorStop(0.1, "rgb(40, 40, 40)");
  gradient.addColorStop(1, "#000");

  const roadWidth = meters(10);
  const playerOffset = (player.position.x * 0.2)

  const leftX = canvas.clientWidth * 0.5 - roadWidth * 0.2 - playerOffset;
  const rightX = canvas.clientWidth * 0.5 + roadWidth * 0.2 - playerOffset;

  const centerX = canvas.clientWidth / 2;

  ctx.fillStyle = gradient;
  ctx.moveTo(leftX, canvas.clientHeight);
  ctx.lineTo(rightX, canvas.clientHeight);
  ctx.lineTo(centerX, canvas.clientHeight / 2);
  ctx.closePath();
  ctx.fill();
}

function render() {
  canvas.width = canvas.width;

  drawGround();
  drawRoad();

  renderList
    .sort((a, b) => b.position.sqDistance(camera.position) - a.position.sqDistance(camera.position))
    .forEach(item => item.render());

  ctx.drawImage(paint.images['images/cockpit.png'], 0, 0, canvas.width, canvas.height);

  let wheelAngle = 0;

  if (input.keysDown.ArrowRight) wheelAngle = 0.1
  if (input.keysDown.ArrowLeft) wheelAngle = -0.1

  paint.image({
    image: paint.images['images/wheel.png'],
    position: {
      x: canvas.width * 0.4,
      y: canvas.height * 0.7
    },
    anchor: {
      x: 0.5,
      y: 0.5
    },
    scale: 0.6,
    angle: wheelAngle
  })
}