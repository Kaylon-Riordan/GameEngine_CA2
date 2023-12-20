// Import the GameObject class from the 'engine' directory
import GameObject from '../engine/gameobject.js';

// Import the Renderer class from the 'engine' directory
import Renderer from '../engine/renderer.js';

// Import the Physics class from the 'engine' directory
import Physics from '../engine/physics.js';

// Import the Images object from the 'engine' directory. This object contains all the game's image resources
import Images from '../engine/images.js';

// Import the Player and Platform classes from the current directory
import Player from './player.js';

// Import the CharacterStates object from the current directory
import CharacterStates from './characterStates.js';

// Import the Animation class from the 'engine' directory
import Animation from '../engine/animation.js';

// Define a new class, Enemy, which extends (i.e., inherits from) GameObject
class Enemy extends GameObject {

  // Define the constructor for this class, which takes two arguments for the x and y coordinates
  constructor(x, y) {
    // Call the constructor of the superclass (GameObject) with the x and y coordinates
    super(x, y);
    
    // Add a Renderer component to this enemy, responsible for rendering it in the game.
    // The renderer uses the color 'red', dimensions 30x70, sends an image resource to the renderer, and is set to be animated
    this.renderer = new Renderer('red', 30, 70, new Images('enemy/idle/tile000'), true); // Add renderer
    this.addComponent(this.renderer);
    // Add a Physics component to this enemy, responsible for managing its physical interactions
    // Sets the initial velocity and acceleration
    this.addComponent(new Physics({ x: 0, y: 0 }, { x: 0, y: 0 }));
    
    // Initialize variables related to enemy's movement and animation
    this.movementDistance = 0;
    this.movementLimit = 1;
    this.movingRight = true;
    this.createAnimations();
    this.state = CharacterStates.idle;
    this.isAttacking = false;
  }

  // Define an update method that will run every frame of the game. It takes deltaTime as an argument
  // which represents the time passed since the last frame
  update(deltaTime) {
    // Get the Physics component of this enemy
    const physics = this.getComponent(Physics);

    // Check if the enemy is moving to the right
    if (this.movingRight) {
      // If it hasn't reached its movement limit, make it move right
      if (this.movementDistance < this.movementLimit) {
        physics.velocity.x = 2;
        this.movementDistance += Math.abs(physics.velocity.x) * deltaTime;
        this.getComponent(Renderer).gameObject.direction = 1;
      } else {
        // If it reached the limit, make it move left after standing still for a shoort time
        physics.velocity.x = 0;
        setTimeout(() => {
          this.movingRight = false;
          this.movementDistance = 0;
        }, 1000);
      }
    } else {
      // If it hasn't reached its movement limit, make it move left
      if (this.movementDistance < this.movementLimit) {
        physics.velocity.x = -2;
        this.movementDistance += Math.abs(physics.velocity.x) * deltaTime;
        this.getComponent(Renderer).gameObject.direction = -1;
      } else {
        // If it reached the limit, make it move right after standing still for a shoort time
        physics.velocity.x = 0;
        setTimeout(() => {
          this.movingRight = true;
          this.movementDistance = 0;
        }, 1000);
      }
    }

    // Check if the enemy is colliding with the player
    const player = this.game.gameObjects.find(obj => obj instanceof Player);
    if (physics.isColliding(player.getComponent(Physics))) {
      player.collidedWithEnemy();
      //change to the attack animaion if the enemy touches the palyer
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 1000);
    }

    // Call the update method of the superclass (GameObject), passing along deltaTime
    super.update(deltaTime);

    // Check what the enemy is doing to correctly set its state
    if (this.isAttacking) {
      this.state = CharacterStates.attack;
    } else if (physics.velocity.x !== 0) {
      this.state = CharacterStates.walk;
    } else {
      this.state = CharacterStates.idle;
    }

    // Set the image of the renderer to the correct image for the current state's aniamtion
    this.renderer.image = this.animations.find((animation) => animation.isFor(this.state)).getImage();
  }

  // Define a method to create the animations for this enemy
  createAnimations() {
    this.idleAnimation = new Animation("enemy/idle/tile00?",7,12,CharacterStates.idle);
    this.walkAnimation = new Animation("enemy/walk/tile00?",7,12,CharacterStates.walk);
    this.attackAnimation = new Animation("enemy/attack/tile00?",4 ,12,CharacterStates.attack);
    this.animations = [ this.idleAnimation, this.walkAnimation, this.attackAnimation ];
  }
}

// Export the Enemy class as the default export of this module
export default Enemy;
