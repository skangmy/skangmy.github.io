const EXPAND_SPEED = 35;
const PADDLE_START_WIDTH = 150;
const PADDLE_START_MAXSPEED = 7;

export default class Paddle {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.game = game;
    
    this.width = PADDLE_START_WIDTH;
    this.height = 20;
    this.sideWidth = 6;
    this.position = {
      x: this.gameWidth / 2 - this.width / 2,
      y: this.gameHeight - this.height - 10,
    }

    this.expandTime = 0;
    this.speedUpTime = 0;

    this.speed = 0;
    this.maxSpeed = PADDLE_START_MAXSPEED;
    this.imgLeft = document.getElementById('img_paddle_left');
    this.imgMid = document.getElementById('img_paddle_mid');
    this.imgRight = document.getElementById('img_paddle_right');
    this.imgSpeedLeft = document.getElementById('img_paddle_speed_left');
    this.imgSpeedMid = document.getElementById('img_paddle_speed_mid');
    this.imgSpeedRight = document.getElementById('img_paddle_speed_right');
  }

  moveLeft() {
    this.speed = -this.maxSpeed;
  }

  moveRight() {
    this.speed = this.maxSpeed;
  }

  stop() {
    this.speed = 0;
  }

  expand() {
    this.expandTime = 60000;
  }

  speedUp() {
    this.speedUpTime = 60000;
  }

  reset() {
    this.expandTime = 0;
    this.speedUpTime = 0;
  }

  draw(ctx) {
    ctx.fillStyle = '#0ff';
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    let width = this.width - 12;
    let imgLeft = this.speedUpTime > 0 ? this.imgSpeedLeft : this.imgLeft;
    let imgMid = this.speedUpTime > 0 ? this.imgSpeedMid : this.imgMid;
    let imgRight = this.speedUpTime > 0 ? this.imgSpeedRight : this.imgRight;
    ctx.drawImage(
      imgLeft,
      this.position.x,
      this.position.y,
      this.sideWidth,
      this.height,
    );
    ctx.drawImage(
      imgMid,
      this.position.x + this.sideWidth,
      this.position.y,
      width,
      this.height,
    );
    ctx.drawImage(
      imgRight,
      this.position.x + this.width - this.sideWidth,
      this.position.y,
      this.sideWidth,
      this.height,
    );
  }

  update(deltaTime) {
    if (this.speedUpTime > 0) {
      this.maxSpeed = PADDLE_START_MAXSPEED * 1.5;
      this.speedUpTime = Math.max(this.speedUpTime - deltaTime, 0);
    } else {
      this.maxSpeed = PADDLE_START_MAXSPEED;
      
    }

    if (this.expandTime > 0) {
      this.expandTime = Math.max(this.expandTime - deltaTime, 0);
      if (this.width < PADDLE_START_WIDTH * 1.5) {
        this.width += EXPAND_SPEED / deltaTime;
        this.width = Math.min(this.width, PADDLE_START_WIDTH * 1.5);
      }
    } else if(this.width > PADDLE_START_WIDTH) {
      this.width -= EXPAND_SPEED / deltaTime;
      this.width = Math.max(this.width, PADDLE_START_WIDTH);
    }
    this.position.x += this.speed;

    if(this.position.x < 0) this.position.x = 0;
    else if(this.position.x > this.gameWidth - this.width) this.position.x = this.gameWidth - this.width;
  }

  
}