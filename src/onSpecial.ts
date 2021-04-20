//this is the main locic

import { Pixel as Pixel } from "./pixel";
import { PIXELSIZE, COLORS, Settings as Setting, Direction, HEIGHT, MAX_LEVEL, SCALE, SPEED, WIDTH, bricksSpecial} from "./constants";
import { Playground as Playground } from "./playground";
import { Snake } from "./snake";
import { Game } from "./game";

export class OnSpecial extends Game{

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
    
      //ls: ON20 Special 
      const { pixelWidth: cellWidth, pixelHeight: cellHeight } = this.setting;
      context.fillStyle = 'rgb(52,52,52)';
      bricksSpecial.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight))

      // snake
      this.snake.draw(time, context);
  }

  checkCondition() {

      const cell = this.snake.getSnakeHead();

      // left the play area or ate itself?? 
      //ls: OO20 Special check condition added
      if (this.isOutside(cell) || this.snake.isSnake(cell)|| this.crashedInBricks(cell)) {
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

  //ls: On20 Special function: if Snake crashed in Bricks? --> true
    crashedInBricks(pixel: Pixel){
    return bricksSpecial.find(el => pixel.x == el.x && pixel.y == el.y);
  }

}

