//Das ist der Modus ON20 Special

import { Game } from "./game";
import { bricksSpecial, Pixel } from "./constants";
import { Playground } from "./playground";

export class OnSpecial extends Game{

  constructor() {
    super();
    // ls: liefert für den specialMode in playground.ts true
    this.playground = new Playground(this, true);
  }

  displayPlayground(context:CanvasRenderingContext2D) {

    // Spielfeld wird gezeichnet
    this.playground.draw(context);
    
    //ls: ON20 Special Wände werden im Spielfeld angezeigt
    const { pixelWidth: cellWidth, pixelHeight: cellHeight } = this.setting;
    context.fillStyle = "rgb(52,52,52)";
    bricksSpecial.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
  }

  // Den Spielbereich verlassen, sich selbst gefressen oder in die ON20 Wände gekracht?
  checkDead(cell:Pixel) {

    if (this.isOutside(cell) || this.snake.isSnake(cell) || this.crashedInBricks(cell)) { 
      // Tod
      return true;
    }
  }

  // ls: Wenn Schlange in ON20 Wände kracht liefert diese Funktion true
  crashedInBricks(pixel: Pixel){
  return bricksSpecial.find(el => pixel.x == el.x && pixel.y == el.y);
  }
}

