const Coord = require('./coord');

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
