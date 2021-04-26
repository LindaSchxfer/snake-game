//this is the main game logic

import { PIXELSIZE, COLORS, Settings as Setting, HEIGHT, MAX_LEVEL, SCALE, SPEED, WIDTH, Pixel} from "./constants";
import { Playground as Playground } from "./playground";
import { Snake } from "./snake";



export class Game {

    public canvas: HTMLCanvasElement;
    public div: HTMLDivElement;
    public buttonExit: HTMLButtonElement;

    public score:number = 0;
    public controlFunction: boolean = false;
    public playground: Playground;
    public snake: Snake;
    public setting: Setting;  
    public nextMove:number = 0;
   
 
  constructor() {

      this.div = document.createElement("div");
      this.canvas = document.createElement('Canvas') as HTMLCanvasElement;
      this.div.appendChild(this.canvas);

      this.buttonExit = document.createElement("button");
      this.buttonExit.onclick = this.stopOnButton.bind(this);
      this.buttonExit.innerText = "Exit";
      this.buttonExit.setAttribute("class", "exitdesign");
      this.div.appendChild(this.buttonExit);
      this.div.setAttribute("id", "playground");
      

      // canvas element size in the page
      this.canvas.style.width = WIDTH * PIXELSIZE + 'px';
      this.canvas.style.height = HEIGHT * PIXELSIZE + 'px';

      // image buffer size 
      this.canvas.width = WIDTH * PIXELSIZE * SCALE;
      this.canvas.height = HEIGHT * PIXELSIZE * SCALE;

      // configuration
      this.setting = {
          level: 0,
          speed: SPEED,
          width: this.canvas.width,
          height: this.canvas.height,
          nbPixelX: WIDTH,
          nbPixelY: HEIGHT,
          pixelWidth: this.canvas.width / WIDTH,
          pixelHeight: this.canvas.height / HEIGHT,
          color: COLORS[0]
      }

      this.snake = new Snake(this);
      this.playground = new Playground(this, false);
    
      // event listeners
      window.addEventListener('keydown', this.onKeyDown.bind(this), false);
      document.body.appendChild(this.div);
  }

  start() {
      this.nextMove = 0;
      this.controlFunction = true;
      requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
      this.controlFunction = false;
  }

  //ls: Stoppt das Spiel ON20 Special mit dem Button Exit
  stopOnButton(){
    this.stop();
    this.div.remove();
    const wrapper = document.getElementById("wrapper");

      //ls: zuvor versteckter wrapper soll wieder erscheinen um erneut eine Auswahl zu treffen
      if(wrapper != null){
      wrapper.style.display = "block";
      }    
  }

  getSettings() {
      return this.setting
  }

  loop(time:number) {

 

      if(this.controlFunction) {
        
        requestAnimationFrame(this.loop.bind(this));
        
        //prüfe ob Zeit ist  für nächster spielzug
        if (time >= this.nextMove) {
          
          
            //Zeitpunkt für den nächsten spielzug setzte
            this.nextMove = time + this.setting.speed;
          
            // move once  schlange bewegen
            this.snake.move();
                        
            // prüfe ob spiel zu ende / level up / oder normal weiter 
            switch (this.checkCondition()) {
                case -1:
                    this.die();
                    break;
                case 1:
                    this.snake.lengthen();
                    this.score += 100;
                    this.playground.eatKiwi(this.snake.getSnakeHead());
                    if(this.playground.isDone()) {
                      this.levelUp();
                    }
                default:
                    // update display
                    this.display(time);
            }
        } 
      }
  }

  //Aktualisiert das Canvas 
  display(time:number) {
    
      const {width, height, color, level} = this.setting;
      const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    
      // background
      context.fillStyle = color;
      context.fillRect(0,0,width,height);
    
      // level
      context.font = height+"px Roboto Condensed";
      context.textBaseline = "middle";
      context.textAlign = "center";
      context.fillStyle = "rgba(0,0,0,0.1)";
      context.fillText(String(level+1), width/2, height/2);
    
      // score
      context.font = 35 * SCALE + "px Roboto Condensed";
      context.textAlign = "left";
      context.textBaseline = "top";
      context.fillStyle = "rgba(0,0,0,0.25)";
      context.fillText(String(this.score), 10*SCALE, 10*SCALE);

      // playground
      this.playground.draw(time, context);    

      // snake neu gezeichnet
      this.snake.draw(time, context);
  }

  checkCondition() {

      //position des Kopfes der Schlange
      const cell = this.snake.getSnakeHead();

      // left the play area or ate itself?? 
      if (this.isOutside(cell) || this.snake.isSnake(cell)) {
          // dead
          return -1;
      }

      // ate kiwi?
      if (this.playground.isKiwi(cell)) {
          return 1;
      }

      // nothing special
      return 0;
  }

  //alle Kiwis der Runde sind gegessen
  levelUp() {
    this.score += 1000;
    this.setting.level++;
    if(this.setting.level < MAX_LEVEL) {
      this.setting.speed -= 7;    //spiel verschnellern
      this.setting.color = COLORS[this.setting.level];  //Hntergrundfarbe ändern
      this.playground.scatter(); //Kiwis verstreuen
    } else {
      this.win();
    }
  }

  win() {
    alert("Congrats you beat Linda´s Snake Game!\r\n\r\nFinal Score: " + this.score);
    this.stop();       
  }

  die() {
    alert("You died.\r\n\r\nFinal Score: " + this.score);
    this.stop();
  }

  //Prüfe ob kopf außerhalb des Canvas
  isOutside(pixel: Pixel) {
      const { nbPixelX: nbCellsX, nbPixelY: nbCellsY } = this.setting;
      // links aus dem Spiel raus / rechts aus dem Spiel raus / oben aus dem speiel Raus / unten aus dem Spiel raus
      return pixel.x < 0 || pixel.x >= nbCellsX || pixel.y < 0 || pixel.y >= nbCellsY;
  }
//Prüfe welche Pfeiltaste gedrückt wurde
 onKeyDown(event:KeyboardEvent) {
     switch(event.key) {
       case 'ArrowUp':
         event.preventDefault();
         this.snake.setDirection('Up');
         break;
       case 'ArrowDown':
         event.preventDefault();
         this.snake.setDirection('Down');
         break;
       case 'ArrowLeft':
         event.preventDefault();
         this.snake.setDirection('Left');
         break;
       case 'ArrowRight':
         event.preventDefault();
         this.snake.setDirection('Right');
         break;
     }
  }
}
