let numBalls = 6;
let spring = 1;
let gravity = 0.05;
let friction = -0.7;
let balls = [];
let sounds = [];
let smoothX = 0;
let smoothY = 0;
let smoothingFactor = 0.3
let myInput;
let soundEnabled = false;


function preload(){
  soundFormats('ogg', 'mp3');
  sounds.push(loadSound('sound/FX_piano01.mp3'));
  sounds.push(loadSound('sound/FX_piano03.mp3'));
  sounds.push(loadSound('sound/FX_piano05.mp3'));
  sounds.push(loadSound('sound/FX_piano06.mp3'));
  sounds.push(loadSound('sound/FX_piano08.mp3'));
  sounds.push(loadSound('sound/FX_piano10.mp3'));
}

let x = 100, y = 100, angle1 = 0.0, segLength = 50;

function setup() {
  createCanvas(800, 450);
  for (let i = 0; i < numBalls; i++) {
    balls[i] = new Ball(random(width), random(height/2), random(40, 70), i, balls);
  }
  noStroke();
  strokeWeight(20.0);
  stroke(255, 100);

  // let soundEnabled = false;
  function toggleSound() {
    soundEnabled = !soundEnabled;
    // this.innerHTML = soundEnabled ? '🔇' : '🔊';
    soundButton.html (soundEnabled ? '🔊' : '🔇')
  }

  let soundButton = createButton('🔇');
  soundButton.position(10, 700);
  soundButton.mousePressed(function() {
    if (!soundEnabled){
      userStartAudio();
    }
    toggleSound()
  });

}


function draw() {
  background(235, 174, 52);

  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display();
  });
  smoothX += (mouseX - smoothX) * smoothingFactor;
  smoothY += (mouseY - smoothY) * smoothingFactor;

  fill(255);
  ellipse(smoothX, smoothY, 20, 20);


}

function changeBallColor(newColor) {
  window.currentBallColor = newColor;
}

class Ball {
  constructor(xin, yin, din, idin, oin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
    this.color = this.randomColor();
    this.colorChanged = false;

  }

  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter / 2 + this.diameter / 2;
      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    }
  }

  move() {
    this.vy += gravity;
    let maxSpeed = 3;
    this.vx = constrain(this.vx, -maxSpeed, maxSpeed);
    this.vy = constrain(this.vy, -maxSpeed, maxSpeed);
    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= friction;
    }

    if (abs(this.vy) < 1) {
      this.vy = -10;
    }
  }

  display() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.diameter / 2 && !this.colorChanged) {
      this.color = this.randomColor();
      this.colorChanged = true;
      this.vx += (this.x - mouseX) * 0.15;
      this.vy += (this.y - mouseY) * 0.15;
      window.currentBallColor = this.color.levels;

      if (soundEnabled && !sounds[this.id].isPlaying()) {
        sounds[this.id].play();
      }
    } else {
      this.colorChanged = false;
    }

    fill(this.color);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }



  randomColor() {
    return color(random(255), random(255), random(255));
  }
}



function segment(x, y, a) {
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}


function microBitReceivedMessage(message) {

  let values = message.split(',');
  if (values.length == 3) {
    let xVal = parseInt(values[1]);
    let yVal = (parseInt(values[2])*-1);

    mouseX = map(xVal, -1024, 1024, 0, width);
    mouseY = map(yVal, -1024, 1024, 0, height);
  }
}

function mousePressed(){
  microBitConnect();
}
