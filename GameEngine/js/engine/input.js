// This class depends on the Component, which is a separate module and needs to be imported.
import Component from './component.js';

// The Input class is responsible for handling keyboard and gamepad input.
class Input extends Component {
  // The constructor initializes a new instance of the Input class.
  constructor() {
    // Call the constructor of the parent class (Component).
    super();
    // An object to store the state of each key. The keys are the keyboard key codes, and the values are boolean indicating whether the key is down.
    this.keys = {};

    // Add event listeners for the keydown and keyup events.
    // When a keydown event is fired, the corresponding key in the keys object is set to true.
    // When a keyup event is fired, the corresponding key in the keys object is set to false.
    document.addEventListener('keydown', (event) => (this.keys[event.code] = true));
    document.addEventListener('keyup', (event) => (this.keys[event.code] = false));
  }

  // This method checks if a particular key is down.
  isKeyDown(key) {
    // If the key is in the keys object and its value is true, return true. Otherwise, return false.
    return this.keys[key] || false;
  }
}

// The Input class is then exported as the default export of this module.
export default Input;