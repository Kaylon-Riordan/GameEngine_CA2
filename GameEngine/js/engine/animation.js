import Component from './component.js';
import Images from './images.js';

class Animation extends Component { 
    images = [];
    constructor(fileNameTemplate, numberOfImages, timerCount, state, loop = true) {
        super();
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

    isFor(state) {
        return this.state === state;
    }

    reset() {
        this.imageIndex = 0;
    }

    getImage() {
        this.#setImageIndex();
        return this.images[this.imageIndex];
    }

    #setImageIndex() {
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