//this is the main locic

import {Classic} from "./classic";
import { OnSpecial } from "./onSpecial";


window.focus();
new Classic().start();      //ls: Modus Classic
new OnSpecial().start();    //ls: Modus ON20-Special


/*window.focus = () => {
    let div = document.createElement("div");
    div.innerText = "hallo";
}*/