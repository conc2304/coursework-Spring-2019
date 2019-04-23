/*jshint esversion: 6 */

/**
 * The channel / command set in the configuration of the midi controller set through it's software
 * @type {number}
 */
const Note_Pressed   = 159;
const Note_Held      = 175;
const Note_Off       = 143;
const Knob_Active    = 176;
const Drum_Pad_Hit   = 153;


const availableElements = ['centerWave', 'outerWaves', 'threeDWave'];


// range direction is from bottom left to upper right
// we expect ranges to start on an even number 
// for the purposes of the modulo operator to return 
// the correct column location

let MPD_218 = {
  pads : {
    channel : 153,
    range : {   // notes that are in this pads config
      min : 36,
      max : 83,
    }, 
    banks : 3,  // number of banks available
    matrix : {
      numCols : 4,
      numRows : 4,
    },
  },
  knobs : {
    channel : 176,
    range : {
      min : 2,
      max : 19,
    },  
    banks : 3,
    matrix : {
      numCols : 2,
      numRows : 3,
    },
  }
};



/** midi note number : [
 *    instance to control,
 *    attribute of instance,
 *  ]
 **/
let mpd218 = {  // array of attributes to control (allows for a 1 to many change)

    // Start Knobs
  2 : [
    ['centerWave', 'colorB'],
    ['outerWaves', 'colorR'],

    ],
  4 : [
    ['centerWave', 'colorG'],
    ['outerWaves', 'colorB'],

    ],
  6 : [
    ['centerWave', 'colorR'], // end left col
    ['outerWaves', 'colorG'],

    ],
  3 : [
    ['centerWave', 'amplitude'],
    ['outerWaves', 'amplitude'],
    // ['threeDWave', 'amplitude'],

    ],
  5 : [
    ['centerWave', 'period'],
    ['outerWaves', 'period'],
    // ['threeDWave', 'period'],

    ],
  7 : [
    ['centerWave', 'xSpacing'],
    ['outerWaves', 'xSpacing'],

    ],

  // Start Bank 2
  8  : [
    ['threeDWave', 'rotateX'],
    ['threeDWave', 'colorR'],
        ],
  10 : [
    ['threeDWave', 'rotateY'],
    ['threeDWave', 'colorG'],

    ],
  12 : [
    ['threeDWave', 'rotateZ'],
    ['threeDWave', 'colorB'],
      // end left col
    ],
  9  : [
    ['threeDWave', 'waveRotateX'],
    ['threeDWave', 'translateZ'],
    ],
  11 : [
    ['threeDWave', 'waveRotateY'],
    ['threeDWave', 'colorR'],
    ['threeDWave', 'translateX'],


    ],
  13 : [
    // ['threeDWave', 'waveRotateZ'],
    ['threeDWave', 'translateY'],

    ],

  // Start Bank 3
  14 : [
    ['outerWaves', 'numWaves'],
    ],
  16 : [
    ['threeDWave', 'velocity'],
    ],
  18 : [
    ['threeDWave', 'xSpacing'],
    // end left col
    ],
  15 : [
    ['threeDWave', 'colorR'],
    ],
  17 : [
    ['threeDWave', 'colorG'],
    ],
  19 : [
    ['threeDWave', 'colorB'],
    ],
  // End Knobs



  // Start Pads

  // Pad Bank 1
  // Row 1 - bottom
  36 : [
    ['centerWave', 'radius'],
    ],
  37 : [
    ['outerWaves', 'radius'],
    ['outerWaves', 'numWaves'],  
    ],
  38 : [
    ['threeDWave', 'radius'],
    ],
  39 : [
    ['centerWave', 'shape'],
    ],

    // Row 2
  40 : [
    ['centerWave', 'velocity'],
    ],
  41 : [
    ['outerWaves', 'velocity'],
    ],
  42 : [
    ['threeDWave', 'velocity'],
    ],
  43 : [
    ['outerWaves', 'shape'],
    ],

    // Row 3
  44 : [
    ['centerWave', 'amplitude'],
    ],
  45 : [
    ['outerWaves', 'amplitude'],
    ],
  46 : [
    ['threeDWave', 'amplitude'],
    ],
  47 : [
    ['threeDWave', 'shape'],
    ],

    // Row 4 - top
  48 : [
    ['centerWave', 'lock'],
    ['centerWave', 'waveType'],
    ],
  49 : [
    ['outerWaves', 'lock'],
    ['outerWaves', 'waveType'],
    ],
  50 : [
    ['threeDWave', 'lock'],
    ['threeDWave', 'waveType'],
    ],
  51 : [
    ['threeDWave', 'stroke'],
    ['outerWaves', 'stroke'],
    ['centerWave', 'stroke'],
  ],
};

let drumPad = {  // on chanel 153
  36 : [   
    ['outerWaves', 'radius'],
    ['outerWaves', 'amplitude'],
  ],
  37 : [
    ['threeDWave', 'radius'],

  ],
  38 : [    
    ['centerWave', 'radius'],
  ],
  39 : [
    ['centerWave', 'amplitude'],
  ],
}

