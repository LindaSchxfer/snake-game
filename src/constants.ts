//this are the constants

export const WIDTH = 60; // number of squares vertical
export const HEIGHT = 35; // number of squares horizontal
export const PIXELSIZE = 20; // size of one square
export const SCALE = 2.0; // draw everything twice as big and make it smaller to get clean lines even on a retina screen
export const SPEED = 150; // initial speed
export const MAX_LEVEL = 10;
export const KIWI = 1;

// level background colors
export const COLORS = [
  "#fafafa",
  "#ffffcc",
  "#ffe6ee",
  "#e6f2ff",
  "#e6ffe6",
  "#fff0e6",
  "#e6e6ff",
  "#f9f2ec",
  "#e6ffe6",
  "#ff4d4d",
];

export interface Settings {
    level: number;
    speed: number;
    nbPixelX: number;
    nbPixelY: number;
    width: number;
    height: number;
    pixelWidth: number;
    pixelHeight: number;
    color: string;
}

// ls: Move directions (changed type to enum)
export enum Direction { "Up" , "Right" , "Left" , "Down" , null }

// ls: ON20 Special build the ON20 Bricks Array
export const bricksSpecial = [
  //row 1
  {"x": 10, "y": 13},
  {"x": 11, "y": 13},
  {"x": 14, "y": 13},
  {"x": 15, "y": 13}, 
  {"x": 19, "y": 13}, 
  {"x": 26, "y": 13}, 
  {"x": 35, "y": 13}, 
  {"x": 36, "y": 13}, 
  {"x": 37, "y": 13}, 
  {"x": 38, "y": 13}, 
  {"x": 39, "y": 13},
  {"x": 44, "y": 13},
  {"x": 45, "y": 13},
  {"x": 48, "y": 13},
  {"x": 49, "y": 13},
  
  //row 2
  {"x": 9, "y": 14},
  {"x": 16, "y": 14},
  {"x": 19, "y": 14},
  {"x": 20, "y": 14}, 
  {"x": 26, "y": 14}, 
  {"x": 34, "y": 14}, 
  {"x": 40, "y": 14}, 
  {"x": 43, "y": 14}, 
  {"x": 50, "y": 14}, 

  //row 3
  {"x": 9, "y": 15},
  {"x": 16, "y": 15},
  {"x": 19, "y": 15},
  {"x": 20, "y": 15},
  {"x": 21, "y": 15},
  {"x": 26, "y": 15},
  {"x": 40, "y": 15},
  {"x": 43, "y": 15},
  {"x": 50, "y": 15},

  //row 4
  {"x": 9, "y": 16},
  {"x": 16, "y": 16},
  {"x": 19, "y": 16},
  {"x": 22, "y": 16},
  {"x": 26, "y": 16},
  {"x": 39, "y": 16},
  {"x": 43, "y": 16},
  {"x": 50, "y": 16},

  //row 5
  {"x": 9, "y": 19},
  {"x": 16, "y": 19},
  {"x": 19, "y": 19},
  {"x": 23, "y": 19},
  {"x": 26, "y": 19},
  {"x": 36, "y": 19},
  {"x": 43, "y": 19},
  {"x": 50, "y": 19},

  //row 6
  {"x": 9, "y": 20},
  {"x": 16, "y": 20},
  {"x": 19, "y": 20},
  {"x": 24, "y": 20},
  {"x": 25, "y": 20},
  {"x": 26, "y": 20},
  {"x": 35, "y": 20},
  {"x": 43, "y": 20},
  {"x": 50, "y": 20},

  //row 7
  {"x": 9, "y": 21},
  {"x": 16, "y": 21},
  {"x": 19, "y": 21},
  {"x": 25, "y": 21},
  {"x": 26, "y": 21},
  {"x": 34, "y": 21},
  {"x": 35, "y": 21},
  {"x": 43, "y": 21},
  {"x": 50, "y": 21},

  //row 8
  {"x": 10, "y": 22},
  {"x": 11, "y": 22},
  {"x": 14, "y": 22},
  {"x": 15, "y": 22},
  {"x": 19, "y": 22},
  {"x": 26, "y": 22},
  {"x": 34, "y": 22},
  {"x": 35, "y": 22},
  {"x": 36, "y": 22},
  {"x": 37, "y": 22},
  {"x": 38, "y": 22},
  {"x": 39, "y": 22},
  {"x": 40, "y": 22},
  {"x": 44, "y": 22},
  {"x": 45, "y": 22},
  {"x": 48, "y": 22},
  {"x": 49, "y": 22}
]
