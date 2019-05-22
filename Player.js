class Player extends VisibleObject {
  constructor(position) {
    super(position);
    this.velocity = new V3(0, 0, meters(kmhToMs(100)));
    this.breakAcceleration = meters(5);
    this.breaking = false;
  }

  update(dt) {
    if (input.keysDown[' ']) {
      this.breaking = true;
    }

    this.velocity.x = 0;

    if (input.keysDown.ArrowLeft) {
      this.velocity.x = -this.velocity.z * 0.3;
    }

    if (input.keysDown.ArrowRight) {
      this.velocity.x = this.velocity.z * 0.3;
    }

    if (this.breaking) {
      this.velocity.z = Math.max(0, this.velocity.z - this.breakAcceleration * dt);
    };

    this.position.scaledAdd(dt, this.velocity);
  }

  render() {

  }
}