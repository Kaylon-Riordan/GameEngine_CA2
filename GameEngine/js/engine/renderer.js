// Import the required modules and classes.
import Platform from '../game/platform.js';
import Component from './component.js';

// The Renderer class extends Component and handles the visual representation of a game object.
class Renderer extends Component {
  // The constructor initializes the renderer component with optional color, width, height, and image.
  constructor(color = 'white', width = 50, height = 50, image = null, offset = 75) {
    super(); // Call the parent constructor.
    this.color = color; // Initialize the color.
    this.width = width; // Initialize the width.
    this.height = height; // Initialize the height.
    this.image = image; // Initialize the image.
    this.offset = offset; // Initialize the offset.
  }

  // The draw method handles rendering the game object on the canvas.
  draw(ctx) {
    // If an image is provided and it has finished loading, draw the image.
    if (this.image && this.image.complete) {
      // Get the position of the game object.
      const x = this.gameObject.x;
      let y = this.gameObject.y + (this.offset  - this.image.naturalHeight); // Offset the image by the offset property, which is the value each gameObject needs to display properly at ground level, i haven't found what causes diffenet gameObject's to require different calues, the player and enemies need 75 but platforms need 512.
      // Set the natural width and height of the source image to be the width and height that will be rendered.
      const w = this.image.naturalWidth;
      const h = this.image.naturalHeight;
      // Check if the image should be flipped horizontally based on the direction of the game object.
      const flipX = this.gameObject.direction === -1; // 1 is right, -1 is left.
      if (!flipX) {
        // If the image should not be flipped, draw it as is.
        ctx.drawImage(this.image, x, y, w, h);
      } else {
        // If the image should be flipped, save the current drawing state,
        // translate and scale the drawing context to flip the image,
        // draw the image, and then restore the drawing state.
        ctx.save();
        ctx.translate(x + w, y);
        ctx.scale(-1, 1);
        ctx.drawImage(this.image, 0, 0, w, h);
        ctx.restore();
      }
    } else {
      // If no image is provided or it has not finished loading, draw a rectangle with the specified color.
      ctx.fillStyle = this.color;
      ctx.fillRect(this.gameObject.x, this.gameObject.y, this.width, this.height);
    }
  }
}

// The Renderer class is then exported as the default export of this module.
export default Renderer;
