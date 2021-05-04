// Das ist der Modus Keine Wände

import { Pixel } from "./constants";
import { Game } from "./game";

export class NoWalls extends Game{

  constructor() {
    super();
  }

  // ls: Spiel wird außerhalb der Wand weitergeführt
  checkDead(cell:Pixel) {

    if (this.snake.isSnake(cell)) {
      // Tod
      return true;
    }
  }
}


