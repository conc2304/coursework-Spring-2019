

let myp5;
let tallyCount = 0;

let cnv = {
  w : 800,
  h : 500,
};

myp5 = function(sketch) {

  sketch.setup = function() {
    sketch.createCanvas(cnv.w, cnv.h);
    sketch.background(20);
  };

  sketch.preload = function() {
  };

  sketch.draw = function() {
    sketch.background(20);

    if (sketch.keyIsPressed) {
      tallyCount = 0;
    }

    drawTallies(tallyCount);
  };
};

let s = new p5(myp5, window.document.getElementById('p5-container'));



// on click create a tally in the box
s.mouseClicked = function(e) {
  tallyCount ++;
  console.log(tallyCount)
  e.preventDefault();
};


let tally = {
  height: 20,
  weight: 2,
  spacingX: 10,
  spacingY: 30,
  padding: 20,
};

let padding = 20;
let groupOrigin;
let groupWidth = 5 * (tally.spacingX + tally.weight);
let maxGroupsPerRow =  Math.floor((cnv.w - (2 * padding)) / groupWidth);
let maxTalliesPerRow = (maxGroupsPerRow * 5);

function drawTallies(numTallies) {

  s.stroke(255, 0, 0);
  s.strokeWeight(tally.weight);

  let tallyPos = {};

  for (let i = 1; i <= numTallies; i++) {
    let rowIndex = Math.floor(i / (maxTalliesPerRow));  // bc 20/20 evals to 1 and not row 0
    let rowMult = rowIndex * tally.spacingY;

    if ( i % 5 === 0) {  // the diagonal tally
      tallyPos = {
        x1 : groupOrigin.x - (tally.spacingX + tally.weight),
        y1 : groupOrigin.y,
        x2 : groupOrigin.x + (groupWidth - tally.spacingX),
        y2 : padding + tally.height,
      }
    } else {  // standard tally
      tallyPos = {
        x1 : padding + i * (tally.spacingX + tally.weight),
        y1 : padding,
        x2 : padding + i * (tally.spacingX + tally.weight),
        y2 : padding + tally.height,
      };

      if (i % 5 === 1) {
        // this is the first of the group
        // save its start point for the sake of the fifth/diagonal tally
        groupOrigin = {
          x: tallyPos.x1,
          y: tallyPos.y1,
        };
      }
    }

    if (i == 31) {
      let stop = true;
    }

    s.line(tallyPos.x1, tallyPos.y1, tallyPos.x2, tallyPos.y2);

  }



}

