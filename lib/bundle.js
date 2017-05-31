/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Coord {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }

  plus(newCoords) {
    return new Coord(this.i + newCoords.i, this.j + newCoords.j);
  }

  equals(newCoords) {
      return (this.i == newCoords.i) && (this.j == newCoords.j);
  }

  isOpposite(newCoords) {
    return (this.i == (-1 * newCoords.i)) && (this.j == (-1 * newCoords.j));
  }
}

module.exports = Coord;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Board = __webpack_require__(2);

class View {
  constructor($el) {
    this.$el = $el;

    this.board = new Board(20);
    this.setupGrid();

    this.intervalId = window.setInterval(
      this.step.bind(this),
      View.STEP_MILLIS
    );

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  }

  handleKeyEvent(event) {
    if (View.KEYS[event.keyCode]) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    }
  }

  render() {
    // simple text based rendering
    // this.$el.html(this.board.render());

    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.food.position], "food");
    this.updateClasses(this.board.obstacleCoords, "obstacle")
  }

  updateClasses(coords, className) {
    this.$li.filter(`.${className}`).removeClass();

    coords.forEach( coord => {
      const flatCoord = (coord.i * this.board.dim) + coord.j;
      this.$li.eq(flatCoord).addClass(className);
    });
  }

  setupGrid() {
    let html = "";

    for (let i = 0; i < this.board.dim; i++) {
      html += "<ul>";
      for (let j = 0; j < this.board.dim; j++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = this.$el.find("li");
  }

  step() {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      alert(`GAME OVER ${this.board.score}`);
      window.clearInterval(this.intervalId);
    }
  }

}

View.KEYS = {
  38: "N",
  39: "E",
  40: "S",
  37: "W"
};

View.STEP_MILLIS = 100;

module.exports = View;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Snake = __webpack_require__(5);
const Food = __webpack_require__(4);
const Coord = __webpack_require__(0);
const Obstacle = __webpack_require__(6)

class Board {
  constructor(dim) {
    this.dim = dim;

    this.snake = new Snake(this);
    this.food = new Food(this);
    this.obstacle = new Obstacle(this);
    this.score = 0;
    this.obstacleCoords = [this.obstacle.position]
  }

  static blankGrid(dim) {
    const grid = [];

    for (let i = 0; i < dim; i++) {
      const row = [];
      for (let j = 0; j < dim; j++) {
        row.push(Board.BLANK_SYMBOL);
      }
      grid.push(row);
    }

    return grid;
  }
  render() {
    const grid = Board.blankGrid(this.dim);

    this.snake.segments.forEach( segment => {
      grid[segment.i][segment.j] = Snake.SYMBOL;
    });

    grid[this.food.position.i][this.food.position.j] = Food.SYMBOL;

    const rowStrs = [];
    grid.map( row => row.join("") ).join("\n");
  }

  validPosition(coord) {
    return (coord.i >= 0) && (coord.i < this.dim) &&
      (coord.j >= 0) && (coord.j < this.dim);
  }

  updateScore() {
    let score = $('.score')
    this.score += 10
    $('.score').text(`Score: ${this.score}`)
    if (this.score == 30) {
      this.addObstacle()
    }

    if (this.score == 60) {
      this.addObstacle()
    }

  }

  addObstacle() {
    let obstacle2 = new Obstacle(this)
    this.obstacleCoords.push(obstacle2.position)
  }
}

Board.BLANK_SYMBOL = '.'

module.exports = Board;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const SnakeView = __webpack_require__(1)

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = $('#canvas');
  canvasEl.width = 500;
  canvasEl.height = 500;
    // const ctx = canvasEl.getContext("2d");

  new SnakeView(canvasEl)

});


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Coord = __webpack_require__(0);

class Food {
  constructor(board) {
    this.board = board;
    this.replace();
  }

  replace() {
    let x = Math.floor(Math.random() * this.board.dim);
    let y = Math.floor(Math.random() * this.board.dim);

    while (this.board.snake.isOccupying([x, y])) {
      x = Math.floor(Math.random() * this.board.dim);
      y = Math.floor(Math.random() * this.board.dim);
    }

    this.position = new Coord(x, y);
  }

}

Food.SYMBOL = 'F'

module.exports = Food;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Coord = __webpack_require__(0);

class Snake {
  constructor(board) {
    this.board = board
    this.direction = 'S'
    this.turning = false
    const topLeft = new Coord(Math.floor(board.dim / 4), Math.floor(board.dim / 4))
    this.segments = [topLeft]
    this.growTurns = 0
  }

  head() {
    return this.segments.slice(-1)[0];
  }

  isOccupying(array) {
    let result = false;
    // for (let i = 0; i < this.segments.length; i++) {
    //   if (this.segments[i].i === array[0] && this.segments[i].j === array[1]) {
    //     result = true;
    //     return result;
    //   }
    // }
    //
    // return result;
    this.segments.forEach( segment => {
      if (segment.i === array[0] && segment.j === array[1]) {
        result = true;
        return result;
      }
    });
    return result;
  }

  isValid() {
    const head = this.head();

    if (!this.board.validPosition(this.head())) {
      return false;
    }

    // if (this.head().equals(this.board.obstacle.position)) {
    //   return false;
    // }

    for (let i = 0; i < this.board.obstacleCoords.length; i++) {
      if (this.board.obstacleCoords[i].equals(head)) {
        return false;
      }
    }

    for (let i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }

    return true;
  }

  move() {
    this.segments.push(this.head().plus(Snake.POS_CHANGE[this.direction]));

    this.turning = false;

    if (this.eatFood()) {
      this.board.food.replace();
      this.board.obstacle.replace();
      this.board.updateScore();
    }

    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
      this.segments.shift();
    }

    if (!this.isValid()) {
      this.segments = [];
    }
  }

  turn(direction) {
    if (Snake.POS_CHANGE[this.direction].isOpposite(Snake.POS_CHANGE[direction]) ||
      this.turning) {
      return
    } else {
      this.turning = true;
      this.direction = direction;
    }
  }

  eatFood() {
    if (this.head().equals(this.board.food.position)) {
      this.growTurns += 3;
      return true;
    } else {
      return false;
    }
  }

}

Snake.POS_CHANGE = {
  "N": new Coord(-1, 0),
  "E": new Coord(0, 1),
  "S": new Coord(1, 0),
  "W": new Coord(0, -1)
}

Snake.SYMBOL = "S";
Snake.GROW_TURNS = 3;

module.exports = Snake;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Coord = __webpack_require__(0);

class Obstacle {
  constructor(board) {
    this.board = board;
    this.replace();
  }

  replace() {
    let x = Math.floor(Math.random() * this.board.dim);
    let y = Math.floor(Math.random() * this.board.dim);

    while (this.board.snake.isOccupying([x, y])) {
      x = Math.floor(Math.random() * this.board.dim);
      y = Math.floor(Math.random() * this.board.dim);
    }

    this.position = new Coord(x, y);
  }

  isOccupying() {

  }

}

Obstacle.SYMBOL = 'O'

module.exports = Obstacle;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map