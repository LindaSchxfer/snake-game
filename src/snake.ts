// Das ist die Schlange

import { PIXELSIZE, Direction, SCALE, Pixel, WIDTH, HEIGHT } from "./constants";
import { Game } from "./game";

export class Snake {

  readonly ORIGINAL_SIZE = 3; // Start Länge des Schlangenkörpers
  readonly ORIGINAL_DIRECTION = Direction.RIGHT; // Start Richtung
  readonly ORIGINAL_POSITION = { x: 1, y: 1 }; // Start Position

  private snakeHead: Pixel;
  private snakeTail: Pixel[];
  private snakeDirection: String[];
  private size: number;
  private game: Game;

    constructor(game:Game) {
      this.game = game;
     
      this.size = this.ORIGINAL_SIZE;
      this.snakeDirection = [this.ORIGINAL_DIRECTION];
      
      // Ursprünglicher Kopf der Schlange
      this.snakeHead = new Pixel(this.ORIGINAL_POSITION.x, this.ORIGINAL_POSITION.y);
    
      // Ursprünglicher Schwanz der Schlange
      this.snakeTail = [];
    }

    // Welche Richtung? (enum ergänzt)
    setDirection(direction:String) {
        const lastDirection = this.snakeDirection[this.snakeDirection.length-1];
        if(lastDirection == Direction.UP && (direction == Direction.DOWN || direction == Direction.UP)) {
            return;
        }
        if(lastDirection == Direction.DOWN && (direction == Direction.UP || direction == Direction.DOWN)) {
            return;
        }
        if(lastDirection == Direction.LEFT && (direction == Direction.RIGHT || direction == Direction.LEFT)) {
            return;
        }
        if(lastDirection == Direction.RIGHT && (direction == Direction.LEFT || direction == Direction.RIGHT)) {
            return;
        }
        this.snakeDirection.push(direction);
    }

    // Bewegung der Schlange 
    move() {
    
        // aktuellen Kopf zum Schwanz hinzufügen
        this.snakeTail.push(this.snakeHead);

        // nächste Position ermitteln
        this.snakeHead = this.getNext();

        // Wenn der Kopf eins weiter rückt muss ein Stück vom Schwanz weggenommen werden
        if (this.snakeTail.length > this.size) {
            this.snakeTail.splice(0, 1);
        }
    }

    // ermittelt abhängig von der Richtung die x und y Werte des neuen Kopfes
    getNext():Pixel {
            
        // ls: Dies wird nur bei dem No Walls Modus ausgeführt, denn wenn die Schlange in den anderen Modi aus dem Spielfeld fährt ist sie tod
        const nbPixelX = WIDTH;
        const nbPixelY = HEIGHT;

        // ls: Prüfe ob die Schlange links außerhalb des Spielfeldes
        if(this.snakeHead.x < 0) {
            return new Pixel(this.snakeHead.x + nbPixelX, this.snakeHead.y);

        // ls: Prüfe ob die Schlange rechts außerhalb des Spielfeldes
        } else if(this.snakeHead.x >= nbPixelX) {
            return new Pixel(0, this.snakeHead.y);

        // ls: Prüfe ob die Schlange oben außerhalb des Spielfeldes
        } else if(this.snakeHead.y < 0) {
            return new Pixel(this.snakeHead.x, this.snakeHead.y + nbPixelY);

        // ls: Prüfe ob die Schlange unten außerhalb des Spielfeldes
        } else if(this.snakeHead.y >= nbPixelY) {
            return new Pixel(this.snakeHead.x, 0);
        }

        // Für alle Modi welche sich nur innerhalb des Spielfeldes abspielen   
        const direction = this.snakeDirection.length > 1 ? this.snakeDirection.splice(0,1)[0] : this.snakeDirection[0];
        switch (direction) {
                
            case Direction.UP:
                return new Pixel(this.snakeHead.x, this.snakeHead.y - 1);
            case Direction.RIGHT:
                return new Pixel(this.snakeHead.x + 1, this.snakeHead.y);
            case Direction.DOWN:
                return new Pixel(this.snakeHead.x, this.snakeHead.y + 1);
            case Direction.LEFT:
                return new Pixel(this.snakeHead.x - 1, this.snakeHead.y);
        }
        return new Pixel(0,0);
    }

    // Schlange wird gezeichnet
    draw(context:CanvasRenderingContext2D) {
        const { pixelWidth: cellWidth, pixelHeight: cellHeight } = this.game.getSettings();

        // Kopf
        const size = PIXELSIZE*SCALE/10;
        const offset = PIXELSIZE*SCALE/3;
        const x = cellWidth * this.snakeHead.x;
        const y = cellHeight * this.snakeHead.y;
        context.fillStyle="#6200EE";
        context.fillRect(x, y, cellWidth, cellHeight) 

        // Augen
        switch(this.snakeDirection[0]) {
            case Direction.UP:
            context.beginPath();
            context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
            context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
            context.fillStyle = "white";
            context.fill();
            break;
            case Direction.DOWN:
            context.beginPath();
            context.arc(x + offset, y + 2*offset, size, 0, 2 * Math.PI, false);
            context.arc(x + 2 * offset, y + 2*offset, size, 0, 2 * Math.PI, false);
            context.fillStyle = "white";
            context.fill();
            break;
            case Direction.RIGHT:
            context.beginPath();
            context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
            context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
            context.fillStyle = "white";
            context.fill();
            break;
            case Direction.LEFT:
            context.beginPath();
            context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
            context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
            context.fillStyle = "white";
            context.fill();
            break;
        }

        // Schwanz
        context.fillStyle="#BB86FC";
        this.snakeTail.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));    
    }

    // Schlange wird beim fressen einer Kiwi um die Länge 3 verlängert
    lengthen(qty:number = 3) {
    this.size += qty;
    }
  
    // gebe x und y Wert des Kopfes zurück
    getSnakeHead() {
    return this.snakeHead;
    }

    // trifft der Kopf auf ein Stück vom Schwanz?
    isSnake(pixel: Pixel) {
    return this.snakeTail.find(el => pixel.x == el.x && pixel.y == el.y);
    }
}


