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
  };

  sketch.preload = function () {
  };

  let angles;
  sketch.draw = function () {

    angles = getTimeInRadians();

    drawClockFace();
    drawExtraShit(angles);
    drawClockHands(angles);

    showDigitalTime();

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

function showDigitalTime() {

  let positionWithRespectToNoon = (Math.floor(sClock.hour() / 12) >= 1) ? 'PM' : 'AM';
  let myTime = {
    'h': (sClock.hour() % 12).toString(),
    'm': (sClock.minute()).toString(),
    's': (sClock.second()).toString(),
  };

  for (let val in myTime) {
    if (myTime[val].length !== 2) {
      myTime[val] = '0' + myTime[val];
    }
  }
  let hh = myTime.h;
  let mm = myTime.m;
  let ss = myTime.s;


  let displayTime = `${hh}:${mm}:${ss} ${positionWithRespectToNoon}`;

  sClock.textSize(16);
  sClock.fill(0, 0, 0);
  sClock.text(displayTime, cnvClock.w * .66, (cnvClock.h / 2) + 2);
}

function drawClockHand(handPos, width) {
  sClock.strokeWeight(width);
  sClock.line(center.x, center.y, handPos.x, handPos.y);

  sClock.strokeWeight(width * 2);
  sClock.point(handPos.x, handPos.y);
}


function getTimeInRadians() {
  return {
    second: sClock.map(sClock.second(), 0, 60, 0, sClock.TWO_PI) - sClock.HALF_PI,
    minute: sClock.map(sClock.minute() + sClock.norm(sClock.second(), 0, 60), 0, 60, 0, sClock.TWO_PI) - sClock.HALF_PI,
    hour: sClock.map(sClock.hour() + sClock.norm(sClock.minute(), 0, 60), 0, 24, 0, sClock.TWO_PI * 2) - sClock.HALF_PI,
  };
}


function getHandPosXY(angle, length) {
  return {
    x: center.x + Math.cos(angle) * length,
    y: center.y + Math.sin(angle) * length,
  };
}


function drawClockHands(angles) {

  // shift starting point to be 12 and not 3 by subtracting half pi
  let handPos = {
    second: getHandPosXY(angles.second, clock.hands.second.length),
    minute: getHandPosXY(angles.minute, clock.hands.minute.length),
    hour: getHandPosXY(angles.hour, clock.hands.hour.length),
  };

  sClock.stroke(10);
  for (let hand in clock.hands) {
    drawClockHand(handPos[hand], clock.hands[hand].width);
  }
  myClear();
}


function myClear() {
  sClock.noStroke();
  sClock.noFill();
}


function drawExtraShit(angles) {
  let iter = 9;
  let handPos = {};

  sClock.noFill();
  sClock.strokeWeight(1);

  let frequency = 1;
  for (let i = 0; i <= iter; i++) {

    red = Math.sin(frequency * i + 2 + (sClock.frameCount * .03 % 255)) * 127 + 128;
    green = Math.sin(frequency * i + 4 + (sClock.frameCount * .03 % 255)) * 127 + 128;
    blue = Math.sin(frequency * i + 8 + (sClock.frameCount * .03 % 255)) * 127 + 128;

    sClock.stroke(red, green, blue, 255 / i);

    sClock.beginShape();
    sClock.vertex(center.x, center.y);
    sClock.vertex(center.x, center.y);

    for (let hand in clock.hands) {
      handPos[hand] = getHandPosXY(angles[hand], clock.hands[hand].length / i);
      sClock.curveVertex(handPos[hand].x, handPos[hand].y);
    }

    sClock.vertex(center.x, center.y);
    sClock.vertex(center.x, center.y);
    sClock.endShape();
  }
}