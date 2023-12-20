// This class is based off code from the following video: https://www.youtube.com/watch?v=yTlmOpW6kOc&t=374s
// This class takes in text whcih is part of the file path to the image. Then it creates an image object, sets the source using the rest fo the file apth structure and returns the iamge.
class Images {
  constructor(source) {
    const image = new Image();
    image.src = './resources/images/' + source + '.png'; // Initialize the source.
    return image;
  }
}
export default Images;