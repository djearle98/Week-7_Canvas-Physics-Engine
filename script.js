//Init the canvas
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
var nodes = []; //holds all nodes on screen
var dt = 1; //amount of change per frame;
var call = 0; //number of iterations

class Vector {
  constructor(mag, dir) {
    this._mag = null;
    this._dir = null;
    this._componentsAsDelta = [null, null];
    this._componentsAsPercent = [null, null];

    this.mag = mag;
    this.dir = dir;
  }
  set mag(m) {
		//PRIMARY ACCESS POINT (1 of 3)//
    this._mag = m;
    this._updateVectorWithDM();
  }
  get mag() {
    return this._mag;
  }
  set dir(d) {
		//PRIMARY ACCESS POINT (2 of 3)//
    this._dir = d;
    this._updateVectorWithDM();
  }
  get dir() {
    return this._dir;
  }
  set componentsAsDelta(cad) {
    //PRIMARY ACCESS POINT (3 of 3)//
    //set mag and dir from the magnitudes of the component vectors
    this._componentsAsDelta = cad;
    this._updateVectorWithCAD();
  }
  get componentsAsDelta() {
    return this._componentsAsDelta;
  }
  set componentsAsPercent(cap) {
    console.log("Read only property. Cannot set value componentsAsPercent. Write to componentsAsDelta instead.");
    return null;
  }
  get componentsAsPercent() {
    return this._componentsAsPercent;
  }
  _convertDeltaToPercent(d) {
    let dx = d[0];
    let dy = d[1];

    let px = dx / (dx + dy);
    let py = dy / (dx + dy);

    return [px, py];
  }
  _updateVectorWithDM() {
    //recalculate all components using dir and mag as inputs...
    let dx = Math.sin(this._dir); //change in x of force vector
    let dy = Math.cos(this._dir); //change in y of force vector

    this._componentsAsDelta = [dx, dy]; //store the result
    this._componentsAsPercent = this._convertDeltaToPercent(this._componentsAsDelta);
  }
  _updateVectorWithCAD() {
		//recalculate dir and mag using componentsAsDelta as input 
    let dx = this._componentsAsDelta[0];
		let dy = this._componentsAsDelta[1];
		
    this._dir = Math.tan(dy/dx);
    this._mag = Math.sqrt(dx*dx+dy*dy);
		
		//also update componentsAsPercent...
		this._componentsAsPercent = this._convertDeltaToPercent(this._componentsAsDelta);
  }
}

class Node {
  constructor(x, y, r, strength, mass, color) {
    this.x = x; //x position
    this.y = y; //y position
    this.strength = strength; //strength of repelling force
    this.r = r; //radius
    this.color = color; //aesthetic color

    this.friction = new Vector(-0.2, 0);
    this.velocity = new Vector(0, 0); //stores this node's velocity

    nodes.push(this); //add this to list of nodes
  }

  /*
   * calculates the force vectors impacting this node.
   * sums them together to get the final force vector.
   * subtracts friction from the magnitude. 
   */
  updateVelocity() {

    let forceVectors = this.collectForceVectors(); //get all force vectors affecting this node 
    this.velocity.componentsAsDelta = this.vectorComponentSum(forceVectors); //add up all the force vectors

    this.friction.dir = this.velocity.dir; // set friction to be acting in the same directio

    if (this.velocity.mag > -this.friction.mag) { //if strong enough to overcome friction...
      this.velocity = this.vectorComponentSum([this.friction]); //add friction vector
    } else {
      this.velocity.mag = 0; //can't move
      //console.log("CAN'T MOVE");
    }

  }
	
	vectorComponentSum(vectorArray){
		let rx = 0;
		let ry = 0;
		
		for(let i = 0; i<vectorArray.length; i++) {
			let iComps = vectorArray[i].componentsAsDelta;
			rx += iComps[0];
			ry += iComps[1];
		}
		
		let result = [rx, ry];
		return result;
	}

  collectForceVectors() {
    let forceVectors = [];

    //calculate all forces each of the other nodes have on _this_ node
    for (let i = 0; i < nodes.length; i++) {

      let nodeI = nodes[i]; //just a shorthand

      if (nodeI == this) { //skip to next node so we don't compare to ourselves
        continue;
      }

      //calculate the distance between the nodes
      let dx = this.x - nodeI.x; //difference in X
      let dy = this.y - nodeI.y; //difference in Y
      let d = Math.sqrt(dx * dx + dy * dy); //shortest path between nodes!

      //calculate the magnitude of the force experienced by _this_ node
      let mag = nodeI.strength / d; //magnitude of force vector
      let dir = Math.sin(dx / d); //direction of force vector in radians

      forceVectors.push(new Vector(mag, dir));
    }

    return forceVectors;
  }


  /* 
   * derives the frame's xy coordinates from final velocity vector and dt
   */
  updatePosition() {
    let c = this.velocity.componentsAsPercent;

    this.x += c[0] * dt; //[0] is x component's magnitude
    this.y += c[1] * dt; //[1] is y component's magnitude
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

////SCRIPT////

//nodes to add to the screen
new Node(width / 2, height / 2 + 50, 10, 15, 1, "red");
new Node(width / 2, height / 2 + 00, 10, 15, 1, "yellow");
new Node(width / 2, height / 2 - 50, 10, 15, 1, "blue");
//new Node(width / 2 + 11, height / 2 - 11, 10, 5, 1, "green");
//new Node(width / 2 - 12, height / 2 + 11, 10, 5, 1, "purple");

//begin animating
animate();
