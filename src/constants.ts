//THIS IS THE ENTRY FILE - WRITE YOUR MAIN LOGIC HERE!

export const WIDTH = 80; // number of squares vertical
export const HEIGHT = 40; // number of squares horizontal
export const CELLSIZE = 20; // size of one square
export const SCALE = 2.0; // draw everything twice as big and make it smaller to get clean lines even on a retina screen
export const SPEED = 100; // initial speed
export const MAX_LEVEL = 10;
export const APPLES = 5;

// level background colors
export const COLORS = [
  '#fafafa',
  '#ffffcc',
  '#ffe6ee',
  '#e6f2ff',
  '#e6ffe6',
  '#fff0e6',
  '#e6e6ff',
  '#f9f2ec',
  '#e6ffe6',
  '#ff4d4d',
];

export interface Configuration {
    level: number;
    speed: number;
    nbCellsX: number;
    nbCellsY: number;
    width: number;
    height: number;
    cellWidth: number;
    cellHeight: number;
    color: string;
}

export type Direction = 'Up' | 'Right' | 'Left' | 'Down' | null ;
