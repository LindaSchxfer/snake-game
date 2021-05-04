// Das ist der Modus Keine Wände

import { Pixel } from "./constants";
import { Game } from "./game";

export class NoWalls extends Game{

  constructor() {
    super();
  }

  // ls: Spiel soll auch außerhalb der Wand weitergeführt werden, deshalb wird nur geprüft ob die Schlange sich selbst gefressen hat
  checkDead(cell:Pixel) {

    if (this.snake.isSnake(cell)) {
      // Tod
      return true;
    }
  }
}


