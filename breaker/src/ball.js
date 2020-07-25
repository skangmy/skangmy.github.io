import { detectCollision, detectCollisionNew } from './collisionDetection.js';

export default class Ball {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.game = game;
    this.image = document.getElementById('img_ball');
    this.imageStar = document.getElementById('img_ball_star');
    this.star = 0;
    
    this.size = 16;

    this.reset();
  }

  reset() {
    this.position = {
      x: this.game.paddle.position.x,
      y: this.game.paddle.position.y - 45,
    }

    this.speed = {
      x: 8,
      y: 4,
    };
  }

  startStar() {
    this.star = 60000;
  }

  draw(ctx) {
    let img = this.image;
    if(this.star > 0) {
      img = this.imageStar;
    }
    ctx.drawImage(img, this.position.x, this.position.y, this.size, this.size);
  }

  update(deltaTime) {
    if (this.game.isLaunch()) {
      this.position.x = this.game.paddle.position.x;
      this.position.y = this.game.paddle.position.y - 45;
      return;
    } 
    if (this.star > 0) {
      this.star = Math.max(this.star - deltaTime, 0);
      if (this.star === 0) {
        this.game.powerUps.push('star');
      }
    }

    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if(this.position.x < 0 || this.position.x > this.gameWidth - this.size) this.speed.x = -this.speed.x
    if(this.position.y < 0) this.speed.y = -this.speed.y
    
    if(this.position.y + this.size > this.gameHeight) {
      this.game.ballLoss();
      this.reset();
    }

    let collision = detectCollisionNew(this, this.game.paddle);   
    if(collision.isBottom) {
      this.speed.y = -this.speed.y;
      this.position.y = this.game.paddle.position.y - this.size;
    }
    
    if(collision.isLeft) {
      this.speed.x = -this.speed.x;
      this.position.x = this.game.paddle.position.x + this.game.paddle.width;
    }
    
    if(collision.isRight) {
      this.speed.x = -this.speed.x;
      this.position.x = this.game.paddle.position.x - this.size;
    }
  }
}