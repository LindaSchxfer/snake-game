// this is the playground

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

  //Kiwis werden verstreut
  scatter() {
     const { nbPixelX: nbCellsX , nbPixelY: nbCellsY, level} = this.game.getSettings();
     const nbKiwi = KIWI * (level + 1) ;
     for (let count = 0;  count < nbKiwi; count++) {
        let condition = true;
        while(condition === true){
            let x = Math.floor(Math.random() * nbCellsX);
            let y = Math.floor(Math.random() * nbCellsY); 

            //Prüfe falls special mode aktiv ist, wenn ja keine Kiwie innserhalb der Bricks
            if(this.specialMode === true){
                console.log("specialMode")
                //Prüfe ob die random ausgewählte Kiwi innerhalb der bricks liegt
                if(bricksSpecial.find(el => x == el.x && y == el.y) == undefined){
                    this.kiwi.push(new Pixel(x, y));
                    condition = false;
                }
            //normale mode muss dies nicht prüfen
            } else{
                this.kiwi.push(new Pixel(x, y));
                condition = false;
            }
        }      
          
      }
  }

  //das Canvas wird aufgespannt
  draw(time:number, context:CanvasRenderingContext2D) {

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

      // kiwi aussehen
      context.fillStyle = "#03DAC5";
      this.kiwi.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight)); //ändere Farbe der Celle (x und y wert) die eine Kiwi ist
  }

  //Prüfe ob die Zelle eine Kiwi ist
  isKiwi(cell: Pixel) {
      return this.kiwi.find(el => cell.x == el.x && cell.y == el.y);
  }

  // gegessene Kiwi wird aus dem Array herausgefiltert 
  eatKiwi(pixel: Pixel) {
      this.kiwi = this.kiwi.filter(el => pixel.x != el.x || pixel.y != el.y)  
  }

  //schauen ob alle Kiwis des Level gefressen sind
  isDone() {
    return this.kiwi.length == 0;
  }
}