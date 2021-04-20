//this is the main locic

import { Pixel as Pixel } from "./pixel";
import { PIXELSIZE, COLORS, Settings as Setting, Direction, HEIGHT, MAX_LEVEL, SCALE, SPEED, WIDTH, bricksSpecial} from "./constants";
import { Playground as Playground } from "./playground";
import { Snake } from "./snake";
import { Game } from "./game";

export class Classic extends Game{

  constructor() {
      super();
  }

  display(time:number) {
    
      const {width, height, color, level} = this.setting;
      const context:any = this.canvas.getContext("2d");
    
      // background
      context.fillStyle = color;
      context.fillRect(0,0,width,height);
    
      // level
      context.font = height+'px Roboto Condensed';
      context.textBaseline = 'middle';
      context.textAlign = 'center';
      context.fillStyle = 'rgba(0,0,0,0.1)';
      context.fillText(level+1, width/2, height/2);
    
      // score
      context.font = 35 * SCALE + 'px Roboto Condensed';
      context.textAlign = 'left';
      context.textBaseline = 'top';
      context.fillStyle = 'rgba(0,0,0,0.25)';
      context.fillText(this.score, 10*SCALE, 10*SCALE);

      // playground
      this.playground.draw(time, context);

      // snake
      this.snake.draw(time, context);
  }

  checkCondition() {

      const cell = this.snake.getSnakeHead();

      // left the play area or ate itself?? 
      if (this.isOutside(cell) || this.snake.isSnake(cell)) {
          // dead
          return -1;
      }

      // ate kiwi?
      if (this.playground.isKiwi(cell)) {
          return 1;
      }

      // nothing special
      return 0;
  } 
}


