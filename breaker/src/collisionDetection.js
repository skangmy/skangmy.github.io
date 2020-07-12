export function detectCollision(ball, gameObject) {
  let topOfBall = ball.position.y;
  let bottomOfBall = ball.position.y + ball.size;
  let leftOfBall = ball.position.x;
  let rightOfBall = ball.position.x + ball.size;

  let topOfObject = gameObject.position.y;
  let bottomOfObject = gameObject.position.y + gameObject.height;
  let leftOfObject = gameObject.position.x;
  let rightOfObject = leftOfObject + gameObject.width;

  if(bottomOfBall >= topOfObject 
    && topOfBall <= bottomOfObject
    && leftOfBall >= leftOfObject 
    && rightOfBall <= rightOfObject) { 
    return true;
  }
  return false;
}

export function detectCollisionNew(ball, gameObject) {
  let topOfBall = ball.position.y;
  let bottomOfBall = ball.position.y + ball.size;
  let leftOfBall = ball.position.x;
  let rightOfBall = ball.position.x + ball.size;

  let topOfObject = gameObject.position.y;
  let bottomOfObject = gameObject.position.y + gameObject.height;
  let leftOfObject = gameObject.position.x;
  let rightOfObject = leftOfObject + gameObject.width;

  if(bottomOfBall >= topOfObject 
    && topOfBall <= bottomOfObject
    && leftOfBall <= rightOfObject 
    && rightOfBall >= leftOfObject) { 
    return {
      isLeft: leftOfBall <= rightOfObject && leftOfBall - ball.speed.x > rightOfObject,
      isRight: rightOfBall >= leftOfObject && rightOfBall - ball.speed.x < leftOfObject,
      isTop: topOfBall <= bottomOfObject && topOfBall - ball.speed.y > bottomOfObject,
      isBottom: bottomOfBall >= topOfObject && bottomOfBall - ball.speed.y < topOfObject,
    };
  }
  return {};
}