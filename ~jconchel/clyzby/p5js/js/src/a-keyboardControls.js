
let editingPiano = true;  // Don't play 'piano' keys while in editing mode;

$(function () {
  "use strict";
  $('#piano-mode').click(function () {
    $('.piano-mode').toggleClass('hide');
    $('#piano-mode').toggleClass('editing');
    editingPiano = !editingPiano;
  });
});


/**
 *   For each of the properties associated with that key
 *   set the targetValue to the value associated to that key press
 *   on release set it back to the reset value
 * @param key
 * @param pressed
 */


let playPianoKey = (key, pressed) => {
  "use strict";

  if (editingPiano) {
    return null;
  }

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

