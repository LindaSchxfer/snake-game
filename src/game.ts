// Das ist die Spiel Logik

import { PIXELSIZE, COLORS, Settings as Setting, HEIGHT, MAX_LEVEL, SCALE, SPEED, WIDTH, Pixel, Direction } from "./constants";
import { Playground as Playground } from "./playground";
import { Snake } from "./snake";

export class Game {

  protected canvas: HTMLCanvasElement;
  private div: HTMLDivElement;
  private buttonExit: HTMLButtonElement;

  protected score:number = 0;
  private controlFunction: boolean = false;
  protected playground: Playground;
  protected snake: Snake;
  protected setting: Setting;  
  private nextMove:number = 0;
 
  constructor() {

    // Div angelegt
    this.div = document.createElement("div");
    this.div.setAttribute("id", "playground");

    // Canvas angelegt
    this.canvas = document.createElement("Canvas") as HTMLCanvasElement;
    this.div.appendChild(this.canvas);

    // ls: Exit Button angelegt
    this.buttonExit = document.createElement("button");
    this.buttonExit.onclick = this.exit.bind(this);
    this.buttonExit.innerText = "Exit";
    this.buttonExit.setAttribute("class", "exitdesign");
    this.div.appendChild(this.buttonExit);

    // Größe des Canvas-Elements auf der Seite
    this.canvas.style.width = WIDTH * PIXELSIZE + 'px';
    this.canvas.style.height = HEIGHT * PIXELSIZE + 'px';

    // Bildpuffergröße
    this.canvas.width = WIDTH * PIXELSIZE * SCALE;
    this.canvas.height = HEIGHT * PIXELSIZE * SCALE;

    // Konfiguration
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
    // ls: liefert für den specialMode in playground.ts false
    this.playground = new Playground(this, false);
  
    // sobald eine Pfeiltaste gedrückt wird, wird die onKeyDown Funktion aufgerufen
    window.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.body.appendChild(this.div);
  }

  // Spiel starten
  start(){
    this.nextMove = 0;
    this.controlFunction = true;
    requestAnimationFrame(this.loop.bind(this));
  }

  // Spiel stoppen
  stop(){
    this.controlFunction = false;
  }

  // ls: Stoppt das Spiel mit dem Exit Button 
  exit(){
    this.stop();
    this.div.remove();
    const wrapper = document.getElementById("wrapper");

    // ls: zuvor versteckter wrapper soll wieder erscheinen um erneut eine Modusauswahl zu treffen
    if(wrapper != null){
    wrapper.style.display = "block";
    }    
  }

  getSettings() {
    return this.setting;
  }

  loop(time:number) {

    // stopp falls controlFunction gleich false
    if(this.controlFunction) {
      
    // rekursion (Funktion ruft sich immer wieder selbst auf)
    requestAnimationFrame(this.loop.bind(this));
    
      // prüfe, ob es Zeit für den nächsten Schlangenschritt ist
      if (time >= this.nextMove) {
      
        // Zeitpunkt für den nächsten Spielzug setzten
        this.nextMove = time + this.setting.speed;
      
        // Schlange einmal bewegen
        this.snake.move();
                    
        // prüfe ob Spiel zu ende / level up / oder normal weiter 
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
            // aktualisieren
            const {width, height, color, level} = this.setting;
            const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
            this.displayBackground(context, color, width, height);
            this.displayLevel(context, width, height, level);
            this.displayScore(context);
            this.displayPlayground(context);
            this.displaySnake(context);
        }
      } 
    }
  }

  // ls: Hintergrundfarbe
  displayBackground(context:CanvasRenderingContext2D, color:string, width:number, height: number) {
    context.fillStyle = color;
    context.fillRect(0,0,width,height);
  }

  // ls: Level
  displayLevel(context:CanvasRenderingContext2D, width:number, height: number, level:number) {
    context.font = height+"px Roboto Condensed";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillStyle = "rgba(0,0,0,0.1)";
    context.fillText(String(level+1), width/2, height/1.75);
  }

  // ls: Punkzahl
  displayScore(context:CanvasRenderingContext2D) {
    context.font = 35 * SCALE + "px Roboto Condensed";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillStyle = "rgba(0,0,0,0.25)";
    context.fillText(String(this.score), 10*SCALE, 10*SCALE);
  }

  // ls: Spielfeld
  displayPlayground(context:CanvasRenderingContext2D) {
    this.playground.draw(context);  
  }

  // ls: Schlange neu gezeichnet
  displaySnake(context:CanvasRenderingContext2D) {
    this.snake.draw(context);
  }

  checkCondition() {

    // Position des Kopfes der Schlange
    const cell = this.snake.getSnakeHead();

    // ls: ist die Schlange aus dem Spielfeld oder hat sie sich selbst gefressen?
    if(this.checkDead(cell)) {
      return -1;
    }
    
    // ls: hat die Schlange eine Kiwi gegessen?
    if(this.ateKiwi(cell)) {
      return 1;
    }

    // nichts Besonderes
    return 0;
  }

  // ls: Den Spielbereich verlassen oder sich selbst gefressen?
  checkDead(cell:Pixel) {

    if (this.isOutside(cell) || this.snake.isSnake(cell)) {
      // Tod
      return true;
    }
  }

  // ls: eine Kiwi gegessen?
  ateKiwi(cell:Pixel) {

    if (this.playground.isKiwi(cell)) {
      return true;
    }
  }

  // alle Kiwis der Runde sind gegessen --> Level Up und +1000 Score
  levelUp() {
    this.score += 1000;
    this.setting.level++;
    if(this.setting.level < MAX_LEVEL) {
      this.setting.speed -= 7;  //Spiel verschnellern
      this.setting.color = COLORS[this.setting.level];  //Hintergrundfarbe ändern
      this.playground.scatter();  //Kiwis verstreuen
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

  // Prüfe ob sich der Kopf der Schlange außerhalb des Canvas befindet
  isOutside(pixel: Pixel) {
      const { nbPixelX: nbCellsX, nbPixelY: nbCellsY } = this.setting;
      // links aus dem Spiel raus / rechts aus dem Spiel raus / oben aus dem Spiel Raus / unten aus dem Spiel raus
      return pixel.x < 0 || pixel.x >= nbCellsX || pixel.y < 0 || pixel.y >= nbCellsY;
  }

  // ls: Prüfe welche Pfeiltaste gedrückt wurde (enum ergänzt)
  onKeyDown(event:KeyboardEvent) {
    switch(event.key) {
      case "ArrowUp":
        event.preventDefault();
        this.snake.setDirection(Direction.UP);
        break;
      case "ArrowDown":
        event.preventDefault();
        this.snake.setDirection(Direction.DOWN);
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.snake.setDirection(Direction.LEFT);
        break;
      case "ArrowRight":
        event.preventDefault();
        this.snake.setDirection(Direction.RIGHT);
        break;
    }
  }
}
