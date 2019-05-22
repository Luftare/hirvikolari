class Tree extends VisibleObject {
  constructor(position) {
    super(position)
    this.dimensions = {
      width: 300,
      height: 800
    };
    const imageIndex = Math.floor(Math.random() * Tree.imageSources.length);
    this.imageSrc = Tree.imageSources[imageIndex];
    this.scale = 6;
  }

  update(dt) {
    if (this.position.z < camera.position.z) {
      this.position.z += meters(100) + Math.random() * meters(300);
    }
  }
}

Tree.imageSources = ['images/pine0.png', 'images/pine1.png', 'images/oak0.png']