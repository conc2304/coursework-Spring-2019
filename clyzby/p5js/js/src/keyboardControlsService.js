

/**
 *   For each of the properties associated with that key
 *   set the targetValue to the value associated to that key press
 *   on release set it back to the reset value
 * @param key
 * @param pressed
 */
let playPianoKey = (key, pressed) => {
  "use strict";

  let ctrlHandlers = keyboardCtrl[key];
  let controlObject;

  for (let controlElementName in ctrlHandlers) {
    if (!ctrlHandlers.hasOwnProperty(controlElementName)) {
      continue;
    }

    controlObject = myp5[`get${controlElementName}`]();
    for (let ctrlProp in ctrlHandlers[controlElementName]) {
      if (!ctrlHandlers[controlElementName].hasOwnProperty(ctrlProp)) {
        continue;
      }

      if (pressed) {
        controlObject[ctrlProp].targetValue = controlObject[ctrlProp].currentValue = Number(ctrlHandlers[controlElementName][ctrlProp]);
      } else {
        controlObject[ctrlProp].targetValue = controlObject[ctrlProp].currentValue = Number(controlObject[ctrlProp].resetValue);
      }
    }
  }
};


/**
 * During the draw cycle, loop through every keyboard key that we
 * have assigned a value to and if the key is down, then animate it
 * @returns {boolean}
 */
let playKeyboardKeys = () => {
  "use strict";

  if (!keyboardCtrl) {
    return false;
  }

  // key is the charcode for the key
  for (let key in keyboardCtrl) {
    if (!keyboardCtrl.hasOwnProperty(key)) {
      continue;
    }

    if (myp5.keyIsDown(key)) {
      // then play the key
      playPianoKey(key, true);
    }
  }
};

