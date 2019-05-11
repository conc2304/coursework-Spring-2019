/**
 *
 * midiCtrl.js
 *
 * Receives midi messages from midiService.js
 * Uses those messages to affect changes in
 * the attributes of the drawn instances in waveDrawer.js
 * Mapping of buttons and knobs to attributes are set in midiCtrlConfig.js
 *
 */


let notesHeld = [];  // an array of all the notes being held at once

/**
 * Function to handle noteOn messages (ie. key is pressed) ... but its a pad
 * @param MIDImessage
 */
let noteOn = (MIDImessage) => {
  'use strict';
  console.log('NOTE ON');
  setElementAttribute(MIDImessage.data, MIDImessage.timeStamp, Note_Pressed);
};

let noteHeld = (MIDImessage) => {
  "use strict";
  console.log('Note Held');
  setElementAttribute(MIDImessage.data, MIDImessage.timeStamp, Note_Held);
};

let noteOff = (MIDImessage) => {
  "use strict";
  console.log('OFF CALLBACK');
  setElementAttribute(MIDImessage.data, MIDImessage.timeStamp, Note_Off);
};

let drumHit = (MIDImessage) => {
  "use strict";
  console.log('Drum_Pad_Hit');
  let velocity = (MIDImessage.data.length > 2) ? MIDImessage.data[2] : 0; // a velocity value might not be included with a noteOff command

  if (velocity > 0) {
    setElementAttribute(MIDImessage.data, MIDImessage.timeStamp, Drum_Pad_Hit);
  }
};

/**
 * Set the attribute of one of the instances corresponding to the note pressed
 * based on the velocity of the note
 * @param note        -  the value of the note pressed
 * @param velocity    -  how hard the note was pressed
 * @param noteIsOff   -  whether the note is being pressed or released
 * @param isKnob      -  whether it is a knob or a pad press
 */
let setElementAttribute = (MIDImessageData, timeStamp, triggerSource) => {
  "use strict";

  let channel = MIDImessageData[0];
  let note = MIDImessageData[1];
  let velocity = (MIDImessageData.length > 2) ? MIDImessageData[2] : 0; // a velocity value might not be included with a noteOff command

  console.log(`channel: ${channel}`);
  let configsToSet = (triggerSource === Drum_Pad_Hit) ? drumPad[note] : mpd218[note];
  for (let i = 0; i < configsToSet.length; i++) {
    let element = configsToSet[i][0];
    let attr = configsToSet[i][1];
    let ctrlElement = getCtrlElement(element);
    let lockBeingSet = false;

    // if we re setting a lock we dont want to trigger
    // the other attribute changes associated with that note
    if (attr === 'lock') {
      if (triggerSource !== Note_Off) {   // if we trigger on not off it will immediately unlock
        lockBeingSet = lockAttributes(element);
      }
      if (lockBeingSet === true) {
        return
      } else {
        continue;
      }
    }

    if (triggerSource !== Knob_Active) {
      if (triggerSource !== Note_Off) {
        addNoteHeld(note, timeStamp, element, attr);
      } else {
        removeNotesHeld(note);
      }
    }

    // don't change the value if it is locked
    if (ctrlElement[attr].hasOwnProperty('lockOn') && ctrlElement[attr].lockOn === true) return;

    let type = ctrlElement[attr].attrType;
    let value;

    if (triggerSource === Note_Off) {
      ctrlElement[attr].targetValue = ctrlElement[attr].resetValue;
      return;
    }

    switch (type) {
      case 'numeric':
        if (triggerSource === Note_Off) {
          value = ctrlElement[attr].resetValue;
        } else {
          value = getNumericValueToSet(ctrlElement, attr, velocity, triggerSource);
        }

        ctrlElement[attr].triggerSource = triggerSource;
        ctrlElement[attr].targetValue = value;
        break;
      case 'variable':
        value = getNextVariableOption(ctrlElement, attr);
        ctrlElement[attr].currentValue = ctrlElement[attr].targetValue = value;
        break;
    }
  }
};


let addNoteHeld = (note, timeStamp, element, attr) => {
  "use strict";
  let noteAlreadyHeld = false;
  for (let i in notesHeld) {
    if (notesHeld[i][0] === note) {
      noteAlreadyHeld = true;
      break;
    }
  }
  if (!noteAlreadyHeld) {
    notesHeld.push([note, timeStamp, element, attr]);
  }
};

// when the lock button is pressed in conjunction
// with any pad that is controlling the same instance
// hold that value until it is unlocked
let lockAttributes = (element) => {
  "use strict";

  // loop through all of the notes held
  // and check if the any of them control the same element
  let ctrlElement;
  let lockSet = false;
  for (let i in notesHeld) {
    if (notesHeld[i][2] === element && notesHeld[i][3] !== 'lock') {
      ctrlElement = getCtrlElement(element);
      ctrlElement[notesHeld[i][3]].lockOn = !ctrlElement[notesHeld[i][3]].lockOn;
      lockSet = true;
    }
  }
  return lockSet;
};

/**
 *
 * @param ctrlElement   - the instance whose attributes we are changing
 * @param attr          - the attribute we are changing in the instance
 * @param velocity      - the velocity of pressed pad returned by the midi controller
 * @returns {Number|Array|*}
 */
let getNumericValueToSet = (ctrlElement, attr, velocity, triggerSource) => {
  "use strict";
  let min = ctrlElement[attr].min;
  let max = ctrlElement[attr].max;

  // 127 is the max value returned by the midi controller
  let triggerMax = (triggerSource !== Drum_Pad_Hit) ? 127 : 60;
  let triggerMin = (triggerSource !== Drum_Pad_Hit) ? 0 : -40;
  let returnValue = myp5.map(velocity, 0, triggerMax, min, max);

  return returnValue;
};


/**
 * Cycle to the next available option for an attribute
 * @param ctrlElement   - the instance whose attributes we are changing
 * @param attr          - the attribute we are changing in the instance
 * @returns {string}    - the string value that we are setting
 */
let getNextVariableOption = (ctrlElement, attr) => {
  "use strict";
  if (!ctrlElement[attr].options) return;

  let numOptions = ctrlElement[attr].options.length;
  let index = ctrlElement[attr].options.indexOf(ctrlElement[attr].currentValue);
  index = (index + 1) % numOptions;

  return ctrlElement[attr].options[index];
};


let removeNotesHeld = (note) => {
  "use strict";
  for (let i in notesHeld) {
    if (!notesHeld.hasOwnProperty(i)) {
      continue;
    }
    if (notesHeld[i][0] === note) {
      notesHeld.splice(i, 1);
    }
  }
};

/**
 * Returns the instance object to be controlled
 * @param instanceName
 */
let getCtrlElement = (instanceName) => {
  "use strict";
  instanceName = instanceName.toLowerCase();
  switch (instanceName) {
    case 'centerwave':
      return myp5.getCenterWave();
      break;
    case 'outerwaves' :
      return myp5.getOuterWaves();
      break;
    case 'threedwave' :
      return myp5.getThreeDWave();
      break;
  }
};

/**
 * Trigger a change in a control element when a knob is active.
 * @param MIDImessage
 */
let knobActive = (MIDImessage) => {
  "use strict";
  console.log('KNOB ACTIVE');
  console.log(MIDImessage);

  let channel = MIDImessage.data[0];
  let note = MIDImessage.data[1];
  let velocity = (MIDImessage.data.length > 2) ? MIDImessage.data[2] : 0; // a velocity value might not be included with a noteOff command

  setElementAttribute(MIDImessage.data, MIDImessage.timeStamp, Knob_Active);
};

/**
 * Run a sequence based on a trigger  // todo
 * @param MIDImessage
 */
let runSequence = (MIDImessage) => {
  "use strict";
  console.log(MIDImessage);
};

// for each attibute of a control element
// go through and set their reset value
// todo - find a way to get the threeDWaves back into their original formation
let resetElements = () => {
  "use strict";

  let element;
  let attr;

  for (element in availableElements) {
    ctrlElement = getCtrlElement(availableElements[element]);
    ctrlElement.origin = 0;

    for (attr in ctrlElement) {
      if (ctrlElement[attr].hasOwnProperty('resetValue')) {
        if (ctrlElement[attr].attrType === 'numeric') {
          ctrlElement[attr].targetValue = ctrlElement[attr].resetValue;
        }
        if (ctrlElement[attr].attrType === 'variable') {
          ctrlElement[attr].currentValue = ctrlElement[attr].resetValue;
        }

      }
      if (ctrlElement[attr].hasOwnProperty('lockOn')) {
        ctrlElement[attr].lockOn = false;
      }
    }
  }
};

