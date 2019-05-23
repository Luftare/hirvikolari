class Player extends VisibleObject {
  constructor(position) {
    super(position);
    this.velocity = new V3(0, 0, meters(kmhToMs(gameConfig.playerVelocityInKmH)));
    this.breakAcceleration = meters(gameConfig.breakDeceleration);
    this.breaking = false;
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
      this.breaking = true;
    }

    //this.velocity.x = -gameConfig.roadCurve * this.velocity.z * 0.7;

    if (input.keysDown.e) {
      this.position.y -= meters(50) * dt;
    }

    if (input.keysDown.q) {
      this.position.y += meters(50) * dt;
    }

    if (input.keysDown.ArrowLeft) {
      this.steeringWheelAngle -= this.steeringWheelAngularSpeed * dt;
    }

    if (input.keysDown.ArrowRight) {
      this.steeringWheelAngle += this.steeringWheelAngularSpeed * dt;
    }

    this.steeringWheelAngle = gameConfig.roadCurve * 0.5;

    //this.steeringWheelAngle = Math.max(-this.maxSteeringWheelAngle, Math.min(this.maxSteeringWheelAngle, this.steeringWheelAngle));

    //this.velocity.x += 100 * this.velocity.z * this.steeringWheelAngle * dt;

    if (this.breaking) {
      this.velocity.z = Math.max(0, this.velocity.z - this.breakAcceleration * dt);
    };

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
      loop.stop();
    }
  }

  render() {

  }
}
