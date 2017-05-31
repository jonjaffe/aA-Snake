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
