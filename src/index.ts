// Das ist die Haupt Logik

import { Game } from "./game";
import { Interchanged } from "./interchanged";
import { NoWalls } from "./noWalls";
import { OnSpecial } from "./onSpecial";

// ls: Anzeigen des Menüs zur Spielmodiauswahl
class MainMenu{

  private wrapper: HTMLDivElement;
  private buttonClassic: HTMLButtonElement;
  private buttonSpecial: HTMLButtonElement;
  private buttonInterchanged: HTMLButtonElement;
  private buttonNoWalls: HTMLButtonElement;

  constructor(){

    // ls: Div erstellen um später Menü auszublenden
    this.wrapper = document.createElement("div");
    this.wrapper.setAttribute("id", "wrapper");
    this.wrapper.setAttribute("class", "modiauswahl");

    // ls: Button zum starten des Spielmodus Classic auf onclick event
    this.buttonClassic = document.createElement("button");
    this.buttonClassic.onclick = this.startClassic;
    this.buttonClassic.innerHTML = "Classic";

    // ls: Button zum starten des Spielmodus OnSpecial auf onclick event
    this.buttonSpecial = document.createElement("button");
    this.buttonSpecial.onclick = this.startSpecial;
    this.buttonSpecial.innerHTML = "ON20 Special";

    // ls: Button zum starten des Spielmodus Interchanged auf onclick event
    this.buttonInterchanged = document.createElement("button");
    this.buttonInterchanged.onclick = this.startInterchanged;
    this.buttonInterchanged.innerHTML = "Interchanged";

    // ls: Button zum starten des Spielmodus No Walls auf onclick event
    this.buttonNoWalls = document.createElement("button");
    this.buttonNoWalls.onclick = this.startNoWalls;
    this.buttonNoWalls.innerHTML = "No Walls";

    // ls: Buttons dem Div als Kindelement hinzufügen
    this.wrapper.appendChild(this.buttonClassic);
    this.wrapper.appendChild(this.buttonSpecial);
    this.wrapper.appendChild(this.buttonInterchanged);
    this.wrapper.appendChild(this.buttonNoWalls);
    document.body.appendChild(this.wrapper);
  }

  // ls: Modus Classic erstellt, gestartet, wrapper wird ausgeblendet
  startClassic(){
    const classic = new Game(); // ls: Für den Modus Classic wird Game gestartet, da diese alles für den Classic Mode beinhaltet und keine Zusätze nötig sind  
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

  // ls: Modus Interchanged erstellt, gestartet, wrapper wird ausgeblendet
  startInterchanged() {
    const interchanged = new Interchanged();    
    const wrapper = document.getElementById("wrapper");
      if(wrapper != null){
      wrapper.style.display = "none";
      }    
    interchanged.start();
  }

   // ls: Modus No Walls erstellt, gestartet, wrapper wird ausgeblendet
   startNoWalls(){
    const noWalls = new NoWalls();    
    const wrapper = document.getElementById("wrapper");
      if(wrapper != null){
      wrapper.style.display = "none";
      }    
    noWalls.start();
  }
}

// ls: Startet das Hauptmenü des Spiels
window.focus();
new MainMenu();
