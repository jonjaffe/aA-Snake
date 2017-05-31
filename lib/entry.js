const SnakeView = require('./snake_view')

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = $('#canvas');
  canvasEl.width = 500;
  canvasEl.height = 500;
    // const ctx = canvasEl.getContext("2d");

  new SnakeView(canvasEl)

});
