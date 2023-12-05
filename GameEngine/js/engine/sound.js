import { AudioFiles } from './resources.js';
import Component from './component.js';

class Sound extends Component{
    constructor() {
        super(); // Call the parent constructor.
        this.jump = new Audio(AudioFiles.jump);
        this.collect = new Audio(AudioFiles.collect);
    }

    jumpSound() {
        this.jump.play();
    }
    
    collectSound() {
        this.collect.play();
    }
}

export default Sound;