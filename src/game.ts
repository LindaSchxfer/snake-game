//this is the main game logic

import { Pixel as Pixel } from "./pixel";
import { PIXELSIZE, COLORS, Settings as Setting, Direction, HEIGHT, MAX_LEVEL, SCALE, SPEED, WIDTH} from "./constants";
import { Playground as Playground } from "./playground";
import { Snake } from "./snake";

interface Touch{
  pageX: number;
  pageY: number;

}

export class Game {

    public canvas: HTMLCanvasElement;
    public div: HTMLDivElement;

  public score:number = 0;
  public controlFunction: boolean = false;
  public playground: Playground;
  public snake: Snake;
  public setting: Setting;  
  public nextMove:number = 0;
  public touch: Touch = {pageX:0, pageY:0};
 

  constructor() {

    this.div = document.createElement("div");

      this.canvas = document.createElement('Canvas') as HTMLCanvasElement;
      this.div.appendChild(this.canvas);

      let button1 = document.createElement("button");
      button1.onclick = this.stopOnButton.bind(this);
      button1.innerText = "Stop";
      this.div.appendChild(button1);
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
      };

      this.snake = new Snake(this);
      this.playground = new Playground(this);
    
      // event listeners
      window.addEventListener('keydown', this.onKeyDown.bind(this), false);
      this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
      this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
      this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
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

  stopOnButton(){
    console.log("stop");
    this.stop();
    this.div.remove();
    const wrapper = document.getElementById("wrapper");
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
        
        if (time >= this.nextMove) {
          
            this.nextMove = time + this.setting.speed;
          
            // move once
            this.snake.move();
                        
            // check what happened  
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

  display(time:number) {
    
      const {width, height, color, level} = this.setting;
      const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    
      // background
      context.fillStyle = color;
      context.fillRect(0,0,width,height);
    
      // level
      context.font = height+'px Roboto Condensed';
      context.textBaseline = 'middle';
      context.textAlign = 'center';
      context.fillStyle = 'rgba(0,0,0,0.1)';
      context.fillText(String(level+1), width/2, height/2);
    
      // score
      context.font = 35 * SCALE + 'px Roboto Condensed';
      context.textAlign = 'left';
      context.textBaseline = 'top';
      context.fillStyle = 'rgba(0,0,0,0.25)';
      context.fillText(String(this.score), 10*SCALE, 10*SCALE);

      // playground
      this.playground.draw(time, context);    

      // snake
      this.snake.draw(time, context);
  }

  checkCondition() {


    
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

  levelUp() {
    this.score += 1000;
    this.setting.level++;
    if(this.setting.level < MAX_LEVEL) {
      this.setting.speed -= 7;
      this.setting.color = COLORS[this.setting.level];
      this.playground.scatter();
    } else {
      this.win();
    }
  }

  win() {
    alert("Congrats you beat the game!\r\n\r\nFinal Score: " + this.score);
    this.stop();       
  }

  die() {
    alert("You died.\r\n\r\nFinal Score: " + this.score);
    this.stop();
  }

  isOutside(pixel: Pixel) {
      const { nbPixelX: nbCellsX, nbPixelY: nbCellsY } = this.setting;
      return pixel.x < 0 || pixel.x >= nbCellsX || pixel.y < 0 || pixel.y >= nbCellsY;
  }

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

  onTouchStart(e:TouchEvent) {
      this.touch = e.changedTouches[0];
      e.preventDefault();
  }

  onTouchMove(e:TouchEvent){
      e.preventDefault();
  }

  onTouchEnd(e:TouchEvent){
    
      const touch:Touch = e.changedTouches[0]
      
      const distX = touch.pageX - this.touch.pageX;
      const distY = touch.pageY - this.touch.pageY;
      
      let direction:String = "";

      if (Math.abs(distX) >= 100){ 
        direction = (distX < 0)? 'Left' : 'Right';
      }
      else if (Math.abs(distY) >= 100){
        direction = (distY < 0)? 'Up' : 'Down';
      }
      
      if(direction) {
        this.snake.setDirection(direction);
      }
      
      e.preventDefault()
  }
}
