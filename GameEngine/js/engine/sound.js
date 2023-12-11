import Component from './component.js';

class Sound extends Component{
    constructor() {
        super(); // Call the parent constructor.
    }

    playSound(Audio) {
        Audio.play();
    }
}

export default Sound;