// to do make shared object functions into an object

let easeInto = function() {
  let attribute;
  let easeBy;

  // if the message came from the drum pad
  // then ease into the target value,
  // once we have hit the target value
  // ease back into the reset value


  for (attribute in this) {
    if (!this.hasOwnProperty(attribute)) continue;
    if (!this[attribute].targetValue) continue;
    if (this[attribute].options) continue;

    let triggerIsDrumPad = (this[attribute].hasOwnProperty('triggerSource') && this[attribute].triggerSource === Drum_Pad_Hit);
    let targetValue = this[attribute].targetValue;
    let currentValue = this[attribute].currentValue;
    let resetValue = this[attribute].resetValue;

    if (this[attribute].hasOwnProperty('triggerSource')) {
      switch (this[attribute].triggerSource) {
        case Drum_Pad_Hit:
          easeBy = .001;
          break;
        case Note_Held:
          easeBy =  this[attribute].noteHeldEasing;
          break;
        default:
          easeBy = this[attribute].easingValue;
          break;
      }
    }


    // if the message came from the drum pad
    // then ease into the target value,
    // once we have hit the target value
    if (triggerIsDrumPad && targetValue === currentValue) {
      console.log('glitch');
      targetValue = this[attribute].targetValue = resetValue;
      this[attribute].triggerSource = null;  // once we have reached the peak unset the trigger source
    }

    // since we will near but never reach the target value with easing
    if (targetValue && (currentValue !== targetValue)) {
      let difference = targetValue - currentValue;
      let valueAdded = difference * easeBy;


      if (triggerIsDrumPad) {
        // if ( Math.floor(Math.abs(valueAdded)) === 0) {
        if (valueAdded < targetValue / 100 ) {        // if value added is less than 1% of of target value, then call it done
          this[attribute].currentValue = this[attribute].targetValue;
        } else {
          this[attribute].currentValue += valueAdded;
        }
      } else {
        this[attribute].currentValue += valueAdded;
      }
    }
  }
};