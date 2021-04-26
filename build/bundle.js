(function () {
  'use strict';

  // Das sind die Konstanten
  const WIDTH = 60; // Anzahl der Quadrate vertikal
  const HEIGHT = 35; // Anzahl der Quadrate horizontal
  const PIXELSIZE = 20; // Größe eines Quadrats
  const SCALE = 2.0; // alles doppelt so groß zeichnen und kleiner machen
  const SPEED = 150; // Anfangsgeschwindigkeit
  const MAX_LEVEL = 10; // Höchstlevel
  const KIWI = 1; // Anzahl der Kiwis im ersten Level
  // Level Hintergrundfarben
  const COLORS = [
      "#fafafa",
      "#ffffcc",
      "#ffe6ee",
      "#e6f2ff",
      "#e6ffe6",
      "#fff0e6",
      "#e6e6ff",
      "#f9f2ec",
      "#e6ffe6",
      "#ff4d4d",
  ];
  class Pixel {
      constructor(x, y) {
          this.x = x;
          this.y = y;
      }
  }
  // ls: Bewegungsrichtungen der Schlange (Typ auf Enum geändert)
  var Direction;
  (function (Direction) {
      Direction[Direction["Up"] = 0] = "Up";
      Direction[Direction["Right"] = 1] = "Right";
      Direction[Direction["Left"] = 2] = "Left";
      Direction[Direction["Down"] = 3] = "Down";
      Direction[Direction["null"] = 4] = "null";
  })(Direction || (Direction = {}));
  // ls: ON20 Special baut das ON20 Wände Array
  const bricksSpecial = [
      // Reihe 1
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
      // Reihe 2
      { "x": 9, "y": 14 },
      { "x": 16, "y": 14 },
      { "x": 19, "y": 14 },
      { "x": 20, "y": 14 },
      { "x": 26, "y": 14 },
      { "x": 34, "y": 14 },
      { "x": 40, "y": 14 },
      { "x": 43, "y": 14 },
      { "x": 50, "y": 14 },
      // Reihe 3
      { "x": 9, "y": 15 },
      { "x": 16, "y": 15 },
      { "x": 19, "y": 15 },
      { "x": 20, "y": 15 },
      { "x": 21, "y": 15 },
      { "x": 26, "y": 15 },
      { "x": 40, "y": 15 },
      { "x": 43, "y": 15 },
      { "x": 50, "y": 15 },
      // Reihe 4
      { "x": 9, "y": 16 },
      { "x": 16, "y": 16 },
      { "x": 19, "y": 16 },
      { "x": 22, "y": 16 },
      { "x": 26, "y": 16 },
      { "x": 39, "y": 16 },
      { "x": 43, "y": 16 },
      { "x": 50, "y": 16 },
      // Reihe 5
      { "x": 9, "y": 19 },
      { "x": 16, "y": 19 },
      { "x": 19, "y": 19 },
      { "x": 23, "y": 19 },
      { "x": 26, "y": 19 },
      { "x": 36, "y": 19 },
      { "x": 43, "y": 19 },
      { "x": 50, "y": 19 },
      // Reihe 6
      { "x": 9, "y": 20 },
      { "x": 16, "y": 20 },
      { "x": 19, "y": 20 },
      { "x": 24, "y": 20 },
      { "x": 25, "y": 20 },
      { "x": 26, "y": 20 },
      { "x": 35, "y": 20 },
      { "x": 43, "y": 20 },
      { "x": 50, "y": 20 },
      // Reihe 7
      { "x": 9, "y": 21 },
      { "x": 16, "y": 21 },
      { "x": 19, "y": 21 },
      { "x": 25, "y": 21 },
      { "x": 26, "y": 21 },
      { "x": 34, "y": 21 },
      { "x": 35, "y": 21 },
      { "x": 43, "y": 21 },
      { "x": 50, "y": 21 },
      // Reihe 8
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

  // Das ist die Spielfläche
  class Playground {
      constructor(game, specialMode) {
          this.game = game;
          this.kiwi = [];
          this.scatter();
          this.specialMode = specialMode;
      }
      // Kiwis werden zufällig verstreut
      scatter() {
          const { nbPixelX: nbCellsX, nbPixelY: nbCellsY, level } = this.game.getSettings();
          const nbKiwi = KIWI * (level + 1);
          for (let count = 0; count < nbKiwi; count++) {
              // ls: so lange condition true wird die While Schleife ausgeführt 
              let condition = true;
              // ls: While Schleife für den Fall dass Kiwis unter den ON20 Wänden ausgegeben werden sollten
              while (condition === true) {
                  let x = Math.floor(Math.random() * nbCellsX);
                  let y = Math.floor(Math.random() * nbCellsY);
                  // ls: Prüfe falls specialMode aktiv ist, wenn ja dürfen keine Kiwis unter den Wänden liegen
                  if (this.specialMode === true) {
                      //Prüfe ob die zufällig verstreuten Kiwis unter einer Wand liegen
                      if (bricksSpecial.find(el => x == el.x && y == el.y) == undefined) {
                          this.kiwi.push(new Pixel(x, y));
                          condition = false;
                      }
                      // ls: Normaler Modus kann die Kiwis überall auf dem Playground verteilen
                  }
                  else {
                      this.kiwi.push(new Pixel(x, y));
                      condition = false;
                  }
              }
          }
      }
      // das Canvas wird aufgespannt
      draw(time, context) {
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
      isKiwi(cell) {
          return this.kiwi.find(el => cell.x == el.x && cell.y == el.y);
      }
      // gegessene Kiwi wird aus dem Array herausgefiltert 
      eatKiwi(pixel) {
          this.kiwi = this.kiwi.filter(el => pixel.x != el.x || pixel.y != el.y);
      }
      // prüfen, ob alle Kiwis des Levels gefressen wurden
      isDone() {
          return this.kiwi.length == 0;
      }
  }

  // Das ist die Schlange
  class Snake {
      constructor(game) {
          this.ORIGINAL_SIZE = 3;
          this.ORIGINAL_DIRECTION = "Right";
          this.ORIGINAL_POSITION = { x: 1, y: 1 };
          this.game = game;
          this.size = this.ORIGINAL_SIZE;
          this.snakeDirection = [this.ORIGINAL_DIRECTION];
          // Ursprünglicher Kopf der Schlange
          this.snakeHead = new Pixel(this.ORIGINAL_POSITION.x, this.ORIGINAL_POSITION.y);
          // Ursprünglicher Schwanz der Schlange
          this.snakeTail = [];
      }
      // Welche Richtung?
      setDirection(direction) {
          const lastDirection = this.snakeDirection[this.snakeDirection.length - 1];
          if (lastDirection == "Up" && (direction == "Down" || direction == "Up")) {
              return;
          }
          if (lastDirection == "Down" && (direction == "Up" || direction == "Down")) {
              return;
          }
          if (lastDirection == "Left" && (direction == "Right" || direction == "Left")) {
              return;
          }
          if (lastDirection == "Right" && (direction == "Left" || direction == "Right")) {
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
      getNext() {
          const direction = this.snakeDirection.length > 1 ? this.snakeDirection.splice(0, 1)[0] : this.snakeDirection[0];
          switch (direction) {
              case "Up":
                  return new Pixel(this.snakeHead.x, this.snakeHead.y - 1);
              case "Right":
                  return new Pixel(this.snakeHead.x + 1, this.snakeHead.y);
              case "Down":
                  return new Pixel(this.snakeHead.x, this.snakeHead.y + 1);
              case "Left":
                  return new Pixel(this.snakeHead.x - 1, this.snakeHead.y);
          }
          return new Pixel(0, 0);
      }
      // Schlange wird gezeichnet
      draw(time, context) {
          const { pixelWidth: cellWidth, pixelHeight: cellHeight } = this.game.getSettings();
          // Kopf
          const size = PIXELSIZE * SCALE / 10;
          const offset = PIXELSIZE * SCALE / 3;
          const x = cellWidth * this.snakeHead.x;
          const y = cellHeight * this.snakeHead.y;
          context.fillStyle = "#6200EE";
          context.fillRect(x, y, cellWidth, cellHeight);
          // Augen
          switch (this.snakeDirection[0]) {
              case "Up":
                  context.beginPath();
                  context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
                  context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
                  context.fillStyle = "white";
                  context.fill();
                  break;
              case "Down":
                  context.beginPath();
                  context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                  context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                  context.fillStyle = "white";
                  context.fill();
                  break;
              case "Right":
                  context.beginPath();
                  context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
                  context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                  context.fillStyle = 'white';
                  context.fill();
                  break;
              case "Left":
                  context.beginPath();
                  context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
                  context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                  context.fillStyle = "white";
                  context.fill();
                  break;
          }
          // Schwanz
          context.fillStyle = "#BB86FC";
          this.snakeTail.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
      }
      // Schlange wird verlängert
      lengthen(qty = 3) {
          this.size += qty;
      }
      // gebe x und y Wert des Kopfes zurück
      getSnakeHead() {
          return this.snakeHead;
      }
      // trifft der Kopf auf ein Stück vom Schwanz?
      isSnake(pixel) {
          return this.snakeTail.find(el => pixel.x == el.x && pixel.y == el.y);
      }
  }

  // Das ist die Spiel Logik
  class Game {
      constructor() {
          this.score = 0;
          this.controlFunction = false;
          this.nextMove = 0;
          //Div angelegt
          this.div = document.createElement("div");
          this.div.setAttribute("id", "playground");
          //Canvas angelegt
          this.canvas = document.createElement('Canvas');
          this.div.appendChild(this.canvas);
          //Exit Button angelegt
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
          };
          this.snake = new Snake(this);
          this.playground = new Playground(this, false);
          // sobald eine Pfeiltaste gedrückt wird die onKeyDown Funktion aufgerufen
          window.addEventListener('keydown', this.onKeyDown.bind(this), false);
          document.body.appendChild(this.div);
      }
      //Spiel starten
      start() {
          this.nextMove = 0;
          this.controlFunction = true;
          requestAnimationFrame(this.loop.bind(this));
      }
      //Spiel stoppen
      stop() {
          this.controlFunction = false;
      }
      // ls: Stoppt das Spiel mit dem Button Exit
      exit() {
          this.stop();
          this.div.remove();
          const wrapper = document.getElementById("wrapper");
          // ls: zuvor versteckter wrapper soll wieder erscheinen um erneut eine Auswahl zu treffen
          if (wrapper != null) {
              wrapper.style.display = "block";
          }
      }
      getSettings() {
          return this.setting;
      }
      loop(time) {
          //stopp falls controlFunction gleich false
          if (this.controlFunction) {
              //rekursion (Funktion ruft sich immer wieder selbst auf)
              requestAnimationFrame(this.loop.bind(this));
              //prüfe ob es Zeit für den nächsten Schlangenschritt ist
              if (time >= this.nextMove) {
                  //Zeitpunkt für den nächsten Spielzug setzten
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
      // Aktualisiert das Canvas 
      display(time) {
          const { width, height, color, level } = this.setting;
          const context = this.canvas.getContext("2d");
          // Hintergrundfarbe
          context.fillStyle = color;
          context.fillRect(0, 0, width, height);
          // Level
          context.font = height + "px Roboto Condensed";
          context.textBaseline = "middle";
          context.textAlign = "center";
          context.fillStyle = "rgba(0,0,0,0.1)";
          context.fillText(String(level + 1), width / 2, height / 2);
          // Punkzahl
          context.font = 35 * SCALE + "px Roboto Condensed";
          context.textAlign = "left";
          context.textBaseline = "top";
          context.fillStyle = "rgba(0,0,0,0.25)";
          context.fillText(String(this.score), 10 * SCALE, 10 * SCALE);
          // Spielfeld
          this.playground.draw(time, context);
          // Schlange neu gezeichnet
          this.snake.draw(time, context);
      }
      checkCondition() {
          // Position des Kopfes der Schlange
          const cell = this.snake.getSnakeHead();
          // lden Spielbereich verlassen oder sich selbst gefressen?
          if (this.isOutside(cell) || this.snake.isSnake(cell)) {
              // Tod
              return -1;
          }
          // eine Kiwi gegessen?
          if (this.playground.isKiwi(cell)) {
              return 1;
          }
          // nichts Besonderes
          return 0;
      }
      // alle Kiwis der Runde sind gegessen
      levelUp() {
          this.score += 1000;
          this.setting.level++;
          if (this.setting.level < MAX_LEVEL) {
              this.setting.speed -= 7; //Spiel verschnellern
              this.setting.color = COLORS[this.setting.level]; //Hintergrundfarbe ändern
              this.playground.scatter(); //Kiwis verstreuen
          }
          else {
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
      // Prüfe ob Kopf der Schlange außerhalb des Canvas
      isOutside(pixel) {
          const { nbPixelX: nbCellsX, nbPixelY: nbCellsY } = this.setting;
          // links aus dem Spiel raus / rechts aus dem Spiel raus / oben aus dem Spiel Raus / unten aus dem Spiel raus
          return pixel.x < 0 || pixel.x >= nbCellsX || pixel.y < 0 || pixel.y >= nbCellsY;
      }
      // Prüfe welche Pfeiltaste gedrückt wurde
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
  }

  // Das ist der Modus Klassik
  class Classic extends Game {
      constructor() {
          super();
          // ls: liefert für den specialMode in playground.ts false
          this.playground = new Playground(this, false);
      }
      display(time) {
          const { width, height, color, level } = this.setting;
          const context = this.canvas.getContext("2d");
          // Hintergrund
          context.fillStyle = color;
          context.fillRect(0, 0, width, height);
          // Level
          context.font = height + "px Roboto Condensed";
          context.textBaseline = "middle";
          context.textAlign = "center";
          context.fillStyle = "rgba(0,0,0,0.1)";
          context.fillText(String(level + 1), width / 2, height / 2);
          // Punktzahl
          context.font = 35 * SCALE + "px Roboto Condensed";
          context.textAlign = "left";
          context.textBaseline = "top";
          context.fillStyle = "rgba(0,0,0,0.25)";
          context.fillText(String(this.score), 10 * SCALE, 10 * SCALE);
          // Spielfeld
          this.playground.draw(time, context);
          // Schlange neu gezeichnet
          this.snake.draw(time, context);
      }
      checkCondition() {
          const cell = this.snake.getSnakeHead();
          // Das Spielfeld verlassen? Sich selbst gefressen?
          if (this.isOutside(cell) || this.snake.isSnake(cell)) {
              // Tod
              return -1;
          }
          // Kiwi gefressen?
          if (this.playground.isKiwi(cell)) {
              return 1;
          }
          // nichts Besonderes
          return 0;
      }
  }

  //Das ist der Modus ON20 Special
  class OnSpecial extends Game {
      constructor() {
          super();
          // ls: liefert für den specialMode in playground.ts true
          this.playground = new Playground(this, true);
      }
      display(time) {
          const { width, height, color, level } = this.setting;
          const context = this.canvas.getContext("2d");
          // Hintergrund
          context.fillStyle = color;
          context.fillRect(0, 0, width, height);
          // Level
          context.font = height + "px Roboto Condensed";
          context.textBaseline = "middle";
          context.textAlign = "center";
          context.fillStyle = "rgba(0,0,0,0.1)";
          context.fillText(String(level + 1), width / 2, height / 2);
          // Punkzahl
          context.font = 35 * SCALE + "px Roboto Condensed";
          context.textAlign = "left";
          context.textBaseline = "top";
          context.fillStyle = "rgba(0,0,0,0.25)";
          context.fillText(String(this.score), 10 * SCALE, 10 * SCALE);
          // Spielfeld
          this.playground.draw(time, context);
          //ls: ON20 Special Wände werden im Spielfeld angezeigt
          const { pixelWidth: cellWidth, pixelHeight: cellHeight } = this.setting;
          context.fillStyle = "rgb(52,52,52)";
          bricksSpecial.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));
          // Schlange neu gezeichnet
          this.snake.draw(time, context);
      }
      checkCondition() {
          const cell = this.snake.getSnakeHead();
          // Das Spielfeld verlassen? Sich selbst gefressen? In die ON20 Wände gekracht?
          if (this.isOutside(cell) || this.snake.isSnake(cell) || this.crashedInBricks(cell)) {
              // Tod
              return -1;
          }
          // Kiwi gegessen?
          if (this.playground.isKiwi(cell)) {
              return 1;
          }
          // nichts Besonderes
          return 0;
      }
      // ls: Wenn Schlange in ON20 Wände kracht liefert diese Funktion true
      crashedInBricks(pixel) {
          return bricksSpecial.find(el => pixel.x == el.x && pixel.y == el.y);
      }
  }

  // Das ist die Haupt Logik
  // Anzeigen des Menüs zur Spielmodiauswahl
  class MainMenu {
      constructor() {
          // Div erstellen um später Menü auszublenden
          this.wrapper = document.createElement("div");
          this.wrapper.setAttribute("id", "wrapper");
          this.wrapper.setAttribute("class", "modiauswahl");
          // Button zum starten des Spielmodus Classic auf onclick event
          this.buttonClassic = document.createElement("button");
          this.buttonClassic.onclick = this.startClassic;
          this.buttonClassic.innerHTML = "Classic";
          // Button zum starten des Spielmodus OnSpecial auf onclick event
          this.buttonSpecial = document.createElement("button");
          this.buttonSpecial.onclick = this.startSpecial;
          this.buttonSpecial.innerHTML = "ON20 Special";
          // Buttons dem Div als Kindelement hinzufügen
          this.wrapper.appendChild(this.buttonClassic);
          this.wrapper.appendChild(this.buttonSpecial);
          document.body.appendChild(this.wrapper);
      }
      // ls: Modus Classic erstellt, gestartet, wrapper wird ausgeblendet
      startClassic() {
          const classic = new Classic();
          const wrapper = document.getElementById("wrapper");
          if (wrapper != null) {
              wrapper.style.display = "none";
          }
          classic.start();
      }
      // ls: Modus ON20-Special erstellt, gestartet, wrapper wird ausgeblendet
      startSpecial() {
          const onSpecial = new OnSpecial();
          const wrapper = document.getElementById("wrapper");
          if (wrapper != null) {
              wrapper.style.display = "none";
          }
          onSpecial.start();
      }
  }
  // ls: Startet das Hauptmenü des Spiels
  window.focus();
  new MainMenu();

}());
