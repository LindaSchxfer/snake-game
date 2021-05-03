// Das ist der Modus Klassik

import { Game } from "./game";
import { Playground } from "./playground";

export class Classic extends Game{

    constructor() {
      super();
      // ls: liefert für den specialMode in playground.ts false
      this.playground = new Playground(this, false);
    }
}


