class Boat {
  constructor(x, y, w, h, boatPos, boatAnimation){
    this.body = Bodies.rectangle(x, y, w, h);
    this.w = w;
    this.h = h;
    this.image = loadImage("assets/boat.png");
    this.speed = 0.05;
    this.animation = boatAnimation;
    this.isBroken = false;
    this.boatPosition = boatPos;
    World.add(world, this.body);
  }
  animate(){
    this.speed += 0.05;
  }
  remove(i){
    this.animation = brokenBoatAnimation;
    this.w = 300;
    this.h = 300;
    this.speed = 0.05;
    this.isBroken = true;
    setTimeout(() => {
      World.remove(world, boats[i].body);
      delete boats[i];
    }, 2500);
  }
  show(){
    var pos = this.body.position;
    var index = floor(this.speed % this.animation.length);
    push();
    translate(pos.x, pos.y)
    imageMode(CENTER);
    image(this.animation[index], 0, this.boatPosition, this.w, this.h);
    pop();
  }
}