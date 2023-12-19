import Component from './component.js';
import Images from './images.js';

// This class is based off code from the following video: https://www.youtube.com/watch?v=yTlmOpW6kOc&t=374s
class Animation extends Component { 
    // create an array of images
    images = [];
    constructor(fileNameTemplate, numberOfImages, timerCount, state, loop = true) {
        super();
        // Use a for loop to create a number of images that take the fileNameTemplate and replace the ? with the index of the image, then put the image into the array
        for (let i = 0; i < numberOfImages; i++) {
            var fileName = fileNameTemplate.replace('?', i);
            const image = new Images(fileName);
            this.images.push(image);
        }
        this.timerCount = timerCount;
        this.timerCountDefault = timerCount;
        this.imageIndex = 0;
        this.state = state;
        this.loop = loop;
    }

    // This method returns the state that the character should be in for this animation to play
    isFor(state) {
        return this.state === state;
    }

    // This will reset the animation to it's 1st frame
    reset() {
        this.imageIndex = 0;
    }

    // call method to set image, then this emthod returns that image
    getImage() {
        this.setImageIndex();
        return this.images[this.imageIndex];
    }

    // This method counts down every time it is called and after reaching a set number, it will set the image index to the next image in the array, 
    // and if it is the last image in the array, it will reset the image index to 0 unless the animation is set not to loop, then it stays on the alst frame
    setImageIndex() {
        this.timerCount--;
        if (this.timerCount == 0) {
            this.timerCount = this.timerCountDefault;
            this.imageIndex++;
            if (this.imageIndex >= this.images.length) {
                if(this.loop) {
                    this.imageIndex = 0; 
                }
                else {
                    this.imageIndex = this.images.length - 1;
                }
            }
        }
    }
    
}
export default Animation;