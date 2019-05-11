class MyShape {
  constructor() {
    this.position = {
      name: 'position',
      x: -500,
      y: 200,
      z: 500,
    };
    this.velocity = {
      name: 'velocity',
      delta: .05,
      max: 10,
      min: 0,
      value: 1,
      direction: 'ASC',
    };
    this.w = {
      name: 'width',
      delta: 1,
      max: cnv.w * .5,
      min: cnv.w * .2,
      value: cnv.w * .2,
      direction: 'ASC',
    };
    this.h = {
      name: 'height',
      delta: 1,
      max: cnv.h * .5,
      min: cnv.h * .2,
      value: cnv.h * .2,
      direction: 'ASC'
    };
    this.fill = {
      name: 'fill',
      delta: 5,
      direction: 'ASC',
      min: 0,
      max: 255,
      value: 0,
    };
    this.stroke = {
      name: 'stroke',
      delta: .5,
      direction: 'ASC',
      min: 0,
      max: 255,
      value: 0,
    };
    this.animate = animateValues;
  };
}

class myBox {
  constructor() {
    this.posX = {}
  }
}

function animateValues(shapeProperty) {

  if (typeof shapeProperty === "string") {
    shapeProperty = this[shapeProperty]
  }

  if (!shapeProperty.direction || !shapeProperty.hasOwnProperty('min') || !shapeProperty.hasOwnProperty('max')) return;

  if (shapeProperty.direction === 'ASC') {
    shapeProperty.value += shapeProperty.delta;

    if (shapeProperty.value > shapeProperty.max) {
      shapeProperty.direction = "DESC"
    }
  } else if (shapeProperty.direction === 'DESC') {
    shapeProperty.value -= shapeProperty.delta;

    if (shapeProperty.value < shapeProperty.min) {
      shapeProperty.direction = 'ASC';
    }
  }
}

class Parametric {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 5;
    this.height = 2;
    this.depth = 3
    this.translateY = -800;   // used to get the shape where we need it
    this.translateX = -800;
    this.translateZ = -800;
    this.iter = 500;  // number of points
    this.q = 1;
    this.theta = 1;  // rate of change
    this.deltaTheta = 100;  // tbh i forgot what this is
    this.velocity = 0.01;
    this.parametricType = parametric006;
  }

}

/**
 * Returns all of the points for the parametric vertexes
 * @param shape
 * @returns {{x: *, y: *, z: *}}
 */
function parametric006(shape) {
  return {
    x: shape.width * s.sin(shape.theta + s.sin(shape.theta + shape.q)) * cnv.w / 4 + cnv.w / 2 + shape.translateX,
    y: shape.height * s.cos(s.frameCount * .01 + s.sin(shape.theta - shape.q)) * cnv.h / 2 + cnv.h + shape.translateY ,
    z: shape.depth * s.sin(shape.theta + s.sin(s.frameCount * .01)) * cnv.w / 4 + cnv.w + shape.translateZ,
  };
}

let parametric1 = new Parametric;

