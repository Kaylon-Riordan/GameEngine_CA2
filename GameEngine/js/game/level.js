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

    this.sounds = new Sounds();
    this.sounds.playSound('music', true);

    let towers = 0;
    this.towers = towers;
  }
  update() {
    const platformWidth = 480;
    const gap = 320;
    super.update();
    if((this.player.x) >= ((this.towers - 2) * (platformWidth + gap))) {
      let rand = Math.floor((Math.random() * 140) + 1);
      this.addGameObject(new Platform(this.towers * (platformWidth + gap), this.canvas.height + 60 - rand, platformWidth, 20));
      this.addGameObject(new Collectible(this.towers * (platformWidth + gap) + 150 + rand, this.canvas.height - 150 - rand, 20, 20));
      this.addGameObject(new Enemy(this.towers * (platformWidth + gap) + 70, this.canvas.height - 150 - rand));
      this.towers++;
    }
  }
}

// Export the Level class as the default export of this module
export default Level;