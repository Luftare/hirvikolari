const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let player;
let camera;
let trees = [];
let mooses = [];
let renderList = [];

const input = new GameInput(canvas);
const paint = new Paint(canvas);
const tintImages = {};
const meterScale = 300;

const loop = new Loop({
  onTick: (dtInMs) => {
    const dt = dtInMs / 1000;
    update(dt);
    if (Math.random() > gameConfig.drunkness) {
      render(paint);
    }
  },
  animationFrame: true,
})

const gameConfig = {
  viewDistance: meters(0.8),
  fogVisibility: 200,
  playerVelocityInKmH: 120,
  breakDeceleration: 8,
  roadWidth: 10,
  roadSlope: 0.5,
  roadCurve: 0.5,
  mooseCount: 5,
  drunkness: 0,
  breaking: false
};

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'enter') {
    setupGame();
    loop.start();
  }
})

const imageSources = [
  ...Tree.imageSources,
  'images/moose.png',
  'images/moose-right.png',
  'images/cockpit.png',
  'images/foot.png',
  'images/wheel.png'
];

function kmhToMs(num) {
  return num / 3.6;
}

function meters(num) {
  return num * meterScale;
}

function asMeters(num) {
  return num / meterScale;
}

async function boot() {
  window.addEventListener('resize', handleResize);
  handleResize();

  canvas.addEventListener('touchstart', () => {
    if (!loop.running || player.velocity.z < 0.5) {
      setupGame();
    } else {
      player.breaking = true;
    }
  })

  await paint.loadImages(imageSources);

  imageSources.forEach(src => {
    tintImages[src] = new TintImage(paint.images[src], [40, 40, 40]);
  });

  setupGame();

  loop.start();
}

function setupGame() {
  player = new Player(new V3(meters(1), meters(-1.5), meters(0)));

  camera = {
    position: player.position.clone(),
    width: canvas.width,
    height: canvas.height,
    viewDistance: gameConfig.viewDistance,
  };

  trees = [...Array(300)].map((_, i) => {
    const sign = i % 2 ? 1 : -1;
    const x = sign * (meters(gameConfig.roadWidth * 0.5) + meters(6) + (Math.random() ** 1.5) * meters(50));
    const y = meters(0.3);
    const z = i * meters(2) + meters(50);
    const position = new V3(x, y, z);
    return new Tree(position)
  });

  mooses = [...Array(gameConfig.mooseCount)].map((_, i) => {
    return new Moose(new V3(0, 0, -10000))
  });

  renderList = [...trees, ...mooses];

  loop.start();
}

function handleResize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientWidth;
}

function update(dt) {
  player.update(dt);

  trees.forEach(tree => tree.update(dt))
  mooses.forEach(moose => moose.update(dt))
  camera.position = player.position.clone();
  input.clearState();

  if (!player.breaking) {
    gameConfig.roadSlope = (Math.sin(Date.now() * 0.0003) * 0.5 + 0.5) * 0.3
    gameConfig.roadCurve = Math.sin(Date.now() * 0.0001) * 0.5
  }
}

function drawGround() {
  const gradient = ctx.createLinearGradient(0, canvas.clientHeight / 2, 0, canvas.clientHeight);
  gradient.addColorStop(0, "rgb(40, 40, 40)");
  gradient.addColorStop(1, "#186A3B");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, canvas.clientHeight / 2, canvas.clientWidth, canvas.clientHeight / 2);
}

function drawRoad() {
  const horizont = VisibleObject.getProjected(new V3(0, 0, player.position.z + meters(450)))
  const gradient = ctx.createLinearGradient(0, horizont.y, 0, canvas.clientHeight);
  gradient.addColorStop(0, "rgb(40, 40, 40)");
  gradient.addColorStop(1, "#000");

  const roadPoints = [
    new V3(meters(-gameConfig.roadWidth * 0.5), 0, player.position.z + meters(0.1)),
    new V3(meters(-gameConfig.roadWidth * 0.5), 0, player.position.z + meters(10)),
    new V3(meters(-gameConfig.roadWidth * 0.5), 0, player.position.z + meters(20)),
    new V3(meters(-gameConfig.roadWidth * 0.5), 0, player.position.z + meters(50)),
    new V3(meters(-gameConfig.roadWidth * 0.5), 0, player.position.z + meters(150)),
    new V3(meters(-gameConfig.roadWidth * 0.5), 0, player.position.z + meters(450)),
    new V3(meters(gameConfig.roadWidth * 0.5), 0, player.position.z + meters(450)),
    new V3(meters(gameConfig.roadWidth * 0.5), 0, player.position.z + meters(150)),
    new V3(meters(gameConfig.roadWidth * 0.5), 0, player.position.z + meters(50)),
    new V3(meters(gameConfig.roadWidth * 0.5), 0, player.position.z + meters(20)),
    new V3(meters(gameConfig.roadWidth * 0.5), 0, player.position.z + meters(10)),
    new V3(meters(gameConfig.roadWidth * 0.5), 0, player.position.z + meters(0.1)),
  ];

  const projectedRoadPoints = roadPoints.map(VisibleObject.getProjected);

  ctx.fillStyle = gradient;
  ctx.moveTo(projectedRoadPoints[0].x, projectedRoadPoints[0].y);
  for (let i = 1; i < projectedRoadPoints.length; i++) {
    ctx.lineTo(projectedRoadPoints[i].x, projectedRoadPoints[i].y);
  }
  ctx.closePath();
  ctx.fill();
}

function render() {
  ctx.save();
  ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
  ctx.rotate(Math.cos(Date.now() * 0.001) * 0.002 * gameConfig.drunkness)
  ctx.scale(
    1 + gameConfig.drunkness * 0.5 + (Math.sin(Date.now() * 0.0003) + 0.5) * 0.4 * gameConfig.drunkness,
    1 + gameConfig.drunkness * 0.5 + (Math.sin(Date.now() * 0.0003) + 0.5) * 0.4 * gameConfig.drunkness
  );
  ctx.translate(
    Math.cos(Date.now() * 0.001) * 50 * gameConfig.drunkness,
    Math.sin(Date.now() * 0.0003) * 50 * gameConfig.drunkness,
  );
  ctx.translate(-canvas.width * 0.5, -canvas.height * 0.5);

  if (gameConfig.drunkness > 0.2) {
    ctx.fillStyle = "rgba(70, 70, 70, 0.01)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    canvas.width = canvas.width;
  }

  drawGround();
  drawRoad();

  canvas.style.filter = `blur(${(Math.sin(Date.now() * 0.0005) + 0.5) * 6 * gameConfig.drunkness}px)`;

  renderList
    .sort((a, b) => b.position.sqDistance(camera.position) - a.position.sqDistance(camera.position))
    .forEach(item => item.render());

  ctx.drawImage(paint.images['images/cockpit.png'], 0, 0, canvas.width, canvas.height);

  paint.image({
    image: paint.images['images/foot.png'],
    position: {
      x: canvas.width * 0.27,
      y: canvas.height * 0.8
    },
    anchor: {
      x: 0.5,
      y: 0
    },
    scale: canvas.clientWidth / 1200,
  });

  paint.image({
    image: paint.images['images/foot.png'],
    position: {
      x: canvas.width * (player.breaking ? 0.48 : 0.55),
      y: canvas.height * (player.breaking ? 0.83 : 0.8),
    },
    anchor: {
      x: 0.5,
      y: 0
    },
    scale: canvas.clientWidth / 1200,
    angle: player.breaking ? -0.1 : 0
  });

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
    scale: canvas.clientWidth / 1000,
    angle: player.steeringWheelAngle
  })

  ctx.restore();
}

boot();
