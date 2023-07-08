class Cannon {
  constructor(x, y, width, height, angle) {

    var options = {
      isStatic: true
    }
    this.body = Bodies.rectangle(x, y, width, height, options);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;

    this.cannonImage = loadImage("assets/cannon.png");
    this.cannonBase = loadImage("assets/cannonBase.png");
    World.add(world, this.body);
  }
  show() {

    if(keyIsDown(RIGHT_ARROW) && this.angle < 60){
      this.angle += 1
    }

    if(keyIsDown(LEFT_ARROW) && this.angle > -50){
      this.angle -= 1
    }

    push();
    translate(this.x, this.y);
    rotate(this.angle)
    imageMode(CENTER);
    image(this.cannonImage, 0, 0, this.width, this.height);
    pop();

    image(this.cannonBase, 30, 30, 200, 200);
    noFill();
  }
}
