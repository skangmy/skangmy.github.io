export default class InputHandler {
  constructor (paddle, game) {
      document.addEventListener('keydown', (evt) => {
        // alert(evt.keyCode);
        switch(evt.keyCode) {
          case 37:
            paddle.moveLeft();
            break;
          case 39:
            paddle.moveRight();
            break;
          case 27:
            game.togglePause();
            break;
          case 32:
            game.start();
            break;
        }
      });
      document.addEventListener('keyup', (evt) => {
        // alert(evt.keyCode);
        switch(evt.keyCode) {
          case 37:
            if(paddle.speed < 0) paddle.stop();
            break;
          case 39:
            if(paddle.speed > 0) paddle.stop();
            break;

        }
      });

  }
}