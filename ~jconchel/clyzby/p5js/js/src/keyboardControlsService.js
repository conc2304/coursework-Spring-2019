

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
        controlObject[ctrlProp].targetValue = Number(ctrlHandlers[controlElementName][ctrlProp]);
      } else {
        controlObject[ctrlProp].targetValue = Number(controlObject[ctrlProp].resetValue);
      }
    }
  }
};

