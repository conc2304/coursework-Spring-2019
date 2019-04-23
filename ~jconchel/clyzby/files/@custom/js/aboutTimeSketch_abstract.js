'use strict';

let myp5Abstract;
let cnvAb = {
  w : 600,
  h : 600,
};
myp5Abstract = function (sketch) {

  sketch.setup = function () {
    sketch.createCanvas(cnvAb.w, cnvAb.h);
  };

  sketch.preload = function () {
  };

  sketch.draw = function () {

    aClock.background(0,0,0);
    aClock.noFill();

    drawParametric(shape);
  };
};

let aClock = new p5(myp5Abstract, window.document.getElementById('about-time-abstract'));

let shape = {
  x : 0,
  y : 0,
  width : 2,
  height : 1,
  translateY : -400,
  translateX : 2,
  iter : 60,
  color : {
    r : 0,
    g : 255,
    b : 255,
    a : 1,
    k : 0,
    deltaK : 0,  //.1
  },
  q : 1,
  theta : 1,
  deltaTheta : 5,
  velocity : 0.001,
  parametricType : parametric006,
};

function parametric006(shape) {
  return {
    x : Math.sin(shape.theta + Math.sin(shape.theta + shape.q)) * cnvAb.w/4 + cnvAb.w/2 + shape.translateX,
    y : Math.cos(aClock.map(aClock.hour(), 1, 24, 0, 1) + Math.sin(shape.theta - shape.q)) * cnvAb.h/shape.height + cnvAb.h/2 + shape.translateY,
  };
}

let color_col;
let position = {};
let pi = 3.14159265358979;


function drawParametric(shape) {

  shape.theta = 0;
  shape.x = 0;
  shape.y = 0;
  shape.color.k = aClock.map(aClock.second(), 1, 60, 0, 255);
  shape.deltaTheta = aClock.map(aClock.second(), 1, 60, 1, aClock.minute());
  shape.q = aClock.minute();

  if (shape.color.k > 0) {
    shape.color.r = shape.color.k % 255;
    shape.color.g = 128 + shape.color.k % 128;
    shape.color.b = 255 - (shape.color.k % 128);
  }

  color_col = [shape.color.r, shape.color.g, shape.color.b];
  aClock.stroke(color_col);
  aClock.beginShape();

  for (let i = 0; i < shape.iter; i++) {
    // shape.k += .01;
    shape.theta += shape.deltaTheta;
    position = shape.parametricType(shape);
    aClock.curveVertex(position.x, position.y) ;
  }
  aClock.endShape();
}