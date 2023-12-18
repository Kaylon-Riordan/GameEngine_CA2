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

    // Define the platform's width and the gap between platforms
    const platformWidth = 480;
    const gap = 320;

    // Create platforms and add them to the game
    const platforms = [
      new Platform(0, this.canvas.height + 15, platformWidth, 20),
      new Platform(platformWidth + gap, this.canvas.height + 15, platformWidth, 20),
      new Platform(2 * (platformWidth + gap), this.canvas.height + 15, platformWidth, 20),
      new Platform(3 * (platformWidth + gap), this.canvas.height + 15, platformWidth, 20),
      new Platform(4 * (platformWidth + gap), this.canvas.height + 15, platformWidth, 20),
      new Platform(5 * (platformWidth + gap), this.canvas.height + 15, platformWidth, 20),
    ];
    for (const platform of platforms) {
      this.addGameObject(platform);
    }
    
    // Create a player object and add it to the game
    const player = new Player(240, this.canvas.height - 200);
    this.addGameObject(player);

    // Set the game's camera target to the player
    this.camera.target = player;

    // Create enemies and add them to the game
    this.addGameObject(new Enemy((platformWidth + gap) + 40, this.canvas.height - 200));
    this.addGameObject(new Enemy(2 * (platformWidth + gap) + 40, this.canvas.height - 200));
    this.addGameObject(new Enemy(3 * (platformWidth + gap) + 40, this.canvas.height - 200));
    this.addGameObject(new Enemy(4 * (platformWidth + gap) + 40, this.canvas.height - 200));
    this.addGameObject(new Enemy(5 * (platformWidth + gap) + 40, this.canvas.height - 200));

    // Create collectibles and add them to the game
    this.addGameObject(new Collectible((platformWidth + gap) + 240, this.canvas.height - 150, 20, 20));
    this.addGameObject(new Collectible(2 * (platformWidth + gap) + 240, this.canvas.height - 150, 20, 20));
    this.addGameObject(new Collectible(3 * (platformWidth + gap) + 240, this.canvas.height - 150, 20, 20));
    this.addGameObject(new Collectible(4 * (platformWidth + gap) + 240, this.canvas.height - 150, 20, 20));
    this.addGameObject(new Collectible(5 * (platformWidth + gap) + 240, this.canvas.height - 150, 20, 20));

    // Add the player UI object to the game
    this.addGameObject(new PlayerUI(10, 10));

    this.sounds = new Sounds();
    this.sounds.playSound('music', true);
  }
  
}

// Export the Level class as the default export of this module
export default Level;