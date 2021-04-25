//this is the main locic

import { textSpanContainsPosition } from "../node_modules/typescript/lib/typescript";
import {Classic} from "./classic";
import { OnSpecial } from "./onSpecial";


class Test{

  public wrapper: HTMLDivElement;

  constructor(){
    
  this.wrapper = document.createElement("div");
  this.wrapper.setAttribute("id", "wrapper");
  this.wrapper.setAttribute("class", "modiauswahl")
  let button1 = document.createElement("button");
  button1.onclick = this.startClassic;
  button1.innerText = "Classic";
  let button2 = document.createElement("button");
  button2.onclick = this.startSpecial;
  button2.innerText = "ON20-Special";
  this.wrapper.appendChild(button1);
  this.wrapper.appendChild(button2);
  document.body.appendChild(this.wrapper);
  }
  
  //ls: Modus Classic
 startClassic(){
  const classic = new Classic();  
  const wrapper = document.getElementById("wrapper");
  if(wrapper != null){
    wrapper.style.display = "none";
  }    
  classic.start(); 
  
 }

  //ls: Modus ON20-Special
 startSpecial(){
 
  const onSpecial = new OnSpecial();    
  const wrapper = document.getElementById("wrapper");
  if(wrapper != null){
    wrapper.style.display = "none";
  }    
  onSpecial.start();      //ls: Modus Classic
 
 }

}

window.focus();
const test = new Test();



//window.focus();
//new Classic().start();      //ls: Modus Classic
//new OnSpecial().start();    //ls: Modus ON20-Special


/*window.focus = () => {
    let div = document.createElement("div");
    div.innerText = "hallo";
}*/

/* Elemente einblenden
// Mit show_elements() können einzelne oder mehrere Elemente
// via show_elements('ElementIDone','ElementIDtwo','ElementIDthree')
// eingeblendet werden.
function show_elements()
 {
  var elementNames = show_elements.arguments;
  for (var i=0; i<elementNames.length; i++)
   {
     var elementName = elementNames[i];
     document.getElementById(wrapper).style.display='block';
   }
 }
// Elemente ausblenden
// Mit show_elements() können einzelne oder mehrere Elemente
// via hide_elements('ElementIDone','ElementIDtwo','ElementIDthree')
// ausgeblendet werden.
function hide_elements()
 {
  var elementNames = hide_elements.arguments;
  for (var i=0; i<elementNames.length; i++)
   {
     var elementName = elementNames[i];
     document.getElementById(wrapper).style.display='none';
   }
 }*/