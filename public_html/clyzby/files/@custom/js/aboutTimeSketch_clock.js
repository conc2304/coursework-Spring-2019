let myp5Clock;

let r = 200;

let cnvClock = {
  w: r * 2.2,
  h: r * 2.2,
};

let center = {
  x: cnvClock.w / 2,
  y: cnvClock.h / 2,
};

let clock = {
  d: 2 * r,
  hands: {
    second: {
      length: r * .9,
      width: 1,
    },
    minute: {
      length: r * .7,
      width: 2,
    },
    hour: {
      length: r * .5,
      width: 4,
    },
  }
};

myp5Clock = function (sketch) {

  sketch.setup = function () {
    sketch.createCanvas(cnvClock.w, cnvClock.h);
    sketch.background(0, 159, 0);
  };

  sketch.preload = function () {
  };

  sketch.draw = function () {
    sketch.background(100);

    drawClockFace();
    drawClockHands();

    // center point
    sClock.stroke(0);
    sClock.strokeWeight(20);
    sClock.point(center.x, center.y);
  };
};

let sClock = new p5(myp5Clock, window.document.getElementById('about-time-clock'));

let hashSpacing = 360 / 60;
let red, green, blue;

function drawClockFace() {

  sClock.fill(230);
  sClock.strokeWeight(30);
  sClock.stroke(0);
  sClock.ellipse(center.x, center.y, clock.d, clock.d);
  myClear();

  // minute hashes
  for (let degree = 0; degree < 360; degree += hashSpacing) {

    let frequency = 1;
    red = Math.sin(frequency * degree + (sClock.second() % 255)) * 127 + 128;
    green = Math.sin(frequency * degree + (sClock.minute() % 255)) * 127 + 128;
    blue = Math.sin(frequency * degree + (sClock.hour() % 255)) * 127 + 128;

    let pos = sClock.radians(degree);
    let x = center.x + Math.cos(pos) * (r);
    let y = center.x + Math.sin(pos) * (r);
    // 15 interval
    sClock.stroke(red, green, blue);
    if (degree % 15) {
      sClock.strokeWeight(2);
    } else {
      sClock.strokeWeight(7);
    }
    sClock.point(x, y);
  }
}


function drawClockHand(handPos, width) {
  sClock.strokeWeight(width);
  sClock.line(center.x, center.y, handPos.x, handPos.y);

  sClock.strokeWeight(width * 2)
  sClock.point(handPos.x, handPos.y);
}


function getTimeInRadians() {
  return {
    second : sClock.map(sClock.second(), 0, 60, 0, sClock.TWO_PI) - sClock.HALF_PI,
    minute : sClock.map(sClock.minute() + sClock.norm(sClock.second(), 0, 60), 0, 60, 0, sClock.TWO_PI) - sClock.HALF_PI,
    hour : sClock.map(sClock.hour() + sClock.norm(sClock.minute(), 0, 60), 0, 24, 0, sClock.TWO_PI * 2) - sClock.HALF_PI,
  };
}

function getHandPosXY(angles) {
  let handPos = {
    second : {},
    minute : {},
    hour : {},
  };

  for (let hand in clock.hands) {
    handPos[hand].x = center.x + Math.cos(angles[hand]) * clock.hands[hand].length;
    handPos[hand].y = center.y + Math.sin(angles[hand]) * clock.hands[hand].length;
  }

  return handPos;
}

function drawClockHands() {

  // shift starting point to be 12 and not 3 by subtracting half pi
  let angles = getTimeInRadians();
  let handPos = getHandPosXY(angles);


  sClock.noFill();
  sClock.stroke(100);
  sClock.strokeWeight(1);

  sClock.beginShape();
  sClock.vertex(center.x, center.y);
  sClock.vertex(center.x, center.y);
  for (let hand in handPos) {
    sClock.curveVertex(handPos[hand].x, handPos[hand].y);
    console.log(hand);
  }
  sClock.vertex(center.x, center.y);
  sClock.vertex(center.x, center.y);
  sClock.endShape();



  sClock.stroke(10);
  for (let hand in clock.hands) {
    drawClockHand(handPos[hand], clock.hands[hand].width );
  }
  myClear();

}

function myClear() {
  sClock.noStroke();
  sClock.noFill();
}


function drawExtraShit() {


  sClock.noFill();
  sClock.stroke(100);
  sClock.strokeWeight(1);

  sClock.beginShape();
  sClock.vertex(center.x, center.y);
  sClock.vertex(center.x, center.y);
  for (let hand in handPos) {
    sClock.curveVertex(handPos[hand].x, handPos[hand].y);
    console.log(hand);
  }
  sClock.vertex(center.x, center.y);
  sClock.vertex(center.x, center.y);
  sClock.endShape();


}