// Das ist der Modus Vertauscht

import { Direction } from "./constants";
import { Game } from "./game";

export class Interchanged extends Game{

  constructor() {
    super();
  }

  // ls: In diesem Modi sind die Steuertasten um 180 Grad vertauscht
  onKeyDown(event:KeyboardEvent) {
  switch(event.key) {
    case "ArrowUp":
      event.preventDefault();
      this.snake.setDirection(Direction.DOWN);    // Pfeil nach oben steuert die Schlange nach unten
      break;
    case "ArrowDown":
      event.preventDefault();
      this.snake.setDirection(Direction.UP);      // Pfeil nach unten steuert die Schlange nach oben
      break;
    case "ArrowLeft":
      event.preventDefault();
      this.snake.setDirection(Direction.RIGHT);   // Pfeil nach links steuert die Schlange nach rechts
      break;
    case "ArrowRight":
      event.preventDefault();
      this.snake.setDirection(Direction.LEFT);    // Pfeil nach rechts steuert die Schlange nach links
      break;
    }
  }
}


