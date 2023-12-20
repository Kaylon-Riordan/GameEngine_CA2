import Component from './component.js';

class Sounds extends Component{
    constructor() {
        super(); // Call the parent constructor.
    }
    // Method takes in part of a file apth and wether or not to loop the sound
    playSound(source, loop = false) {
        // create an audio object and set the source to the file path
        const audio = new Audio();
        audio.src = './resources/sounds/' + source + '.mp3';
        // if loop is true set the audio to loop
        if(loop) {
            audio.loop = true;
        }
        // play the audio
        audio.play();
    }
}
export default Sounds;