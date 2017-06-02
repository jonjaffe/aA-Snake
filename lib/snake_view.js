const Board = require('./board.js');

class View {
  constructor($el) {
    this.$el = $el;

    this.board = new Board(20);
    this.setupGrid();
    this.intervalId = null;
    this.paused = true;
    this.intervalManager();
    // this.intervalId = window.setInterval(
    //   this.step.bind(this),
    //   View.STEP_MILLIS
    // );

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  }

  intervalManager() {
    if (this.paused) {
      this.paused = false;
      this.intervalId = window.setInterval(
        this.step.bind(this),
        View.STEP_MILLIS
      )
    } else {
      this.paused = true;
      window.clearInterval(this.intervalId)
    }
  }

  handleKeyEvent(event) {
    if (View.KEYS[event.keyCode]) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    }
    if (event.keyCode === 82) {
      location.reload()
    }
    if (event.keyCode === 32) {
      this.intervalManager();
    }
    // if (event.keyCode === 80) {
    //   window.clearInterval(this.intervalId)
    // }
    //
    // if (event.keyCode === 82) {
    //   this.intervalId = window.setInterval(
    //     this.step.bind(this),
    //     View.STEP_MILLIS
    //   )
    // }
  }

  render() {
    // simple text based rendering
    // this.$el.html(this.board.render());

    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.food.position], "food");
    this.updateClasses(this.board.obstacleCoords, "obstacle")
  }

  updateClasses(coords, className) {
    this.$li.filter(`.${className}`).removeClass().html('');

    coords.forEach( coord => {
      const flatCoord = (coord.i * this.board.dim) + coord.j;
      this.$li.eq(flatCoord).addClass(className);
      if (className === 'food') {
        this.$li.eq(flatCoord).html('<i class="fa fa-apple" aria-hidden="true"></i>')
      }
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

  findTopScores(storage) {
    let scores = [];
    for (let key in storage) {
      // if ('J'.indexOf(storage[key]) !== -1) {
      //   delete storage.key
      // }
      scores.push(storage[key]);
    }
    scores = scores.sort(function(a, b) {
        if (parseInt(a) < parseInt(b)) { return 1; }
        else { return -1; }
    });
    return scores.slice(0,5);
  }

  populateRankings() {
    let $ranking = $('ul.ranking');
    let topScores = this.findTopScores(localStorage)
    // $ranking.empty();
    for (let i = 0; i < 5; i++) {
      let $li = $(`<li>${i + 1}. ${topScores[i] ? topScores[i] : ''}</li>`);
      $ranking.append($li);
    }
  }

  step() {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      window.clearInterval(this.intervalId);
      $('#canvas').html(`<p class='game-over animated wobble'>GAME OVER</p></br><p class='game-over-score'>Final Score: ${this.board.score}</p></br><h2 class='high-score-head'>HIGH SCORES</h2></br><ul class='ranking'></ul>`)
      localStorage.setItem(`${Math.random()}`, this.board.score);
      this.board.score = 0
      this.populateRankings();
      // alert(`GAME OVER ${this.board.score}`);
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
