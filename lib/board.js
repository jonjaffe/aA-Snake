const Snake = require('./snake');
const Food = require('./food');
const Coord = require('./coord');
const Obstacle = require('./obstacle');
// const SnakeView = require('./snake_view')

class Board {
  constructor(dim) {
    this.dim = dim;

    this.snake = new Snake(this);
    this.obstacle = new Obstacle(this);
    this.score = 0;
    this.level = 1
    this.obstacleCoords = [this.obstacle.position]
    this.food = new Food(this);
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

  updateInfo() {
    let score = $('.score')
    this.score += 10
    $('.score').text(`Score: 0${this.score}`)
    if (this.score == 30) {
      this.addObstacle()
      this.level++
      $('.level').text(`Level: ${this.level}`)
    }
    if (this.score == 60) {
      this.addObstacle()
      this.level++
      $('.level').text(`Level: ${this.level}`)
    }
    if (this.score == 100) {
      this.addObstacle()
      this.level++
      $('.level').text(`Level: ${this.level}`)
    }
    if (this.score > 99) {
      $('.score').text(`Score: ${this.score}`)
    }
  }

  addObstacle() {
    let obstacle2 = new Obstacle(this)
    this.obstacleCoords.push(obstacle2.position)
  }
}

Board.BLANK_SYMBOL = '.'

module.exports = Board;
