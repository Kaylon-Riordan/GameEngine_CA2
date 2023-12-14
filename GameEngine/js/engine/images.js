class Images {
  constructor(source) {
    const image = new Image();
    image.src = './resources/images/' + source + '.png'; // Initialize the source.
    return image;
  }
}
export default Images;