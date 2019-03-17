

let myp5Tally;
let tallyCount = 0;

let cnv = {
  w : 350,
  h : 200,
};

myp5Tally = function(sketch) {

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

let sTally = new p5(myp5Tally, window.document.getElementById('about-time-tally'));


// on click create a tally in the box
sTally.mouseClicked = function(e) {
  tallyCount ++;
  console.log(tallyCount)
  e.preventDefault();
};


let tally = {
  height: 20,
  weight: 2,
  spacingX: 10,
  spacingY: 20,
  padding: 20,
  max: 5,
  groupPadding: 10,
};

let padding = 40;
let groupOrigin;
let groupWidth = tally.max * (tally.spacingX + tally.weight) ;
let maxGroupsPerRow =  Math.floor((cnv.w - (2 * padding)) / groupWidth);
let maxTalliesPerRow = (maxGroupsPerRow * 5);

function drawTallies(numTallies) {

  sTally.stroke(255, 0, 0);
  sTally.strokeWeight(tally.weight);

  let tallyPos = {};
  let rowMult;
  let rowIndex;
  let groupPadding;
  let groupIndex;
  let groupRowIndex

  for (let i = 1; i <= numTallies; i++) {

    rowIndex = Math.floor(i / (maxTalliesPerRow));  //
    if (i % maxTalliesPerRow === 0) {  // this is the last group of the row
      // bc 20/20 evaluates to 1 and not row 0
      rowIndex--;
    }
    rowMult = rowIndex * (tally.height + tally.spacingY);

    groupIndex = Math.floor(i / tally.max);
    // get the index of the group relative to the row (ie first, second.. last group of row)
    groupRowIndex = groupIndex % maxGroupsPerRow;
    if (i % tally.max === 0) {
      groupRowIndex --;
    }

    groupPadding = groupRowIndex * tally.groupPadding;

    if ( i % tally.max === 0) {  // the diagonal tally
      tallyPos = {
        x1 : groupOrigin.x - (tally.spacingX + tally.weight),
        y1 : groupOrigin.y,
        x2 : groupOrigin.x + (groupWidth - tally.spacingX),
        y2 : padding + tally.height + rowMult,
      }
    } else {  // standard tally
      tallyPos = {
        x1 : padding + (i % maxTalliesPerRow) * (tally.spacingX + tally.weight) + groupPadding,
        y1 : padding + rowMult ,
        x2 : padding + (i % maxTalliesPerRow) * (tally.spacingX + tally.weight) + groupPadding,
        y2 : padding + tally.height + rowMult ,
      };

      if (i % tally.max === 1) {
        // this is the first of the group
        // save its start point for the sake of the fifth/diagonal tally
        groupOrigin = {
          x: tallyPos.x1,
          y: tallyPos.y1,
        };
      }
    }

    sTally.stroke(255, 0, 0);
    sTally.strokeWeight(tally.weight);
    sTally.line(tallyPos.x1, tallyPos.y1, tallyPos.x2, tallyPos.y2);

    // for debugging - the starting points of the line
    sTally.stroke(0, 255, 0);
    sTally.strokeWeight(tally.weight + 1);
    sTally.point(tallyPos.x1, tallyPos.y1);

  }
}

