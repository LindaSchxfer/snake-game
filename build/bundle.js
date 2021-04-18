(function (exports) {
  'use strict';

  //THIS IS THE ENTRY FILE - WRITE YOUR MAIN LOGIC HERE!
  const WIDTH = 80; // number of squares vertical
  const HEIGHT = 40; // number of squares horizontal
  const CELLSIZE = 20; // size of one square
  const SCALE = 2.0; // draw everything twice as big and make it smaller to get clean lines even on a retina screen
  const SPEED = 100; // initial speed
  const MAX_LEVEL = 10;
  const APPLES = 5;
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

  class Cell {
      constructor(x, y) {
          this.x = x;
          this.y = y;
      }
  }

  // this is the playing field
  class Grid {
      constructor(game) {
          this.game = game;
          this.apples = [];
          this.seed();
      }
      seed() {
          const { nbCellsX, nbCellsY, level } = this.game.getConfiguration();
          const nbApples = APPLES * (level + 1);
          for (let count = 0; count < nbApples; count++) {
              let x = Math.floor(Math.random() * nbCellsX);
              let y = Math.floor(Math.random() * nbCellsY);
              this.apples.push(new Cell(x, y));
          }
      }
      draw(time, context) {
          const { width, height, cellWidth, cellHeight } = this.game.getConfiguration();
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
          // apples
          context.fillStyle = 'red';
          this.apples.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
      }
      isApple(cell) {
          return this.apples.find(el => cell.x == el.x && cell.y == el.y);
      }
      eat(cell) {
          this.apples = this.apples.filter(el => cell.x != el.x || cell.y != el.y);
      }
      isDone() {
          return this.apples.length == 0;
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
          this.directions = [this.INITIAL_DIRECTION];
          // initial head
          this.head = new Cell(this.INITIAL_POSITION.x, this.INITIAL_POSITION.y);
          // initial tail
          this.tail = [];
      }
      setDirection(direction) {
          const lastDirection = this.directions[this.directions.length - 1];
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
          this.directions.push(direction);
      }
      move() {
          // add current head to tail
          this.tail.push(this.head);
          // get next position
          this.head = this.getNext();
          // fix the snake size
          if (this.tail.length > this.size) {
              this.tail.splice(0, 1);
          }
      }
      getNext() {
          const direction = this.directions.length > 1 ? this.directions.splice(0, 1)[0] : this.directions[0];
          switch (direction) {
              case 'Up':
                  return new Cell(this.head.x, this.head.y - 1);
              case 'Right':
                  return new Cell(this.head.x + 1, this.head.y);
              case 'Down':
                  return new Cell(this.head.x, this.head.y + 1);
              case 'Left':
                  return new Cell(this.head.x - 1, this.head.y);
          }
      }
      draw(time, context) {
          const { cellWidth, cellHeight } = this.game.getConfiguration();
          // head
          const size = CELLSIZE * SCALE / 10;
          const offset = CELLSIZE * SCALE / 3;
          const x = cellWidth * this.head.x;
          const y = cellHeight * this.head.y;
          context.fillStyle = "#111111";
          context.fillRect(x, y, cellWidth, cellHeight);
          // eyes
          switch (this.directions[0]) {
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
          this.tail.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
      }
      grow(qty = 3) {
          this.size += qty;
      }
      shrink(qty = 3) {
          this.size -= qty;
      }
      getHead() {
          return this.head;
      }
      isSnake(cell) {
          return this.tail.find(el => cell.x == el.x && cell.y == el.y);
      }
  }

  //THIS MODULE WILL BE TREESHAKED CAUSE ITS FUNCTIONS ARENT USED
  class Game {
      constructor() {
          this.score = 0;
          this.running = false;
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
          this.configuration = {
              level: 0,
              speed: SPEED,
              width: this.canvas.width,
              height: this.canvas.height,
              nbCellsX: WIDTH,
              nbCellsY: HEIGHT,
              cellWidth: this.canvas.width / WIDTH,
              cellHeight: this.canvas.height / HEIGHT,
              color: COLORS[0]
          };
          this.snake = new Snake(this);
          this.grid = new Grid(this);
          // event listeners
          window.addEventListener('keydown', this.onKeyDown.bind(this), false);
          this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
          this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
          this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
      }
      start() {
          this.nextMove = 0;
          this.running = true;
          requestAnimationFrame(this.loop.bind(this));
      }
      stop() {
          this.running = false;
      }
      getConfiguration() {
          return this.configuration;
      }
      loop(time) {
          if (this.running) {
              requestAnimationFrame(this.loop.bind(this));
              if (time >= this.nextMove) {
                  this.nextMove = time + this.configuration.speed;
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
                          this.grid.eat(this.snake.getHead());
                          if (this.grid.isDone()) {
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
          const { width, height, color, level } = this.configuration;
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
          this.grid.draw(time, context);
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
          // ate apple?
          if (this.grid.isApple(cell)) {
              return 1;
          }
          // nothing special
          return 0;
      }
      levelUp() {
          this.score += 1000;
          this.configuration.level++;
          if (this.configuration.level < MAX_LEVEL) {
              this.configuration.speed -= 7;
              this.configuration.color = COLORS[this.configuration.level];
              this.grid.seed();
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
      isOutside(cell) {
          const { nbCellsX, nbCellsY } = this.configuration;
          return cell.x < 0 || cell.x >= nbCellsX || cell.y < 0 || cell.y >= nbCellsY;
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
