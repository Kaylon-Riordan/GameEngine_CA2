// Import necessary classes and resources
import Game from '../engine/game.js';
import Player from './player.js';
import Enemy from './enemy.js';
import PlayerUI from './playerUI.js';
import Platform from './platform.js';
import Collectible from './collectible.js';
import Sounds from '../engine/sounds.js';

// Define a class Level that extends the Game class from the engine
class Level extends Game {
  
  // Define the constructor for this class, which takes one argument for the canvas ID
  constructor(canvasId) {
    // Call the constructor of the superclass (Game) with the canvas ID
    super(canvasId);

    // Create a player object and add it to the game
    const player = new Player(240, this.canvas.height - 600);
    this.addGameObject(player);
    this.player = player;
    this.player.level = this;
    
    // Set the game's camera target to the player
    this.camera.target = player;

    // Add the player UI object to the game
    this.addGameObject(new PlayerUI(10, 10));

    // Play the games background music
    this.sounds = new Sounds();
    this.sounds.playSound('music', true);

    // Create a number of towers varaible usid in the update
    let towers = 0;
    this.towers = towers;
  }
  update() {
    // Call the update method of the superclass (Game)
    super.update();
    // Set platform width and gap width varaibles
    const platformWidth = 480;
    const gap = 320;
    // This if statement will create a platform, enemy, and coin right off screen and will do so infinitly as long as the player keeps moving right
    // It does this by checking if the player's x position is greater than or equal to the x position the second newest platform starts at
    if((this.player.x) >= ((this.towers - 2) * (platformWidth + gap))) {
      // Create a random number between 1 and 140 to change the height of the platforms and the x position of the coin, 1 to 140 was chosen becuase it is near the max value where the player can jump from lowest to heighest possible platforms
      let rand = Math.floor((Math.random() * 140) + 1);
      this.addGameObject(new Platform(this.towers * (platformWidth + gap), this.canvas.height + 60 - rand, platformWidth, 600));
      this.addGameObject(new Collectible(this.towers * (platformWidth + gap) + 150 + rand, this.canvas.height - 75 - rand, 20, 20));
      this.addGameObject(new Enemy(this.towers * (platformWidth + gap) + 300, this.canvas.height - 150 - rand));
      this.towers++;
    }
  }
}

// Export the Level class as the default export of this module
export default Level;