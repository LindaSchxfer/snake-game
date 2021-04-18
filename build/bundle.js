(function (exports) {
  'use strict';

  //THIS IS THE ENTRY FILE - WRITE YOUR MAIN LOGIC HERE!
  const WIDTH = 80; // number of squares vertical
  const HEIGHT = 40; // number of squares horizontal
  const CELLSIZE = 20; // size of one square
  const SCALE = 2.0; // draw everything twice as big and make it smaller to get clean lines even on a retina screen
  const SPEED = 100; // initial speed
  const MAX_LEVEL = 10;
  const STRAWBERRIES = 5;
  // level background colors
  const COLORS = [
      '#fafafa',
      '#ffffcc',
      '#ffe6ee',
      '#e6f2ff',
      '#e6ffe6',
      '#fff0e6',
      '#e6e6ff',
      '#f9f2ec',
      '#e6ffe6',
      '#ff4d4d',
  ];

  class Pixel {
      constructor(x, y) {
          this.x = x;
          this.y = y;
      }
  }

  // this is the playing field
  class Playground {
      constructor(game) {
          this.game = game;
          this.strawberries = [];
          this.scatter();
      }
      scatter() {
          const { nbCellsX, nbCellsY, level } = this.game.getSettings();
          const nbApples = STRAWBERRIES * (level + 1);
          for (let count = 0; count < nbApples; count++) {
              let x = Math.floor(Math.random() * nbCellsX);
              let y = Math.floor(Math.random() * nbCellsY);
              this.strawberries.push(new Pixel(x, y));
          }
      }
      draw(time, context) {
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
      isStrawberry(cell) {
          return this.strawberries.find(el => cell.x == el.x && cell.y == el.y);
      }
      eat(cell) {
          this.strawberries = this.strawberries.filter(el => cell.x != el.x || cell.y != el.y);
      }
      isDone() {
          return this.strawberries.length == 0;
      }
  }

  // this is the snake
  class Snake {
      constructor(game) {
          this.INITIAL_SIZE = 3;
          this.INITIAL_DIRECTION = 'Right';
          this.INITIAL_POSITION = { x: 1, y: 1 };
          this.game = game;
          this.size = this.INITIAL_SIZE;
          this.snakeDirection = [this.INITIAL_DIRECTION];
          // initial head
          this.snakeHead = new Pixel(this.INITIAL_POSITION.x, this.INITIAL_POSITION.y);
          // initial tail
          this.snakeTail = [];
      }
      setDirection(direction) {
          const lastDirection = this.snakeDirection[this.snakeDirection.length - 1];
          if (lastDirection == 'Up' && (direction == 'Down' || direction == 'Up')) {
              return;
          }
          if (lastDirection == 'Down' && (direction == 'Up' || direction == 'Down')) {
              return;
          }
          if (lastDirection == 'Left' && (direction == 'Right' || direction == 'Left')) {
              return;
          }
          if (lastDirection == 'Right' && (direction == 'Left' || direction == 'Right')) {
              return;
          }
          this.snakeDirection.push(direction);
      }
      move() {
          // add current head to tail
          this.snakeTail.push(this.snakeHead);
          // get next position
          this.snakeHead = this.getNext();
          // fix the snake size
          if (this.snakeTail.length > this.size) {
              this.snakeTail.splice(0, 1);
          }
      }
      getNext() {
          const direction = this.snakeDirection.length > 1 ? this.snakeDirection.splice(0, 1)[0] : this.snakeDirection[0];
          switch (direction) {
              case 'Up':
                  return new Pixel(this.snakeHead.x, this.snakeHead.y - 1);
              case 'Right':
                  return new Pixel(this.snakeHead.x + 1, this.snakeHead.y);
              case 'Down':
                  return new Pixel(this.snakeHead.x, this.snakeHead.y + 1);
              case 'Left':
                  return new Pixel(this.snakeHead.x - 1, this.snakeHead.y);
          }
      }
      draw(time, context) {
          const { pixelWidth: cellWidth, pixelHeight: cellHeight } = this.game.getSettings();
          // head
          const size = CELLSIZE * SCALE / 10;
          const offset = CELLSIZE * SCALE / 3;
          const x = cellWidth * this.snakeHead.x;
          const y = cellHeight * this.snakeHead.y;
          context.fillStyle = "#111111";
          context.fillRect(x, y, cellWidth, cellHeight);
          // eyes
          switch (this.snakeDirection[0]) {
              case 'Up':
                  context.beginPath();
                  context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
                  context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
                  context.fillStyle = 'white';
                  context.fill();
                  break;
              case 'Down':
                  context.beginPath();
                  context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                  context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                  context.fillStyle = 'white';
                  context.fill();
                  break;
              case 'Right':
                  context.beginPath();
                  context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
                  context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                  context.fillStyle = 'white';
                  context.fill();
                  break;
              case 'Left':
                  context.beginPath();
                  context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
                  context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                  context.fillStyle = 'white';
                  context.fill();
                  break;
          }
          // tail
          context.fillStyle = "#333333";
          this.snakeTail.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
      }
      grow(qty = 3) {
          this.size += qty;
      }
      shrink(qty = 3) {
          this.size -= qty;
      }
      getHead() {
          return this.snakeHead;
      }
      isSnake(pixel) {
          return this.snakeTail.find(el => pixel.x == el.x && pixel.y == el.y);
      }
  }

  //THIS MODULE WILL BE TREESHAKED CAUSE ITS FUNCTIONS ARENT USED
  class Game {
      constructor() {
          this.score = 0;
          this.controlFunction = false;
          this.nextMove = 0;
          this.canvas = document.createElement('Canvas');
          document.body.appendChild(this.canvas);
          // canvas element size in the page
          this.canvas.style.width = WIDTH * CELLSIZE + 'px';
          this.canvas.style.height = HEIGHT * CELLSIZE + 'px';
          // image buffer size 
          this.canvas.width = WIDTH * CELLSIZE * SCALE;
          this.canvas.height = HEIGHT * CELLSIZE * SCALE;
          // configuration
          this.setting = {
              level: 0,
              speed: SPEED,
              width: this.canvas.width,
              height: this.canvas.height,
              nbCellsX: WIDTH,
              nbCellsY: HEIGHT,
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
      }
      start() {
          this.nextMove = 0;
          this.controlFunction = true;
          requestAnimationFrame(this.loop.bind(this));
      }
      stop() {
          this.controlFunction = false;
      }
      getSettings() {
          return this.setting;
      }
      loop(time) {
          if (this.controlFunction) {
              requestAnimationFrame(this.loop.bind(this));
              if (time >= this.nextMove) {
                  this.nextMove = time + this.setting.speed;
                  // move once
                  this.snake.move();
                  // check what happened  
                  switch (this.checkState()) {
                      case -1:
                          this.die();
                          break;
                      case 1:
                          this.snake.grow();
                          this.score += 100;
                          this.playground.eat(this.snake.getHead());
                          if (this.playground.isDone()) {
                              this.levelUp();
                          }
                      default:
                          // update display
                          this.paint(time);
                  }
              }
          }
      }
      paint(time) {
          const { width, height, color, level } = this.setting;
          const context = this.canvas.getContext("2d");
          // background
          context.fillStyle = color;
          context.fillRect(0, 0, width, height);
          // level
          context.font = height + 'px Arial';
          context.textBaseline = 'middle';
          context.textAlign = 'center';
          context.fillStyle = 'rgba(0,0,0,0.1)';
          context.fillText(level + 1, width / 2, height / 2);
          // score
          context.font = 35 * SCALE + 'px Arial';
          context.textAlign = 'left';
          context.textBaseline = 'top';
          context.fillStyle = 'rgba(0,0,0,0.25)';
          context.fillText(this.score, 10 * SCALE, 10 * SCALE);
          // grid
          this.playground.draw(time, context);
          // snake
          this.snake.draw(time, context);
      }
      checkState() {
          const cell = this.snake.getHead();
          // left the play area or ate itself?? 
          if (this.isOutside(cell) || this.snake.isSnake(cell)) {
              // dead
              return -1;
          }
          // ate strawberry?
          if (this.playground.isStrawberry(cell)) {
              return 1;
          }
          // nothing special
          return 0;
      }
      levelUp() {
          this.score += 1000;
          this.setting.level++;
          if (this.setting.level < MAX_LEVEL) {
              this.setting.speed -= 7;
              this.setting.color = COLORS[this.setting.level];
              this.playground.scatter();
          }
          else {
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
      isOutside(pixel) {
          const { nbCellsX, nbCellsY } = this.setting;
          return pixel.x < 0 || pixel.x >= nbCellsX || pixel.y < 0 || pixel.y >= nbCellsY;
      }
      onKeyDown(event) {
          switch (event.key) {
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
      onTouchStart(e) {
          this.touch = e.changedTouches[0];
          e.preventDefault();
      }
      onTouchMove(e) {
          e.preventDefault();
      }
      onTouchEnd(e) {
          const touch = e.changedTouches[0];
          const distX = touch.pageX - this.touch.pageX;
          const distY = touch.pageY - this.touch.pageY;
          let direction = null;
          if (Math.abs(distX) >= 100) {
              direction = (distX < 0) ? 'Left' : 'Right';
          }
          else if (Math.abs(distY) >= 100) {
              direction = (distY < 0) ? 'Up' : 'Down';
          }
          if (direction) {
              this.snake.setDirection(direction);
          }
          e.preventDefault();
      }
  }
  window.focus();
  new Game().start();

  exports.Game = Game;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
