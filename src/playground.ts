// this is the playing field

import { Pixel } from "./pixel";
import { STRAWBERRIES, SCALE } from "./constants";
import { Game } from "./index";

export class Playground {

  private game: Game;
  private strawberries: Pixel[];

  constructor(game: Game) {
      this.game = game;
      this.strawberries = [];     
      this.scatter(); 
  }

  scatter() {
     const { nbCellsX , nbCellsY, level} = this.game.getSettings();
     const nbApples = STRAWBERRIES * (level + 1) ;
     for (let count = 0;  count < nbApples; count++) {
          let x = Math.floor(Math.random() * nbCellsX);
          let y = Math.floor(Math.random() * nbCellsY); 
          this.strawberries.push(new Pixel(x, y));
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

      // strawberries
      context.fillStyle = 'red';
      this.strawberries.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
  }

  isStrawberry(cell: Pixel) {
      return this.strawberries.find(el => cell.x == el.x && cell.y == el.y);
  }

  eat(cell: Pixel) {
      this.strawberries = this.strawberries.filter(el => cell.x != el.x || cell.y != el.y)
  }

  isDone() {
    return this.strawberries.length == 0;
  }
}