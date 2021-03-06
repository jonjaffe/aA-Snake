const Coord = require("./coord");

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

  isOccupying(array) {
    let result = false;
    this.board.obstacleCoords.forEach( obstacle => {
      if (obstacle.i === array[0] && obstacle.j === array[1]) {
        result = true;
        return result;
      }
    });
    return result;
  }

}

Obstacle.SYMBOL = 'O'

module.exports = Obstacle;
