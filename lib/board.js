const Snake = require('./snake');
const Food = require('./food');
const Coord = require('./coord');
const Obstacle = require('./obstacle')

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
