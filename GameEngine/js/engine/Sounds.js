import Component from './component.js';

class Sounds extends Component{
    constructor() {
        super(); // Call the parent constructor.
    }
    playSound(source, loop = false) {
        const audio = new Audio();
        audio.src = './resources/sounds/' + source + '.mp3'; // Initialize the source.
        if(loop) {
            audio.loop = true;
        }
        audio.play();
    }
}
export default Sounds;