// this is the snake

import { Pixel } from "./pixel";
import { CELLSIZE, Direction, SCALE } from "./constants";
import { Game } from "./index";

export class Snake {

  readonly INITIAL_SIZE = 3;
  readonly INITIAL_DIRECTION = 'Right';
  readonly INITIAL_POSITION = { x: 1, y: 1 };

  private snakeHead: Pixel;
  private snakeTail: Pixel[];
  private snakeDirection: Direction[];
  private size: number;
  private game: Game;

  constructor(game:Game) {
      this.game = game;
     
      this.size = this.INITIAL_SIZE;
      this.snakeDirection = [this.INITIAL_DIRECTION];
      
      // initial head
      this.snakeHead = new Pixel(this.INITIAL_POSITION.x, this.INITIAL_POSITION.y);
    
      // initial tail
      this.snakeTail = [];
  }

  setDirection(direction:Direction) {
      const lastDirection = this.snakeDirection[this.snakeDirection.length-1];
      if(lastDirection == 'Up' && (direction == 'Down' || direction == 'Up')) {
        return;
      }
      if(lastDirection == 'Down' && (direction == 'Up' || direction == 'Down')) {
        return;
      }
      if(lastDirection == 'Left' && (direction == 'Right' || direction == 'Left')) {
        return;
      }
      if(lastDirection == 'Right' && (direction == 'Left' || direction == 'Right')) {
        return;
      }
      this.snakeDirection.push(direction);
  }

  move() {
    
      // add current head to tail
      this.snakeTail.push(this.snakeHead);

      // get next position
      this.snakeHead = this.getNext();

      // fix the snake size
      if (this.snakeTail.length > this.size) {
          this.snakeTail.splice(0, 1);
      }
  }

  getNext():any {
      const direction = this.snakeDirection.length > 1 ? this.snakeDirection.splice(0,1)[0] : this.snakeDirection[0];
      switch (direction) {
          case 'Up':
              return new Pixel(this.snakeHead.x, this.snakeHead.y - 1);
          case 'Right':
              return new Pixel(this.snakeHead.x+1, this.snakeHead.y);
          case 'Down':
              return new Pixel(this.snakeHead.x, this.snakeHead.y + 1);
          case 'Left':
              return new Pixel(this.snakeHead.x-1, this.snakeHead.y);
      }
  }

  draw(time: number, context:CanvasRenderingContext2D) {
      const { pixelWidth: cellWidth, pixelHeight: cellHeight } = this.game.getSettings();
      // head
      const size = CELLSIZE*SCALE/10;
      const offset = CELLSIZE*SCALE/3;
      const x = cellWidth * this.snakeHead.x;
      const y = cellHeight * this.snakeHead.y;
      context.fillStyle="#111111";
      context.fillRect(x, y, cellWidth, cellHeight) 
      // eyes
      switch(this.snakeDirection[0]) {
        case 'Up':
           context.beginPath();
           context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
           context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
           context.fillStyle = 'white';
           context.fill();
          break;
          case 'Down':
           context.beginPath();
           context.arc(x + offset, y + 2*offset, size, 0, 2 * Math.PI, false);
           context.arc(x + 2 * offset, y + 2*offset, size, 0, 2 * Math.PI, false);
           context.fillStyle = 'white';
           context.fill();
          break;
          case 'Right':
           context.beginPath();
           context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
           context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
           context.fillStyle = 'white';
           context.fill();
          break;
          case 'Left':
           context.beginPath();
           context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
           context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
           context.fillStyle = 'white';
           context.fill();
          break;
      }
      // tail
      context.fillStyle="#333333";
      this.snakeTail.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));    
  }

  grow(qty:number = 3) {
      this.size += qty;
  }

  shrink(qty:number = 3) {
      this.size -= qty;
  }

  getHead() {
      return this.snakeHead;
  }

  isSnake(pixel: Pixel) {
       return this.snakeTail.find(el => pixel.x == el.x && pixel.y == el.y);
  }
}


