import Brick from "./brick.js";

export function buildLevel(game, level) {
  let bricks = [];
  level.forEach((r, rIndex) => {
    r.forEach((b, bIndex) => {
      if(b) {
        bricks.push(new Brick(game, { x: bIndex * 80, y: 50 + (rIndex * 24) }));
      }
    })
  });
  return bricks;
}

export const level1 = [
  [0,1,1,0,1,1,0,1,1,0],
];

export const level2 = [
  [1,1,1,1,1,1,1,1,1,1],
];

export const level3 = [
  [0,1,0,1,0,1,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,1],
  [0,1,0,1,0,1,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,1]
];

export const level4 = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
];

export const level5 = [
  [0,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,0,0,1,0],
  [0,1,0,0,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,0]
];

export const levels = [
  level1,
  level2,
  level3,
  level4,
  level5
]
