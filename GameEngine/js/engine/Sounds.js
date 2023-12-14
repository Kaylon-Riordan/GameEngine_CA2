import Component from './component.js';

class Sounds extends Component{
    constructor() {
        super(); // Call the parent constructor.
    }
    playSound(source) {
        const audio = new Audio();
        audio.src = './resources/sounds/' + source + '.mp3'; // Initialize the source.
        audio.play();
    }
}
export default Sounds;