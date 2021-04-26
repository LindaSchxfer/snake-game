//this is the main locic

import {Classic} from "./classic";
import { OnSpecial } from "./onSpecial";

// ls: Anzeigen des Menüs zur Spielmodiauswahl
class MainMenu{

  public wrapper: HTMLDivElement;
  public buttonClassic: HTMLButtonElement;
  public buttonSpecial: HTMLButtonElement;
  public classic: Classic = new Classic();
  public onSpecial: OnSpecial = new OnSpecial();

  constructor(){

    // ls: Div erstellen um später Menü auszublenden
    this.wrapper = document.createElement("div");
    this.wrapper.setAttribute("id", "wrapper");
    this.wrapper.setAttribute("class", "modiauswahl");

    // ls: Button zum Starten des Spielmodus Clasic auf onclick event
    this.buttonClassic = document.createElement("button");
    this.buttonClassic.onclick = this.startClassic;
    this.buttonClassic.innerHTML = "Classic";

    // ls: Button zum Starten des Spielmodus OnSpecial auf onclick event
    this.buttonSpecial = document.createElement("button");
    this.buttonSpecial.onclick = this.startSpecial;
    this.buttonSpecial.innerHTML = "ON20 Special";

    // ls: Buttons dem Div als Kindelement hinzufügen
    this.wrapper.appendChild(this.buttonClassic);
    this.wrapper.appendChild(this.buttonSpecial);
    document.body.appendChild(this.wrapper);
  }

  // ls: Modus Classic erstellt, gestartet, wrapper wird bei Start des Spieles ausgeblendet 
  startClassic(){
      if(this.wrapper != undefined){
      this.wrapper.style.display = "none";
      }
      if(this.classic != undefined){
      this.classic.start();  
      }
  }

  // ls: Modus ON20-Special erstellt, gestartet, wrapper wird bei Start des Spieles ausgeblendet
  startSpecial(){
      if(this.wrapper != undefined){
      this.wrapper.style.display = "none";
      }    
    if(this.onSpecial != undefined){
      this.onSpecial.start();
    }
  }
}

// ls: Startet das Hauptmenü des Spiels
window.focus();
const mainmenu = new MainMenu();
