//this is the main locic

import {Classic} from "./classic";
import { OnSpecial } from "./onSpecial";

class MainMenu{

  public wrapper: HTMLDivElement;
  public buttonClassic: HTMLButtonElement;
  public buttonSpecial: HTMLButtonElement;

    constructor(){

      this.wrapper = document.createElement("div");
      this.wrapper.setAttribute("id", "wrapper");
      this.wrapper.setAttribute("class", "modiauswahl");

      this.buttonClassic = document.createElement("button");
      this.buttonClassic.onclick = this.startClassic;
      this.buttonClassic.innerHTML = "Classic";

      this.buttonSpecial = document.createElement("button");
      this.buttonSpecial.onclick = this.startSpecial;
      this.buttonSpecial.innerHTML = "ON20 Special";

      this.wrapper.appendChild(this.buttonClassic);
      this.wrapper.appendChild(this.buttonSpecial);
      document.body.appendChild(this.wrapper);
    }
  
    // ls: Modus Classic erstellt, gestartet, wrapper wird ausgeblendet
    startClassic(){
      const classic = new Classic();  
      const wrapper = document.getElementById("wrapper");
        if(wrapper != null){
        wrapper.style.display = "none";
        }
      classic.start();  
    }

    // ls: Modus ON20-Special erstellt, gestartet, wrapper wird ausgeblendet
    startSpecial(){
      const onSpecial = new OnSpecial();    
      const wrapper = document.getElementById("wrapper");
        if(wrapper != null){
        wrapper.style.display = "none";
        }    
      onSpecial.start();
    }
}

    // ls: Startet das Hauptmenü des Spiels
    window.focus();
    const mainmenu = new MainMenu();
