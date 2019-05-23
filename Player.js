class Player extends VisibleObject {
  constructor(position) {
    super(position);
    this.velocity = new V3(0, 0, 0);
    this.breakAcceleration = meters(parseFloat(gameConfig.breakDeceleration));
    this.steeringWheelAngle = 0;
    this.maxSteeringWheelAngle = 0.5;
    this.steeringWheelAngularSpeed = 1;
  }

  update(dt) {
    this.handleInput(dt)
    this.handleCollisions(dt);
  }

  handleInput(dt) {
    if (input.keysDown[' ']) {
      gameConfig.breaking = true;
    }



    this.steeringWheelAngle = gameConfig.roadCurve * 0.5;

    if (gameConfig.breaking) {
      this.velocity.z = Math.max(0, this.velocity.z - this.breakAcceleration * dt);
    } else {
      this.velocity.z = meters(kmhToMs(parseFloat(gameConfig.playerVelocityInKmH)));
    }

    this.position.scaledAdd(dt, this.velocity);
  }

  handleCollisions() {
    const collidingTree = trees.find(tree => {
      const dX = Math.abs(tree.position.x - this.position.x);
      const dZ = Math.abs(tree.position.z - this.position.z);
      return dX < meters(3) && dZ < meters(4);
    });

    const collidingMoose = mooses.find(moose => {
      const dX = Math.abs(moose.position.x - this.position.x);
      const dZ = Math.abs(moose.position.z - this.position.z);
      return dX < meters(3) && dZ < meters(4);
    });

    if (collidingTree || collidingMoose) {
      this.velocity.set(0, 0, 0);
      gameConfig.breaking = true;
      loop.stop();
    }
  }

  render() {

  }
}
