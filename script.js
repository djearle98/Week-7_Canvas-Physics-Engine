//Init the canvas
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
var nodes = []; //holds all nodes on screen
var dt = 0.1; //amount of change per frame;
var call=0; //number of iterations

class node {
  constructor(x, y, r, strength, mass, color) {
    nodes.push(this); //add this to list of nodes
		this.x = x; //x position
    this.y = y; //y position
		this.strength = strength; //strength of repelling force
		
		this.vx = 0; //velocity in X
    this.vy = 0; //velocity in Y
		
    this.r = r; //radius
		this.color = color; //aesthetic color
  }

  updateVelocity() {
    //SUM ALL OF THE FORCE VECTORS
		this.vx = 0; //new frame, calculations start from scratch
		this.vy = 0;
		
		//calculate all forces each of the other nodes have on _this_ node
    for (let i = 0; i < nodes.length; i++) {

			let nodeI = nodes[i]; //just a shorthand

			if (nodeI == this) { //skip to next node so we don't compare to ourselves
				continue; 
			} 
			
			//calculate the distance between the nodes
      let dx = this.x - nodeI.x; //difference in X
      let dy = this.y - nodeI.y; //difference in Y
      let d = hypo(dx, dy); //shortest path between nodes!
			
			//calculate the percent influence each axis has
			//over the resulting force vector's slope
			let px = dx/(Math.abs(dx)+Math.abs(dy)); 
			let py = dy/(Math.abs(dx)+Math.abs(dy));
			
			//calculate the magnitude of the force experienced by _this_ node
			//calculate how much force is exerted across each axis
			let mag = nodeI.strength/d;
      let magX = (mag)*px;
      let magY = (mag)*py;
			
			//add force vector to previous one. The end result is our velocity! 
			this.vx += (magX);
			this.vy += (magY);
    }
  }

/* 
 * updates the xy position of the object by multiplying by dt, 
 * the amount of change per frame in time  
 */
  updatePosition() {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
/*
 * draws the position, color, and radius data to the canvas
 *
 */
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

/*
 * function calls itself via requestAnimationFrame to progress 
 * the animation as the browser sees fit
 */
 
function animate() {
	call++; //record new frame
  ctx.clearRect(0, 0, width, height); //clear the canvas
  for (let i = 0; i < nodes.length; i++) { 
    nodes[i].updateVelocity(); //calculate the velocities of each node
  }
	for (let i = 0; i < nodes.length; i++) {
    nodes[i].updatePosition(); //change the node's position
		nodes[i].draw(); //draw the node
  }
	
	requestAnimationFrame(animate); //repeat animation
}

/* 
 * function returns the hypoteneuse of a right triangle of leg lengths a and b
 */
function hypo(a, b) {
  return Math.sqrt(a * a + b * b)
}

//nodes to add to the screen
new node(width/2+2, height/2+1, 10, 100, 1, "red");
new node(width/2-1, height/2-1, 10, 100, 1, "yellow");
new node(width/2+1, height/2+0, 10, 100, 1, "blue");
new node(width/2+1, height/2-1, 10, 100, 1, "green");
new node(width/2-2, height/2+1, 10, 100, 1, "purple");

//begin animating
animate();
