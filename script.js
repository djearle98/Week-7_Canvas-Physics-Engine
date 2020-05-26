var canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var c = canvas.getContext("2d");
var r = 20,
  x = r + 1,
  y = r + 1,
  dx = 10,
  dy = 10,
  then = new Date();
draw();

function draw() {
  //erase old position
  c.fillStyle = "rgba(0,0,0,0.01)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //calculate new position
  if (y + r >= canvas.height) {
    y = canvas.height - r;
    dy = -(dy) + 1;
    console.log(dy);
  } else if (y - r <= 0) {
    y = r;
    dy = -(dy) - 1;
  } else {
    dy += 1;
  }
  y += dy;

  if (x + r >= canvas.width) {
    x = canvas.width - r;
    dx = -dx + 1;
  } else if (x - r <= 0) {
    x = r;
    dx = -dx - 1;
  } else {
    //dx+=1;
  }
  x += dx;
  /*let now = new Date();
  let delta = now-then;
  y+=delta*delta*0.001;
  then = now;
 */
  //redraw
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2, true);
  c.closePath();
  c.fillStyle = "blue";
  c.fill();

  //repaint
  window.requestAnimationFrame(draw);
}
