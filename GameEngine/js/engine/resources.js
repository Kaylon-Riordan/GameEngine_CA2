// Create an Images object to hold the Image instances for the player and the enemy.
const Images = {
  player: new Image(), // The Image instance for the player.
  enemy: new Image(), // The Image instance for the enemy.
};

// Create an AudioFiles object to hold the file paths of the audio resources.
const AudioFiles = {
  jump: new Audio(), // The Audio instance for the jump sound.
  collect: new Audio(), // The Audio instance for the collect sound.
};

// Set the source of the player image.
Images.player.src = './resources/images/player/player.png'; // Update the image path

// Set the source of the enemy image.
Images.enemy.src = './resources/images/enemy/enemy.png'; // Update the image path

AudioFiles.jump.src = './resources/sounds/jump.mp3'; // The file path of the jump sound.
AudioFiles.collect.src = './resources/sounds/collect.mp3'; // The file path of the collect sound.


// Export the Images and AudioFiles objects so they can be imported and used in other modules.
export { Images, AudioFiles };