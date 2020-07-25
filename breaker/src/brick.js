import { detectCollisionNew } from './collisionDetection.js';

export default class Brick {
  constructor(game, position) {
    this.game = game;
    this.image = document.getElementById('img_brick');

    this.position = position;
    this.width = 80;
    this.height = 24;

    this.markedForDeletion = false;
  }

  update(deltaTime) {
    // if(detectCollision(this.game.ball, this)) {
    //   this.game.ball.speed.y = -this.game.ball.speed.y;

    //   this.markedForDeletion = true;
    // }
    let collision = detectCollisionNew(this.game.ball, this);   
    //console.log(collision);
    if(collision.isTop || collision.isBottom) {
      if (this.game.ball.star <= 0) {
        this.game.ball.speed.y = -this.game.ball.speed.y;
      }
      this.markedForDeletion = true
    }
    
    if(collision.isLeft || collision.isRight) {
      if (this.game.ball.star <= 0) {
        this.game.ball.speed.x = -this.game.ball.speed.x;
      }
      this.markedForDeletion = true
    }
  } 

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width / 2,
      this.height,
    );
    ctx.drawImage(
      this.image,
      this.position.x + this.width / 2,
      this.position.y,
      this.width / 2,
      this.height,
    )
  }
}