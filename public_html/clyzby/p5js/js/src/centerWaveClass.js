/*jshint esversion: 6 */

class CenterWave {
  constructor(windowWidth, windowHeight) {

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.waveWidth = windowWidth + 200;  // have some of it go off the page
    this.origin = 0;


    // wave attributes
    this.waveType = {
      resetValue : 'sin',
      currentValue : 'sin',
      targetValue : null,
      options : ['sin', 'cos', 'tan'],
      // options : ['sin', 'cos', 'tan', 'orbit'],
      attrType : 'variable',
    };
    this.xSpacing = {
      resetValue : 40,
      currentValue : 40,
      targetValue : null,
      min : 15,
      max : 350,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };
    this.velocity = {
      resetValue : 0.025,
      currentValue : 0.025,
      targetValue : null,
      min : 0.01,
      max : 1,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };
    this.amplitude = {
      resetValue : 75,
      currentValue : 75,
      targetValue : null,
      min : -2000,
      max : 2000,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };
    this.period = {
      resetValue : 500,
      currentValue : 500,
      targetValue : null,
      min : -10250,
      max : 10250,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.07,
      noteHeldEasing: 0.07,
      easingMax : 0,
      easingMin : 0,
    };
    this.yPoints = new Array(Math.floor(this.waveWidth / this.xSpacing.currentValue));

    // this.orbitAngle = {
    //   resetValue : 20,
    //   currentValue : 20,
    //   targetValue : null,
    //   min : -100,
    //   max : 100,
    //   attrType : 'numeric',
    //   triggerSource : null,
    //   lockOn : false,
    //   easingValue : 0.07,
    //   noteHeldEasing: 0.07,
    //   easingMax : 0,
    //   easingMin : 0,
    // };

    // painting and rendering attributes
    this.radius = {
      resetValue : 20,
      currentValue : 20,
      targetValue : null,
      min : 0,
      max : 500,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.7,
      noteHeldEasing: 0.1,
      easingMax : 0,
      easingMin : 0,
    };
    this.shape = {
      resetValue : 'ellipse',
      currentValue : 'ellipse',
      targetValue : null,
      options : ['line', 'triangle', 'square', 'pentagon', 'ellipse'],
      attrType : 'variable',
    };
    this.stroke = {
      resetValue : 'stroke_no_fill',
      currentValue : 'stroke_no_fill',
      targetValue : null,
      attrType : 'variable',
      options : ['stroke_no_fill', 'stroke_w_fill', 'no_stroke_fill']
    };
    this.colorR = {
      resetValue : 100,
      currentValue : 200,
      targetValue : null,
      min : 0,
      max : 255,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };
    this.colorG = {
      resetValue : 100,
      currentValue : 200,
      targetValue : null,
      min : 0,
      max : 255,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };
    this.colorB = {
      resetValue : 100,
      currentValue : 200,
      targetValue : null,
      min : 0,
      max : 255,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };

  }
}


// METHODS



/**
 * Based on the current wave period and spacing between x points
 * get the location of the y points to be rendered in the wave
 */
CenterWave.prototype.calcWave = function (yOffset) {
  let dx = (myp5.TWO_PI / this.period.currentValue ) * this.xSpacing.currentValue;
  this.waveType.currentValue = (this.waveType.options.includes(this.waveType.currentValue)) ? this.waveType.currentValue : 'sin';
  this.origin += this.velocity.currentValue;
  let x = this.origin;
  for (let i = 0; i < this.yPoints.length; i++) {
    this.yPoints[i] = Math[this.waveType.currentValue](x) * this.amplitude.currentValue - yOffset;
    x += dx;
  }
};

/**
 * Paint the object onto the screen based on the object's attributes.
 */

let slider =
CenterWave.prototype.render = function() {

  myp5.push();
  this.setColor();
  for (let x = 0; x < this.yPoints.length; x++) {
    let xPos = x * this.xSpacing.currentValue - this.windowWidth/2;
    let yPos = myp5.height/2 + this.yPoints[x] - this.windowHeight/2;

    this.renderShape(xPos, yPos, this.radius.currentValue);
  }
  myp5.pop();
};



/**
 * Renders a given shape along the the passed x and y positions.
 * @param xPos
 * @param yPos
 * @param radius
 */
CenterWave.prototype.renderShape = function(xPos, yPos, radius) {

  let polygons = ['line', 'triangle', 'square', 'pentagon'];  // polygons we are allowing for set in the shape attribute

  if (this.shape.currentValue === 'ellipse') {
    myp5.ellipse(xPos, yPos, radius, radius);
  } else if (polygons.includes(this.shape.currentValue)) {
    let sides;

    myp5.push();
    myp5.strokeWeight(1);

    switch (this.shape.currentValue) {
      case 'line':
        sides = 2;
        myp5.strokeWeight(2);

        break;
      case 'triangle':
        sides = 3;
        break;
      case 'square':
        sides = 4;
        break;
      case 'pentagon':
        sides = 5;
        break;
    }

    myp5.translate(xPos, yPos);
    myp5.rotate(myp5.sin(myp5.frameCount / 50.0));
    myp5.polygon(0, 0, radius, sides);
    myp5.pop();
  } else {
    myp5.ellipse(xPos, yPos, radius, radius);
  }
};

/**
 * Based on user toggling, set the color profile for element to be rendered
 */
CenterWave.prototype.setColor = function() {
  switch (this.stroke.currentValue) {
    case 'stroke_no_fill':
      myp5.strokeWeight(1);
      myp5.stroke(this.colorB.currentValue, this.colorR.currentValue, this.colorG.currentValue);
      myp5.noFill();
      break;
    case 'stroke_w_fill':
      myp5.strokeWeight(1);
      myp5.stroke(this.colorB.currentValue * .2, this.colorR.currentValue * .2, this.colorG.currentValue * .2);
      myp5.fill(this.colorR.currentValue, this.colorG.currentValue, this.colorB.currentValue);
      break;
    case 'no_stroke_fill':
      myp5.noStroke();
      myp5.fill(this.colorR.currentValue, this.colorG.currentValue, this.colorB.currentValue);
      break;
  }
};

CenterWave.prototype.easeInto = easeInto;




