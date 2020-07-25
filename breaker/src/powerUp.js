import { detectCollision } from './collisionDetection.js';

export default class PowerUp {
  constructor(game, type, x, y) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.powerUpImg = document.getElementById('img_powerup_' + type);

    this.game = game;
    
    this.type = type;

    this.size = 24;
    this.position = {
      x,
      y,
    }

    this.speed = 2;

    this.isGone = false;
    this.isTaken = false;
  }

  draw(ctx) {
    if (this.powerUpImg) {
      ctx.drawImage(
        this.powerUpImg,
        this.position.x, 
        this.position.y, 
        this.size, 
        this.size
      );
    } else {
      console.log('Missing power up image ' + this.type);
    }
  }

  update(deltaTime) {
    this.position.y += this.speed;

    if(this.position.y + this.size > this.gameHeight) {
      this.isGone = true;
    }

    if(detectCollision(this, this.game.paddle)) {
      this.isTaken = true;
      this.isGone = true;
    }
  }
}