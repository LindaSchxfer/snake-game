//this is the mode classic

import { SCALE } from "./constants";
import { Game } from "./game";
import { Playground } from "./playground";

export class Classic extends Game{

    constructor() {
      super();
      // ls: liefert für den specialMode in playground.ts false
      this.playground = new Playground(this, false);
    }

    display(time:number) {
    
      const {width, height, color, level} = this.setting;
      const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;   
    
      // Hintergrund
      context.fillStyle = color;
      context.fillRect(0,0,width,height);
    
      // Level
      context.font = height + "px Roboto Condensed";
      context.textBaseline = "middle";
      context.textAlign = "center";
      context.fillStyle = "rgba(0,0,0,0.1)";
      context.fillText(String(level+1), width/2, height/2);
    
      // Punktzahl
      context.font = 35 * SCALE + "px Roboto Condensed";
      context.textAlign = "left";
      context.textBaseline = "top";
      context.fillStyle = "rgba(0,0,0,0.25)";
      context.fillText(String(this.score), 10*SCALE, 10*SCALE);

      // Spielfeld
      this.playground.draw(time, context);

      // Schlange neu gezeichnet
      this.snake.draw(time, context);
    }

    checkCondition() {

      const cell = this.snake.getSnakeHead();

      // Das Spielfeld verlassen? Sich selbst gefressen?
      if (this.isOutside(cell) || this.snake.isSnake(cell)) {
          // Tod
          return -1;
      }

      // Kiwi gefressen?
      if (this.playground.isKiwi(cell)) {
          return 1;
      }

      // nichts Besonderes
      return 0;
    } 
}


