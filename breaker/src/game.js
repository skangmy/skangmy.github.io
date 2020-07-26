import Paddle from './paddle.js';
import InputHandler from './input.js';
import Ball from './ball.js';
import Brick from './brick.js';
import { levels, buildLevel } from './levels.js';
import PowerUp from './powerUp.js';

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
    this.powerUps = [
      'live', 
      'star', 
      'expand',
      'speed',
    ];
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;    

    this.gameState = GAME_STATE.MENU;

    this.paddle = new Paddle(this);
    this.ball = new Ball(this);
    this.gameObjects = [];
    this.bricks = [];
    this.powerUp = null;
    this.noPowerUp = 0;
    
    this.score = 0;  
    this.lives = 3;
    this.levels = levels;
    this.currentLevel = 0;

    this.powerUpFactor = 0;

    this.heartImg = document.getElementById('img_heart');

    new InputHandler(this.paddle, this);  
  }

  addLive() {
    this.lives++;
    if (this.lives >= 5) {
      this.powerUps = this.powerUps.filter(pu => pu !== 'live');
    }
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

    // setTimeout(() => {
    //   // this.paddle.expand()
    //   this.paddle.speedUp();
    //   setTimeout(() => {
    //     this.paddle.speedUpTime = 0;
    //   }, 10000);
    // }, 5000);
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

    // the longer the game play, the higher chance of getting power up
    // increase probability of power up by 0.1% every sec
    if (this.gameState === GAME_STATE.RUNNING) {
      if (this.noPowerUp <= 0) {
        this.powerUpFactor = Math.min(this.powerUpFactor + (deltaTime / 1000) * 0.01, 0.25); // cap to 25%
      } else {
        this.noPowerUp = Math.max(this.noPowerUp - deltaTime, 0);
      }
    }

    [...this.gameObjects, ...this.bricks].forEach(obj => obj.update(deltaTime));
    
    if (this.powerUp) {
      this.powerUp.update(deltaTime);
    }

    let bricksBefore = this.bricks.length;
    this.bricks.filter(brick => brick.markedForDeletion).forEach((brick) => {
      if(this.powerUps.length > 0 && Math.random() >= 1 - this.powerUpFactor) {
        // power up!!
        // no power up for the next 30 sec
        this.noPowerUp = 30000;
        this.powerUpFactor = 0;
        
        // generate random power up
        const puIndex = Math.floor(Math.random() * this.powerUps.length);
        const powerUpType = this.powerUps[puIndex];
        
        this.powerUp = new PowerUp(this, powerUpType, (brick.position.x + (brick.width / 2)), brick.position.y);
        if (powerUpType !== 'live') {
          this.powerUps = this.powerUps.filter(pu => pu !== powerUpType);
        }
      }
    })
    this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);

    // remove
    if(this.powerUp && this.powerUp.isGone) {
      if (this.powerUp.isTaken) {
        switch(this.powerUp.type) {
          case 'live':
            this.addLive();
            break;
          case 'star':
            this.ball.startStar();
            break;
          case 'expand':
            this.paddle.expand();
            break;
          case 'speed':
            this.paddle.speedUp();
            break;
        }
      }
      this.powerUp = undefined;  
    }

    // calculate score
    this.score += bricksBefore - this.bricks.length;

    if(this.bricks.length === 0) {
      this.currentLevel++;

      // add one live when complete a level
      this.addLive();
      
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
    
    if (this.powerUp) {
      this.powerUp.draw(ctx);
    }


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
    } else if (this.gameState === GAME_STATE.RUNNING || this.gameState === GAME_STATE.LAUNCH) {
      ctx.font = '16px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.fillText('Level ' + (this.currentLevel + 1), 5, 20); 

      ctx.textAlign = 'center';
      ctx.fillText('Score: ' + this.score, this.gameWidth / 2, 20); 


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
    this.ball.star = 0;
    this.paddle.reset();
    if (this.lives < 5 && this.powerUps.indexOf('live') < 0) {
      this.powerUps.push('live');
    }
  }
}