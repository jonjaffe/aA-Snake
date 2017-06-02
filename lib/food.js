const Coord = require("./coord");

class Food {
  constructor(board) {
    this.board = board;
    this.replace();
  }

  replace() {
    let x = Math.floor(Math.random() * this.board.dim);
    let y = Math.floor(Math.random() * this.board.dim);
    while (this.board.snake.isOccupying([x, y]) || this.board.obstacle.isOccupying([x,y])) {
      x = Math.floor(Math.random() * this.board.dim);
      y = Math.floor(Math.random() * this.board.dim);
    }

    this.position = new Coord(x, y);
  }

}

Food.SYMBOL = 'F'

module.exports = Food;
