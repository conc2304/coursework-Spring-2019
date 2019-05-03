
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

  let waveHandlers = keyboardCtrl[key];
  let waveCtrl;
  console.log(waveHandlers);


  for (let waveName in waveHandlers) {
    if (!waveHandlers.hasOwnProperty(waveName)) {
      continue;
    }

    waveCtrl = getCtrlElement(waveName);
    for (let waveProp in waveHandlers[waveName]) {
      if (!waveHandlers[waveName].hasOwnProperty(waveProp)) {
        continue;
      }

      let waveClass = `.range-slider.${waveName}-${waveProp}`;
      console.log(waveClass);
      console.log($(waveClass));
      console.log(`set ${waveProp} to ${waveHandlers[waveName][waveProp]}`);

      let pianoValue;
      if (pressed) {
        pianoValue = waveHandlers[waveName][waveProp];
      } else {
        pianoValue = waveCtrl[waveProp].resetValue;
      }

      $(waveClass).val(pianoValue);
      updateRangeDisplay($(waveClass));
    }
  }
};

