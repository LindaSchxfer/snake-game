// Das ist der Modus Klassik

import { Direction } from "./constants";
import { Game } from "./game";
import { Playground } from "./playground";

export class Interchanged extends Game{

    constructor() {
      super();
      // ls: liefert für den specialMode in playground.ts false
      this.playground = new Playground(this, false);
    }
  // Prüfe welche Pfeiltaste gedrückt wurde
  onKeyDown(event:KeyboardEvent) {
    switch(event.key) {
      case "ArrowUp":
        event.preventDefault();
        this.snake.setDirection(Direction.DOWN);
        break;
      case "ArrowDown":
        event.preventDefault();
        this.snake.setDirection(Direction.UP);
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.snake.setDirection(Direction.RIGHT);
        break;
      case "ArrowRight":
        event.preventDefault();
        this.snake.setDirection(Direction.LEFT);
        break;
    }
  }
}


