import Paddle from './paddle.js';
import InputHandler from './input.js';
import Ball from './ball.js';
import Brick from './brick.js';
import { levels, buildLevel } from './levels.js';

const GAME_STATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  WIN: 5,
  LAUNCH: 6,
}

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;    

    this.gameState = GAME_STATE.MENU;

    this.paddle = new Paddle(this);
    this.ball = new Ball(this);
    this.gameObjects = [];
    this.bricks = [];
  
    this.lives = 3;
    this.levels = levels;
    this.currentLevel = 0;

    this.heartImg = document.getElementById('img_heart');

    new InputHandler(this.paddle, this);  
  }

  start() {
    if (this.isLaunch()) {
      this.gameState = GAME_STATE.RUNNING;
      return;
    }
    
    if (this.gameState !== GAME_STATE.MENU && this.gameState !== GAME_STATE.NEWLEVEL) { 
      return;
    }

    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    this.ball.reset();

    this.gameObjects = [
      this.paddle,
      this.ball,
    ];
    
    this.gameState = GAME_STATE.LAUNCH;
    
  }

  update(deltaTime) {
    if( this.lives <= 0) { 
      this.gameState = GAME_STATE.GAMEOVER; 
    }

    if (this.gameState === GAME_STATE.PAUSED 
      || this.gameState === GAME_STATE.MENU 
      || this.gameState === GAME_STATE.GAMEOVER 
      || this.gameState === GAME_STATE.WIN) {
      return;
    }

    [...this.gameObjects, ...this.bricks].forEach(obj => obj.update(deltaTime));
    this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);

    if(this.bricks.length === 0) {
      this.currentLevel++;
      if (this.currentLevel < this.levels.length) {
        this.gameState = GAME_STATE.NEWLEVEL;
        this.start();
      } else {
        this.gameState = GAME_STATE.WIN;
      }
    }

  }
  
  draw(ctx) {
    [...this.gameObjects, ...this.bricks].forEach(obj => obj.draw(ctx));
    
    if (this.gameState === GAME_STATE.PAUSED) {
      ctx.rect(0,0, this.gameWidth, this.gameHeight); 
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', this.gameWidth / 2, this.gameHeight / 2); 
    } else if (this.gameState === GAME_STATE.MENU) {
      ctx.rect(0,0, this.gameWidth, this.gameHeight); 
      ctx.fillStyle = 'rgba(255, 255, 255)';
      ctx.fill();

      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACEBAR to start', this.gameWidth / 2, this.gameHeight / 2); 
    } else if (this.gameState === GAME_STATE.GAMEOVER) {
      ctx.rect(0,0, this.gameWidth, this.gameHeight); 
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();

      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', this.gameWidth / 2, this.gameHeight / 2); 
    } else if (this.gameState === GAME_STATE.WIN) {
      ctx.rect(0,0, this.gameWidth, this.gameHeight); 
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();

      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText('YOU WIN!', this.gameWidth / 2, this.gameHeight / 2); 
    } else if (this.gameState === GAME_STATE.RUNNING) {
      console.log('LEVEL ' + this.currentLevel)
      ctx.font = '16px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.fillText('Level ' + (this.currentLevel + 1), 5, 20); 

      for(let i = 0; i < this.lives; i++) {
        ctx.drawImage(
          this.heartImg,
          this.gameWidth - 24 - (i * 24),
          5,
          16,
          16
        )
      }
    }
  }

  togglePause() {
    // update game state
    if (this.gameState === GAME_STATE.PAUSED)
      this.gameState = GAME_STATE.RUNNING;
    else 
      this.gameState = GAME_STATE.PAUSED;
  }

  isLaunch() {
    return this.gameState === GAME_STATE.LAUNCH;
  }

  ballLoss() {
    this.lives--;
    this.gameState = GAME_STATE.LAUNCH;
  }
}