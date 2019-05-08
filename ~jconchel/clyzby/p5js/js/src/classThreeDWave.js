
class ThreeDWave {
  constructor(windowWidth, windowHeight) {

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.waveWidth = windowWidth + 200;  // have some of it go off the page
    this.origin = 0;


    this.radius = {
      displayLabel : 'Size',
      resetValue : 20,
      defaultValue : 20,
      currentValue : 20,
      targetValue : null,
      min : 20,
      max : 150,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.071,
      noteHeldEasing : 0.05,
      easingMax : 0,
      easingMin : 0,
    };

    this.velocity = {
      displayLabel : 'Velocity',
      resetValue : 0.01,
      defaultValue : 0.01,
      currentValue : 0.01,
      targetValue : null,
      min : 0.001,
      max : 0.2,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };

    this.amplitude = {
      displayLabel : 'Amplitude',
      resetValue : 75,
      defaultValue : 75,
      currentValue : 75,
      targetValue : null,
      min : 0,
      max : 500,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };

    this.period = {
      displayLabel : 'Period',
      resetValue : 500,
      defaultValue : 500,
      currentValue : 500,
      targetValue : null,
      min : 50,
      max : 750,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.05,
      easingMax : 0,
      easingMin : 0,
    };

    this.xSpacing = {
      displayLabel : 'X Spacing',
      resetValue : 100,
      defaultValue : 100,
      currentValue : 100,
      targetValue : null,
      min : 90,
      max : 450,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.1,
      noteHeldEasing : 0.1,
      easingMax : 0,
      easingMin : 0,
    };

    this.colorR = {
      displayLabel : 'Color Red',
      resetValue : 100,
      defaultValue : 100,
      currentValue : 100,
      targetValue : null,
      min : -10,
      max : 275,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.7,
      noteHeldEasing : 0.01,
      easingMax : 0,
      easingMin : 0,
    };
    this.colorG = {
      displayLabel : 'Color Green',
      resetValue : 100,
      defaultValue : 100,
      currentValue : 100,
      targetValue : null,
      min : -10,
      max : 275,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.7,
      noteHeldEasing : 0.01,
      easingMax : 0,
      easingMin : 0,
    };
    this.colorB = {
      displayLabel : 'Color Blue',
      resetValue : 100,
      defaultValue : 100,
      currentValue : 100,
      targetValue : null,
      min : -10,
      max : 275,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.7,
      noteHeldEasing : 0.01,
      easingMax : 0,
      easingMin : 0,
    };


    // wave movement
    this.rotateX = {
      displayLabel : 'Rotate Shape X',
      resetValue : 0,
      defaultValue : 0,
      currentValue : 0,
      targetValue : null,
      min : -0.5,
      max : 0.5,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.05,
      noteHeldEasing : 0.01,
      easingMax : 0,
      easingMin : 0,
    };
    this.rotateY = {
      displayLabel : 'Rotate Shape Y',
      resetValue : 0,
      defaultValue : 0,
      currentValue : 0,
      targetValue : null,
      min : -0.5,
      max : 0.5,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.05,
      noteHeldEasing : 0.01,
      easingMax : 0,
      easingMin : 0,
    };
    this.rotateZ = {
      displayLabel : 'Rotate Shape Z',
      resetValue : 0,
      defaultValue : 0,
      currentValue : 0,
      targetValue : null,
      min : -0.5,
      max : 0.5,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.05,
      noteHeldEasing : 0.01,
      easingMax : 0,
      easingMin : 0,
    };

    this.waveRotateX = {
      displayLabel : 'Rotate Wave X',
      resetValue : 0,
      defaultValue : 0,
      currentValue : 0,
      targetValue : null,
      min : -10.1,
      max : 10.1,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.009,
      noteHeldEasing : 0.002,
      easingMax : 0,
      easingMin : 0,
    };
    this.waveRotateY = {
      displayLabel : 'Rotate Wave Y',
      resetValue : 0,
      defaultValue : 0,
      currentValue : 0,
      targetValue : null,
      min : -10.1,
      max : 10.1,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.009,
      noteHeldEasing : 0.002,
      easingMax : 0,
      easingMin : 0,
    };
    this.waveRotateZ = {
      displayLabel : 'Rotate Wave Z',
      resetValue : 0,
      defaultValue : 0,
      currentValue : 0,
      targetValue : null,
      min : -10.1,
      max : 10.1,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.009,
      noteHeldEasing : 0.002,
      easingMax : 0,
      easingMin : 0,
    };

    this.translateZ = {
      displayLabel : 'Translate Z',
      resetValue : 0,
      defaultValue : 0,
      currentValue : 0,
      targetValue : null,
      min : -900,
      max : 900,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.009,
      noteHeldEasing : 0.002,
      easingMax : 0,
      easingMin : 0,
    };

    this.translateX = {
      displayLabel : 'Translate X',
      resetValue : 0,
      defaultValue : 0,
      currentValue : 0,
      targetValue : null,
      min : -900,
      max : 900,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.009,
      noteHeldEasing : 0.002,
      easingMax : 0,
      easingMin : 0,
    };

    this.translateY = {
      displayLabel : 'Translate Y',
      resetValue : 0,
      defaultValue : 0,
      currentValue : 0,
      targetValue : null,
      min : -900,
      max : 900,
      attrType : 'numeric',
      triggerSource : null,
      lockOn : false,
      easingValue : 0.009,
      noteHeldEasing : 0.002,
      easingMax : 0,
      easingMin : 0,
    };




    this.waveType = {
      displayLabel : 'Wave Type',
      resetValue : 'sin',
      defaultValue : 'sin',
      currentValue : 'sin',
      targetValue : null,
      options : ['sin', 'cos', 'tan'],
      attrType : 'variable',
    };

    this.shape = {
      displayLabel : "Shape",
      resetValue : 'torus',
      defaultValue : 'torus',
      currentValue : 'torus',
      targetValue : null,
      options : ['torus', 'plane', 'box', 'sphere', 'glock', 'ellipsoid' , 'cylinder', 'cone', 'lambo'],
      attrType : 'variable',
    };

    this.stroke = {
      displayLabel : 'Outline and Fill',
      resetValue : 'Outline',
      defaultValue : 'Outline',
      currentValue : 'Outline',
      targetValue : null,
      attrType : 'variable',
      options : ['Outline', 'Filled and Outline',]
    };

    this.yPoints = new Array(Math.floor(this.waveWidth / this.xSpacing.currentValue));
  }
}



// METHODS


/**
 * Based on the current wave period and spacing between x points
 * get the location of the y points to be rendered in the wave
 */
ThreeDWave.prototype.calcWave = function () {
  let dx = (myp5.TWO_PI / this.period.currentValue ) * this.xSpacing.currentValue;
  this.waveType.currentValue = (this.waveType.options.includes(this.waveType.currentValue)) ? this.waveType.currentValue : 'sin';
  this.origin += this.velocity.currentValue;
  let x = this.origin;
  for (let i = 0; i < this.yPoints.length; i++) {
    this.yPoints[i] = Math[this.waveType.currentValue](x) * this.amplitude.currentValue;
    x += dx;
  }
};


/**
 * Paint the object onto the screen based on the object's attributes.
 */
ThreeDWave.prototype.render = function() {

  this.rotateWave();
  myp5.push();
  if (!(this.shape.currentValue === 'lambo' || this.shape.currentValue === 'glock')) {
    this.setColor();
  }

  for (let x = 0; x < this.yPoints.length; x++) {
    let xPos = x * this.xSpacing.currentValue - this.windowWidth/2 + this.translateX.currentValue;
    let yPos = myp5.height/2 + this.yPoints[x] - this.windowHeight/2 + this.translateY.currentValue;
    let zPos = (x % 4 === 0) ? yPos + this.translateZ.currentValue : yPos;

    myp5.translate(xPos + this.windowWidth/4, yPos, zPos);
    this.rotateShape();
    this.renderShape();
  }
  myp5.pop();

};



/**
 * Sets the rotational speed along the X, Y, and Z axis of the individual wave.
 */
ThreeDWave.prototype.rotateWave = function() {
  myp5.rotateX(this.waveRotateX.currentValue);
  myp5.rotateY(this.waveRotateY.currentValue);
  myp5.rotateZ(this.waveRotateZ.currentValue);
};

/**
 * Sets the rotational speed along the X, Y, and Z axis of each shape
 */
ThreeDWave.prototype.rotateShape = function() {
  myp5.rotateX(this.rotateX.currentValue);
  myp5.rotateY(this.rotateY.currentValue);
  myp5.rotateZ(this.rotateZ.currentValue);
};

/**
 * Based on user toggling, set the color profile for element to be rendered
 */
ThreeDWave.prototype.setColor = function() {
  switch (this.stroke.currentValue) {
    case 'Outline':
      myp5.strokeWeight(1);
      myp5.stroke(this.colorB.currentValue, this.colorR.currentValue, this.colorG.currentValue);
      myp5.noFill();
      break;
    case 'Filled and Outline':
      myp5.strokeWeight(1);
      myp5.stroke(this.colorB.currentValue, this.colorR.currentValue, this.colorG.currentValue);
      myp5.fill(this.colorR.currentValue, this.colorG.currentValue, this.colorB.currentValue);
      break;
  }
};

/**
 * For each attribute transition from the current value to the target value
 */
ThreeDWave.prototype.easeInto = easeInto;

/**
 * Renders the given 3D Primitive Shape
 */
ThreeDWave.prototype.renderShape = function() {

  myp5.push();
  myp5.rotateX(myp5.frameCount * 0.01);
  myp5.rotateY(myp5.frameCount * 0.01);

  switch(this.shape.currentValue) {
    case 'box':
    case 'sphere':
      myp5[this.shape.currentValue](this.radius.currentValue * 3);
      break;
    case 'plane':
    case 'torus':
      myp5[this.shape.currentValue](this.radius.currentValue * 3.5, this.radius.currentValue * 1.5);
      break;
    case 'cylinder':
      myp5[this.shape.currentValue](this.radius.currentValue * 4, this.radius.currentValue * 5);
      break;
    case 'cone':
      myp5[this.shape.currentValue](this.radius.currentValue * 5, this.radius.currentValue * 20);
      break;
    case 'ellipsoid':
      myp5[this.shape.currentValue](this.radius.currentValue * (5/3), this.radius.currentValue * (2/3), this.radius.currentValue);
      break;
    case 'lambo':
    case 'glock':
      myp5.normalMaterial();

      myp5.scale(this.radius.currentValue * 0.07);
      myp5.model(objects[this.shape.currentValue]);
      break;
  }
  myp5.pop();


};


