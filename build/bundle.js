(function () {
  'use strict';

  //this are the constants
  const WIDTH = 60; // number of squares vertical
  const HEIGHT = 35; // number of squares horizontal
  const PIXELSIZE = 20; // size of one square
  const SCALE = 2.0; // draw everything twice as big and make it smaller to get clean lines even on a retina screen
  const SPEED = 150; // initial speed
  const MAX_LEVEL = 10;
  const KIWI = 1;
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
  //ls: changed type to enum
  var Direction;
  (function (Direction) {
      Direction[Direction["Up"] = 0] = "Up";
      Direction[Direction["Right"] = 1] = "Right";
      Direction[Direction["Left"] = 2] = "Left";
      Direction[Direction["Down"] = 3] = "Down";
      Direction[Direction["null"] = 4] = "null";
  })(Direction || (Direction = {}));
  //ls: ON20 Special build the ON20 Bricks Array
  const bricksSpecial = [
      //row 1
      { "x": 10, "y": 13 },
      { "x": 11, "y": 13 },
      { "x": 14, "y": 13 },
      { "x": 15, "y": 13 },
      { "x": 19, "y": 13 },
      { "x": 26, "y": 13 },
      { "x": 35, "y": 13 },
      { "x": 36, "y": 13 },
      { "x": 37, "y": 13 },
      { "x": 38, "y": 13 },
      { "x": 39, "y": 13 },
      { "x": 44, "y": 13 },
      { "x": 45, "y": 13 },
      { "x": 48, "y": 13 },
      { "x": 49, "y": 13 },
      //row 2
      { "x": 9, "y": 14 },
      { "x": 16, "y": 14 },
      { "x": 19, "y": 14 },
      { "x": 20, "y": 14 },
      { "x": 26, "y": 14 },
      { "x": 34, "y": 14 },
      { "x": 40, "y": 14 },
      { "x": 43, "y": 14 },
      { "x": 50, "y": 14 },
      //row 3
      { "x": 9, "y": 15 },
      { "x": 16, "y": 15 },
      { "x": 19, "y": 15 },
      { "x": 20, "y": 15 },
      { "x": 21, "y": 15 },
      { "x": 26, "y": 15 },
      { "x": 40, "y": 15 },
      { "x": 43, "y": 15 },
      { "x": 50, "y": 15 },
      //row 4
      { "x": 9, "y": 16 },
      { "x": 16, "y": 16 },
      { "x": 19, "y": 16 },
      { "x": 22, "y": 16 },
      { "x": 26, "y": 16 },
      { "x": 39, "y": 16 },
      { "x": 43, "y": 16 },
      { "x": 50, "y": 16 },
      //row 5
      { "x": 9, "y": 19 },
      { "x": 16, "y": 19 },
      { "x": 19, "y": 19 },
      { "x": 23, "y": 19 },
      { "x": 26, "y": 19 },
      { "x": 36, "y": 19 },
      { "x": 43, "y": 19 },
      { "x": 50, "y": 19 },
      //row 6
      { "x": 9, "y": 20 },
      { "x": 16, "y": 20 },
      { "x": 19, "y": 20 },
      { "x": 24, "y": 20 },
      { "x": 25, "y": 20 },
      { "x": 26, "y": 20 },
      { "x": 35, "y": 20 },
      { "x": 43, "y": 20 },
      { "x": 50, "y": 20 },
      //row 7
      { "x": 9, "y": 21 },
      { "x": 16, "y": 21 },
      { "x": 19, "y": 21 },
      { "x": 25, "y": 21 },
      { "x": 26, "y": 21 },
      { "x": 34, "y": 21 },
      { "x": 35, "y": 21 },
      { "x": 43, "y": 21 },
      { "x": 50, "y": 21 },
      //row 8
      { "x": 10, "y": 22 },
      { "x": 11, "y": 22 },
      { "x": 14, "y": 22 },
      { "x": 15, "y": 22 },
      { "x": 19, "y": 22 },
      { "x": 26, "y": 22 },
      { "x": 34, "y": 22 },
      { "x": 35, "y": 22 },
      { "x": 36, "y": 22 },
      { "x": 37, "y": 22 },
      { "x": 38, "y": 22 },
      { "x": 39, "y": 22 },
      { "x": 40, "y": 22 },
      { "x": 44, "y": 22 },
      { "x": 45, "y": 22 },
      { "x": 48, "y": 22 },
      { "x": 49, "y": 22 }
  ];

  //this is the grid
  class Pixel {
      constructor(x, y) {
          this.x = x;
          this.y = y;
      }
  }

  // this is the playground
  class Playground {
      constructor(game) {
          this.game = game;
          this.kiwi = [];
          this.scatter();
      }
      scatter() {
          const { nbPixelX: nbCellsX, nbPixelY: nbCellsY, level } = this.game.getSettings();
          const nbKiwi = KIWI * (level + 1);
          for (let count = 0; count < nbKiwi; count++) {
              let x = Math.floor(Math.random() * nbCellsX);
              let y = Math.floor(Math.random() * nbCellsY);
              this.kiwi.push(new Pixel(x, y));
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
          // kiwi
          context.fillStyle = '#03DAC5';
          this.kiwi.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
      }
      isKiwi(cell) {
          return this.kiwi.find(el => cell.x == el.x && cell.y == el.y);
      }
      eatKiwi(pixel) {
          this.kiwi = this.kiwi.filter(el => pixel.x != el.x || pixel.y != el.y);
      }
      isDone() {
          return this.kiwi.length == 0;
      }
  }

  // this is the snake
  class Snake {
      constructor(game) {
          this.ORIGINAL_SIZE = 3;
          this.ORININAL_DIRECTION = 'Right';
          this.ORIGINAL_POSITION = { x: 1, y: 1 };
          this.game = game;
          this.size = this.ORIGINAL_SIZE;
          this.snakeDirection = [this.ORININAL_DIRECTION];
          // original head
          this.snakeHead = new Pixel(this.ORIGINAL_POSITION.x, this.ORIGINAL_POSITION.y);
          // original tail
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
          return new Pixel(0, 0);
      }
      draw(time, context) {
          const { pixelWidth: cellWidth, pixelHeight: cellHeight } = this.game.getSettings();
          // head
          const size = PIXELSIZE * SCALE / 10;
          const offset = PIXELSIZE * SCALE / 3;
          const x = cellWidth * this.snakeHead.x;
          const y = cellHeight * this.snakeHead.y;
          context.fillStyle = "#6200EE";
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
          context.fillStyle = "#BB86FC";
          this.snakeTail.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
      }
      lengthen(qty = 3) {
          this.size += qty;
      }
      shorten(qty = 3) {
          this.size -= qty;
      }
      getSnakeHead() {
          return this.snakeHead;
      }
      isSnake(pixel) {
          return this.snakeTail.find(el => pixel.x == el.x && pixel.y == el.y);
      }
  }

  //this is the main game logic
  class Game {
      constructor() {
          this.score = 0;
          this.controlFunction = false;
          this.nextMove = 0;
          this.touch = { pageX: 0, pageY: 0 };
          this.div = document.createElement("div");
          this.canvas = document.createElement('Canvas');
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
      stopOnButton() {
          console.log("stop");
          this.stop();
          this.div.remove();
          const wrapper = document.getElementById("wrapper");
          if (wrapper != null) {
              wrapper.style.display = "block";
          }
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
                  switch (this.checkCondition()) {
                      case -1:
                          this.die();
                          break;
                      case 1:
                          this.snake.lengthen();
                          this.score += 100;
                          this.playground.eatKiwi(this.snake.getSnakeHead());
                          if (this.playground.isDone()) {
                              this.levelUp();
                          }
                      default:
                          // update display
                          this.display(time);
                  }
              }
          }
      }
      display(time) {
          const { width, height, color, level } = this.setting;
          const context = this.canvas.getContext("2d");
          // background
          context.fillStyle = color;
          context.fillRect(0, 0, width, height);
          // level
          context.font = height + 'px Roboto Condensed';
          context.textBaseline = 'middle';
          context.textAlign = 'center';
          context.fillStyle = 'rgba(0,0,0,0.1)';
          context.fillText(String(level + 1), width / 2, height / 2);
          // score
          context.font = 35 * SCALE + 'px Roboto Condensed';
          context.textAlign = 'left';
          context.textBaseline = 'top';
          context.fillStyle = 'rgba(0,0,0,0.25)';
          context.fillText(String(this.score), 10 * SCALE, 10 * SCALE);
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
          const { nbPixelX: nbCellsX, nbPixelY: nbCellsY } = this.setting;
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
          let direction = "";
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

  //this is the mode classic
  class Classic extends Game {
      constructor() {
          super();
      }
      display(time) {
          const { width, height, color, level } = this.setting;
          const context = this.canvas.getContext("2d");
          // background
          context.fillStyle = color;
          context.fillRect(0, 0, width, height);
          // level
          context.font = height + 'px Roboto Condensed';
          context.textBaseline = 'middle';
          context.textAlign = 'center';
          context.fillStyle = 'rgba(0,0,0,0.1)';
          context.fillText(String(level + 1), width / 2, height / 2);
          // score
          context.font = 35 * SCALE + 'px Roboto Condensed';
          context.textAlign = 'left';
          context.textBaseline = 'top';
          context.fillStyle = 'rgba(0,0,0,0.25)';
          context.fillText(String(this.score), 10 * SCALE, 10 * SCALE);
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
  }

  //this is the mode ON20-Special
  class OnSpecial extends Game {
      constructor() {
          super();
      }
      display(time) {
          const { width, height, color, level } = this.setting;
          const context = this.canvas.getContext("2d");
          // background
          context.fillStyle = color;
          context.fillRect(0, 0, width, height);
          // level
          context.font = height + 'px Roboto Condensed';
          context.textBaseline = 'middle';
          context.textAlign = 'center';
          context.fillStyle = 'rgba(0,0,0,0.1)';
          context.fillText(String(level + 1), width / 2, height / 2);
          // score
          context.font = 35 * SCALE + 'px Roboto Condensed';
          context.textAlign = 'left';
          context.textBaseline = 'top';
          context.fillStyle = 'rgba(0,0,0,0.25)';
          context.fillText(String(this.score), 10 * SCALE, 10 * SCALE);
          // playground
          this.playground.draw(time, context);
          //ls: ON20 Special 
          const { pixelWidth: cellWidth, pixelHeight: cellHeight } = this.setting;
          context.fillStyle = 'rgb(52,52,52)';
          bricksSpecial.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
          // snake
          this.snake.draw(time, context);
      }
      checkCondition() {
          const cell = this.snake.getSnakeHead();
          // left the play area or ate itself?? 
          //ls: OO20 Special check condition added
          if (this.isOutside(cell) || this.snake.isSnake(cell) || this.crashedInBricks(cell)) {
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
      //ls: On20 Special function: if Snake crashed in Bricks? --> true
      crashedInBricks(pixel) {
          return bricksSpecial.find(el => pixel.x == el.x && pixel.y == el.y);
      }
  }

  //this is the main locic
  class Test {
      constructor() {
          this.wrapper = document.createElement("div");
          this.wrapper.setAttribute("id", "wrapper");
          this.wrapper.setAttribute("class", "modiauswahl");
          let button1 = document.createElement("button");
          button1.onclick = this.startClassic;
          button1.innerText = "Classic";
          let button2 = document.createElement("button");
          button2.onclick = this.startSpecial;
          button2.innerText = "ON20-Special";
          this.wrapper.appendChild(button1);
          this.wrapper.appendChild(button2);
          document.body.appendChild(this.wrapper);
      }
      //ls: Modus Classic
      startClassic() {
          const classic = new Classic();
          const wrapper = document.getElementById("wrapper");
          if (wrapper != null) {
              wrapper.style.display = "none";
          }
          classic.start();
      }
      //ls: Modus ON20-Special
      startSpecial() {
          const onSpecial = new OnSpecial();
          const wrapper = document.getElementById("wrapper");
          if (wrapper != null) {
              wrapper.style.display = "none";
          }
          onSpecial.start(); //ls: Modus Classic
      }
  }
  window.focus();
  new Test();
  //window.focus();
  //new Classic().start();      //ls: Modus Classic
  //new OnSpecial().start();    //ls: Modus ON20-Special
  /*window.focus = () => {
      let div = document.createElement("div");
      div.innerText = "hallo";
  }*/
  /* Elemente einblenden
  // Mit show_elements() können einzelne oder mehrere Elemente
  // via show_elements('ElementIDone','ElementIDtwo','ElementIDthree')
  // eingeblendet werden.
  function show_elements()
   {
    var elementNames = show_elements.arguments;
    for (var i=0; i<elementNames.length; i++)
     {
       var elementName = elementNames[i];
       document.getElementById(wrapper).style.display='block';
     }
   }
  // Elemente ausblenden
  // Mit show_elements() können einzelne oder mehrere Elemente
  // via hide_elements('ElementIDone','ElementIDtwo','ElementIDthree')
  // ausgeblendet werden.
  function hide_elements()
   {
    var elementNames = hide_elements.arguments;
    for (var i=0; i<elementNames.length; i++)
     {
       var elementName = elementNames[i];
       document.getElementById(wrapper).style.display='none';
     }
   }*/

}());
