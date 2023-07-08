const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var engine, world;

var cannon, cannonBall, cannonBase;
var sceneImage, towerImage;
var scene, tower, ground, angle, boat, ball;
var balls = [];
var boats = [];

var boatAnimation = [];
var boatSS, boatSD;

var brokenBoatAnimation = [];
var brokenBoatSS, brokenBoatSD;

var waterSplashAnimation = [];
var waterSplashSS, waterSplashSD;

var bgMusic, cannonEX, cannonWS, pirateLaughing;

var isLaughing = false;
var isGameOver = false;

var score = 0;

function preload() {
  towerImage = loadImage("assets/tower.png");
  sceneImage = loadImage("assets/background.gif");

  boatSS = loadImage("assets/boat/boat.png");
  boatSD = loadJSON("assets/boat/boat.json");

  brokenBoatSS = loadImage("assets/boat/broken_boat.png");
  brokenBoatSD = loadJSON("assets/boat/broken_boat.json");

  waterSplashSS = loadImage("assets/water_splash/water_splash.png");
  waterSplashSD = loadJSON("assets/water_splash/water_splash.json");

  bgMusic = loadSound("assets/background_music.mp3");
  cannonEX = loadSound("assets/cannon_explosion.mp3");
  cannonWS = loadSound("assets/cannon_water.mp3");
  pirateLaughing = loadSound("assets/pirate_laugh.mp3");
}

function setup() {
  createCanvas(1200, 600);

  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES);
  angle = 15;

  var options = {
    isStatic: true
  }

  var boatFrames = boatSD.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var image = boatSS.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(image);
  }

  var brokenBoatFrames = brokenBoatSD.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var image = brokenBoatSS.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(image);
  }

  var waterSplashFrames = waterSplashSD.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var image = waterSplashSS.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(image);
  }

  scene = Bodies.rectangle(600, 300, 10, 10, options);
  World.add(world, scene);

  tower = Bodies.rectangle(120, 360, 160, 310, options);
  World.add(world, tower);

  ground = Bodies.rectangle(600, 600, 1200, 1, options);
  World.add(world, ground);

  score = 0;

  cannon = new Cannon(140, 120, 100, 100, angle);
  cannonBall = new CannonBall(cannon.x, cannon.y);
  boat = new Boat(1200, 570, 170, 170, -60, boatAnimation);

  rectMode(CENTER);
}

function draw() {
  background("black");

  Engine.update(engine);

  if (!bgMusic.isPlaying()) {
    bgMusic.play();
    bgMusic.setVolume(0.1)
  }

  push();
  imageMode(CENTER);
  image(sceneImage, scene.position.x, scene.position.y, 1200, 600);
  pop();

  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  push();
  rect(ground.position.x, ground.position.y, 1200, 1);
  pop();

  Matter.Body.setVelocity(boat.body, {
    x: -0.9,
    y: 0
  });
  boat.show();

  showBoats();
  cannon.show();
  cannonBall.show();

  if (keyCode === 32) {
    cannonBall.shoot();
  }

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collide(i);
  }
}

function keyPressed() {
  if (keyCode === 32) {
    cannonBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, i) {
  if (ball) {
    ball.show();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      if (!ball.isSink) {
        ball.remove(i);
        cannonWS.play();
        cannonWS.setVolume(0.1);
      }
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    balls[balls.length - 1].shoot();
    cannonEX.play();
    cannonEX.setVolume(0.1);
  }
}

function collide(c) {
  for (var i = 0; i < boats.length; i++) {
    if (boats[i] != undefined && balls[c] != undefined) {
      var collision = Matter.SAT.collides(boats[i].body, balls[c].body);
      if (collision.collided) {
        balls[c].remove(c);
        boats[i].remove(i);
      }
    }
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats[boats.length - 1] == undefined || boats[boats.length - 1].body.position.x < width - 250) {
      var p = [-70, -60, -40, -20];
      var pRandom = random(p);
      boat = new Boat(1200, 570, 170, 170, pRandom, boatAnimation);
      boats.push(boat);
    }
    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        });
        boats[i].show();
        boats[i].animate();

        var c = Matter.SAT.collides(this.tower, boats[i].body);

        if (c.collided && !boats[i].isBroken) {
          if (!isLaughing && !pirateLaughing.isPlaying()) {
            pirateLaughing.play();
            pirateLaughing.setVolume(0.1);
            isLaughing = true;
          }
          isGameOver = true;
          gameOver();
        }
      } else {
        boats[i];
      }
    }
  } else {
    boat = new Boat(1200, 570, 170, 170, -60, boatAnimation);
    boats.push(boat)
  }
}

function gameOver() {
  swal({
    title: `GAME OVER`,
    text: `YOU SNOOZE, YOU LOSE!`,
    imageSize: `150x150`,
    confirmButtonText: `Play Again!`
  }, (isConfirm) => {
    if (isConfirm) {
      location.reload();
    }
  });
}