//this is the mode ON20-Special

import { Game } from "./game";
import { SCALE, bricksSpecial, Pixel } from "./constants";
import { Playground } from "./playground";

export class OnSpecial extends Game{

    constructor() {
      super();
      // ls: liefert für den specialMode in playground.ts true
      this.playground = new Playground(this, true);
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
    
      // Punkzahl
      context.font = 35 * SCALE + "px Roboto Condensed";
      context.textAlign = "left";
      context.textBaseline = "top";
      context.fillStyle = "rgba(0,0,0,0.25)";
      context.fillText(String(this.score), 10*SCALE, 10*SCALE);

      // Spielfeld
      this.playground.draw(time, context);
    
      //ls: ON20 Special Wände werden im Spielfeld angezeigt
      const { pixelWidth: cellWidth, pixelHeight: cellHeight } = this.setting;
      context.fillStyle = "rgb(52,52,52)";
      bricksSpecial.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight))

      // Schlange neu gezeichnet
      this.snake.draw(time, context);
    }

    checkCondition() {

      const cell = this.snake.getSnakeHead();

      // Das Spielfeld verlassen? Sich selbst gefressen? In die ON20 Wände gekracht?
      if (this.isOutside(cell) || this.snake.isSnake(cell)|| this.crashedInBricks(cell)) {
          // Tod
          return -1;
      }

      // Kiwi gegessen?
      if (this.playground.isKiwi(cell)) {
          return 1;
      }

      // nichts Besonderes
      return 0;
    }

    // ls: Wenn Schlange in ON20 Wände kracht liefert diese Funktion true
    crashedInBricks(pixel: Pixel){
    return bricksSpecial.find(el => pixel.x == el.x && pixel.y == el.y);
    }
}

