// Das ist der Modus Keine Wände

import { Game } from "./game";
import { Playground } from "./playground";

export class NoWalls extends Game{

  constructor() {
    super();
    // ls: liefert für den specialMode in playground.ts false
    this.playground = new Playground(this, false);
  }
}


