// Das ist die Spielfläche

import { bricksSpecial, KIWI, SCALE, Pixel } from "./constants";
import { Game } from "./game";

export class Playground {

    private game: Game;
    private kiwi: Pixel[];
    private specialMode: boolean;

    constructor(game: Game, specialMode:boolean) {
      this.game = game;
      this.kiwi = [];     
      this.scatter(); 
      this.specialMode = specialMode;
    }

    // Kiwis werden zufällig verstreut
    scatter() {
        const { nbPixelX: nbCellsX , nbPixelY: nbCellsY, level} = this.game.getSettings();
        const nbKiwi = KIWI * (level + 1) ;
        for (let count = 0;  count < nbKiwi; count++) {
            // ls: so lange condition true wird die While Schleife ausgeführt 
            let condition = true;

            // ls: While Schleife für den Fall dass Kiwis unter den ON20 Wänden ausgegeben werden sollten
            while(condition){
                let x = Math.floor(Math.random() * nbCellsX);
                let y = Math.floor(Math.random() * nbCellsY); 

                // ls: Prüfe falls specialMode aktiv ist, wenn ja dürfen keine Kiwis unter den Wänden liegen
                if(this.specialMode){

                    //Prüfe ob die zufällig verstreuten Kiwis unter einer Wand liegen
                    if(bricksSpecial.find(el => x == el.x && y == el.y) == undefined) {
                        this.kiwi.push(new Pixel(x, y));
                        condition = false;
                    }
                    // ls: Normaler Modus kann die Kiwis überall auf dem Playground verteilen
                } else{
                    this.kiwi.push(new Pixel(x, y));
                    condition = false;
                }
            }      
        }
    }

    // das Canvas wird aufgespannt
    draw(context:CanvasRenderingContext2D) {

        const { width, height, pixelWidth: cellWidth, pixelHeight: cellHeight } = this.game.getSettings();

        context.fillStyle = "black";
        context.lineWidth = 1 * SCALE;

        for (let x = 0; x <= width; x += cellWidth) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, height);
          context.stroke();
        }

        for (let y = 0; y <= height; y += cellHeight) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(width, y);
          context.stroke();
        }

        // Kiwi aussehen
        context.fillStyle = "#03DAC5";
        this.kiwi.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight)); //ändere Farbe der Zelle (x und y Wert) welche eine Kiwi ist
    }

    // Prüfe ob die Zelle eine Kiwi ist
    isKiwi(cell: Pixel) {
        return this.kiwi.find(el => cell.x == el.x && cell.y == el.y);
    }

    // gegessene Kiwi wird aus dem Array herausgefiltert 
    eatKiwi(pixel: Pixel) {
        this.kiwi = this.kiwi.filter(el => pixel.x != el.x || pixel.y != el.y)  
    }

    // prüfen, ob alle Kiwis des Levels gefressen wurden
    isDone() {
        return this.kiwi.length == 0;
    }
}