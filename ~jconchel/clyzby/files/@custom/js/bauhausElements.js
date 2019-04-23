
/**
 *
 * @param shapeObj
 */
function drawRect(shapeObj) {
  s.push();
  s.fill(shapeObj.fill.value, shapeObj.fill.value, shapeObj.fill.value, 200);
  s.stroke(shapeObj.stroke.value, shapeObj.stroke.value, shapeObj.stroke.value, 255);

  s.translate(shapeObj.position.x, shapeObj.position.y, shapeObj.position.z );
  s.rect(0, 0, shapeObj.h.value, shapeObj.w.value * 2, 40);

  // loop through each property and animate each of
  // the animatable properties we've assigned to it
  for (let property in shapeObj) {
    property = property;
    shapeObj.animate(property);
  }

  s.noFill();
  s.noStroke();
  s.pop();
}


/**
 * Given an array of choices, pick the next one in the array,
 * if we are at the end of the array go to the first element
 * @param shapeObj
 * @returns {*|string}
 */
function getNextShapeType(shapeObj) {
  let currentShape = shapeObj.shapeType;
  let indexPos = shapeObj.shapeChoices.indexOf(currentShape);

  indexPos ++;

  if (indexPos > shapeObj.shapeType.length - 1) {
    indexPos = 0;
  }

  return shapeObj.shapeChoices[indexPos];
}

/**
 * we want the boxes to rotate in parallel
 * and distributed over the y axis of the canvas
 * @param shapeObj
 */
function drawBoxes(shapeObj) {

  s.push();
  s.fill(255, 0 , 0 , 255);

  let xPos = s.map(s.sin(s.frameCount * .01), 0, 1, -200, 900);
  if (s.frameCount % 300 === 0) {
    shapeObj.shapeType = getNextShapeType(shapeObj);
  }

  engageTheChaosDrive(shapeObj, xPos);

  s.translate(shapeObj.position.x + xPos, shapeObj.position.y, 0);
  if (!shapeObj.shapeChoices.includes(shapeObj.shapeType)) {
    shapeObj.shapeType = 'box'
  }
  // we are only using primitives that take one argument for now
  s[shapeObj.shapeType](50);

  shapeObj.animate('fill');

  s.noFill();
  s.noStroke();
  s.pop();
}

/**
 * Watch for key release to engage interactive or auto mode
 */
function keyReleased() {

  if(Number(s.keyCode) === 65) { // A key
    chaosMode = 'auto';
    console.log(chaosMode)
  }
  if (Number(s.keyCode) === 73) {
    chaosMode = 'interactive';
    console.log(chaosMode);
  }
}

/**
 * Given the chaos mode,
 * set the chaos level either by framecount or on key press
 * @param shapeObj
 */
function setChaosLevel(shapeObj) {

  if (!CHAOS_TYPES.includes(chaosMode)) { // default to auto mode
    chaosMode = 'auto'
  }

  if (chaosMode === 'auto') {
    if (s.frameCount % ( FPB * 8) === 0) {
      shapeObj.chaosLevel = 0;
    }

    if (s.frameCount % ( FPB * 32) === 0) {
      shapeObj.chaosLevel = 1;
    }

    if (s.frameCount % ( FPB * 64) === 0 || s.frameCount % (FPB * 128 ) === 0) {
      shapeObj.chaosLevel = 2;
    }
  }

  if (chaosMode === 'interactive') {
    if (s.keyIsDown(s.OPTION)) {  // spacebar
      shapeObj.chaosLevel = 2;
    } else if (s.keyIsDown(s.CONTROL)) {
      shapeObj.chaosLevel = 1;
    } else {
      shapeObj.chaosLevel = 0;
    }
  }
}

/**
 * Lets add some chaos to the screen
 * @param shapeObj
 * @param xPos
 */
function engageTheChaosDrive(shapeObj, xPos) {

  setChaosLevel(shapeObj);

  if (shapeObj.chaosLevel === 0) {
    s.rotateY(s.frameCount * .01);
  }
  if (shapeObj.chaosLevel === 1) {
    s.rotateY(xPos);
  }
  if (shapeObj.chaosLevel === 2) {
    s.rotateY(xPos);
    s.rotateZ(xPos);
    s.rotateY(xPos)
  }
}

/**
 * Given a minimum and maximum range and number of elements
 * Return the amount of space that would evenly distribute them across the range
 * @param key
 * @param divisions
 * @returns {number}
 */
function getDistribution(key, divisions) {
  if (!key.hasOwnProperty('min') || !key.hasOwnProperty('max')) return 0;
  return (Math.abs(key.min) + Math.abs(key.max)) / divisions;
}

/**
 * Construct new elements to display and for each take in
 * an offset and range config to differ them slightly
 * @param numRectangles
 * @param offsets
 * @param ranges
 * @returns {{}}
 */
function createRectangles(numRectangles, offsets, ranges){

  let shapesContainer = {}
  let colorDiff;

  for (let i = 0; i < numRectangles; i++) {

    shapesContainer[i] = new MyShape();
    shapesContainer[i].position.x = ranges.x.min + i * offsets.position.x;
    shapesContainer[i].position.y = ranges.y.min + i * offsets.position.y;
    shapesContainer[i].position.z = ranges.z.min + i * offsets.position.z;

    shapesContainer[i].w.value = (i + 1) * offsets.size;
    shapesContainer[i].h.value = (i + 1) * offsets.size;

    colorDiff = 0 + (i * offsets.shade);

    shapesContainer[i].fill.value = colorDiff;
    shapesContainer[i].stroke.value = colorDiff;
  }

  return shapesContainer;
}

/**
 * Construct p5 boxes and distribute them
 * given the offsets and ranges provided
 * @param numBoxes
 * @param offsets
 * @param ranges
 * @returns {{}}
 */
function createBoxes(numBoxes, offsets, ranges){
  let shapesContainer = {};

  for (let i = 0; i < numBoxes; i++) {
    shapesContainer[i] = new MyShape;
    shapesContainer[i].position.y = ranges.y.min + i * offsets.position.y;

    shapesContainer[i].position.x = 0;
    shapesContainer[i].w.value = 100;

    shapesContainer[i].shapeType = 'box';
    shapesContainer[i].shapeChoices = ['box', 'sphere'];
    shapesContainer[i].chaosLevel = 0;
  }

  return shapesContainer;
}

/**
 * Watch for arrows, and adjust the change rates of the parametric equation
 */
function arrowControls() {

  if (s.keyIsDown(s.UP_ARROW)) {
    parametric1.deltaTheta += .05;
  }
  if (s.keyIsDown(s.DOWN_ARROW)) {
    parametric1.deltaTheta -= .02;
  }
  if (s.keyIsDown(s.RIGHT_ARROW)) {
    parametric1.q += .1;
  }
  if (s.keyIsDown(s.LEFT_ARROW)) {
    parametric1.q -= .2;
  }
}

/**
 * Draw a 3D parametric form
 * @param shape
 */
function drawParametric(shape) {

  s.push();
  shape.theta = 0;
  shape.x = 0;
  shape.y = 0;
  shape.q += shape.velocity;

  s.stroke(102,205,170, 200);
  s.noFill();

  s.strokeWeight(1);
  s.beginShape(s.TRIANGLES);

  for (let i = 0; i < shape.iter; i++) {
    shape.k += .01;
    shape.theta += shape.deltaTheta;

    let position = shape.parametricType(shape);
    s.vertex(position.x, position.y, position.z) ;
  }

  s.endShape();
  s.pop();

  s.noStroke();
  s.noFill();
}