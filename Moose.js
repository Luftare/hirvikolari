class Moose extends VisibleObject {
  constructor(position) {
    super(position)
    this.imageSrc = 'images/moose.png';
    this.scale = 3.5;
    this.velocity = new V3(meters(-4), 0, 0);

    this.relocate();
  }

  update(dt) {
    this.position.scaledAdd(dt, this.velocity);

    if (this.position.z < player.position.z) {
      this.relocate();
    }
  }

  relocate() {
    this.position.z = player.position.z + meters(gameConfig.fogVisibility) + Math.random() * meters(500);
    const fromLeft = Math.random() > 0.5;

    if (fromLeft) {
      this.position.x = -Math.random() * meters(100);
      this.velocity = new V3(meters(4), 0, 0);
      this.imageSrc = Moose.imageSrcRight;
    } else {
      this.position.x = Math.random() * meters(100);
      this.velocity = new V3(meters(-4), 0, 0);
      this.imageSrc = Moose.imageSrcLeft;
    }
  }
}

Moose.imageSrcLeft = 'images/moose.png';
Moose.imageSrcRight = 'images/moose-right.png';
