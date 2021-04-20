// this is the playground

import { Pixel } from "./pixel";
import { KIWI, SCALE } from "./constants";
import { Game } from "./index";

export class Playground {

  private game: Game;
  private kiwi: Pixel[];

  constructor(game: Game) {
      this.game = game;
      this.kiwi = [];     
      this.scatter(); 
  }

  scatter() {
     const { nbPixelX: nbCellsX , nbPixelY: nbCellsY, level} = this.game.getSettings();
     const nbKiwi = KIWI * (level + 1) ;
     for (let count = 0;  count < nbKiwi; count++) {
          let x = Math.floor(Math.random() * nbCellsX);
          let y = Math.floor(Math.random() * nbCellsY); 
          this.kiwi.push(new Pixel(x, y));
      }
  }

  draw(time:number, context:CanvasRenderingContext2D) {

      const { width, height, pixelWidth: cellWidth, pixelHeight: cellHeight } = this.game.getSettings();

      context.fillStyle = 'black';
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

      // kiwi
      context.fillStyle = '#03DAC5';
      this.kiwi.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
  }

  isKiwi(cell: Pixel) {
      return this.kiwi.find(el => cell.x == el.x && cell.y == el.y);
  }

  eatKiwi(pixel: Pixel) {
      this.kiwi = this.kiwi.filter(el => pixel.x != el.x || pixel.y != el.y)
  }

  isDone() {
    return this.kiwi.length == 0;
  }
}