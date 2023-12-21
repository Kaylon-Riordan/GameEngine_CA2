// Importing necessary components and resources
import GameObject from '../engine/gameobject.js';
import Renderer from '../engine/renderer.js';
import Physics from '../engine/physics.js';
import Input from '../engine/input.js';
import Sound from '../engine/sounds.js';
import Enemy from './enemy.js';
import Collectible from './collectible.js';
import ParticleSystem from '../engine/particleSystem.js';
import CharacterStates from './characterStates.js';
import Animation from '../engine/animation.js';
import Images from '../engine/images.js';

// Defining a class Player that extends GameObject
class Player extends GameObject {
  // Constructor initializes the game object and add necessary components
  constructor(x, y) {
    super(x, y); // Call parent's constructor
    this.renderer = new Renderer('blue', 30, 70, new Images('player/idle/tile000'), true); // Add renderer
    this.addComponent(this.renderer);
    this.addComponent(new Physics({ x: 0, y: 0 }, { x: 0, y: 0 })); // Add physics
    this.addComponent(new Input()); // Add input for handling user input
    this.addComponent(new Sound());
    // Initialize all the player specific properties
    this.direction = 1;
    this.lives = 3;
    this.score = 0;
    this.isJumping = false;
    this.jumpForce = 3;
    this.jumpTime = 0.3;
    this.jumpTimer = 0;
    this.isInvulnerable = false;
    this.isDead = false;
    this.state = CharacterStates.idle;
    this.createAnimations();
  }

  // The update function runs every frame and contains game logic
  update(deltaTime) {
    const physics = this.getComponent(Physics); // Get physics component
    const input = this.getComponent(Input); // Get input component
    const sound = this.getComponent(Sound); // Get sound component
    this.renderer.image = this.animations.find((animation) => animation.isFor(this.state)).getImage(); // Set the image of the renderer to the current animation frame

    if(!this.isDead) {
    // Handle player movement
      if (input.isKeyDown('KeyD')) {
        physics.velocity.x = 2;
        this.direction = 1;
      } else if (input.isKeyDown('KeyA')) {
        physics.velocity.x = -2;
        this.direction = -1;
      } else {
        physics.velocity.x = 0;
      }

      // Handle player sprinting
      if (input.isKeyDown('ShiftLeft')) {
        physics.velocity.x *= 2; // Double the player's velocity
      }

      // Handle player jumping
      if (input.isKeyDown('Space') && physics.isOnPlatform) {
        this.startJump();
        sound.playSound('jump'); // Play jump sound using sound class
      }

      if (this.isJumping) {
        this.updateJump(deltaTime);
      }
    }
    else {
      physics.velocity.x = 0; // Stop player movement after death
    }

    // Handle collisions with collectibles
    const collectibles = this.game.gameObjects.filter((obj) => obj instanceof Collectible);
    for (const collectible of collectibles) {
      if (physics.isColliding(collectible.getComponent(Physics))) {
        this.collect(collectible);
        this.game.removeGameObject(collectible);
        sound.playSound('collect'); // Play collect sound using sound class
      }
    }
  
    // Handle collisions with enemies
    const enemies = this.game.gameObjects.filter((obj) => obj instanceof Enemy);
    for (const enemy of enemies) {
      if (physics.isColliding(enemy.getComponent(Physics))) {
        this.collidedWithEnemy();
      }
    }
  
    // Check if player has fallen off the bottom of the screen
    if (this.y > this.game.canvas.height) {
      this.resetPlayerState();
    }

    // Check if player has no lives left
    if (this.lives <= 0 ) {
      this.isDead = true; // Set player to dead
      setTimeout(() => { // Wait 3 seconds before redirecting to death screen
        window.location.href = 'deathScreen.html';
        alert('Final Score: ' + this.score); // Display final score
      }, 3000);
    }

    super.update(deltaTime);

    // Set state for animations absed on what player is currently doing
    if (this.isDead) {
      this.state = CharacterStates.die;
    } else if (this.isInvulnerable) {
      this.state = CharacterStates.hurt;
    } else if (!physics.isOnPlatform) {
      this.state = CharacterStates.jump;
    } else if (input.isKeyDown('ShiftLeft') && (input.isKeyDown('KeyD') || input.isKeyDown('KeyA'))) {
      this.state = CharacterStates.run;
      this.jumpAnimation.reset();
    } else if (input.isKeyDown('KeyD') || input.isKeyDown('KeyA')) {
      this.state = CharacterStates.walk;
      this.jumpAnimation.reset();
    } else {
      this.state = CharacterStates.idle;
      this.jumpAnimation.reset();
    }
  }

  createAnimations() { // Create animations for player, jump and die don't loop
    this.idleAnimation = new Animation("player/idle/tile00?",6,12,CharacterStates.idle);
    this.walkAnimation = new Animation("player/walk/tile00?",9,12,CharacterStates.walk);
    this.runAnimation = new Animation("player/run/tile00?",8,12,CharacterStates.run);
    this.jumpAnimation = new Animation("player/jump/tile00?",6,12,CharacterStates.jump,false);
    this.hurtAnimation = new Animation("player/hurt/tile00?",3,12,CharacterStates.hurt);
    this.dieAnimation = new Animation("player/die/tile00?",6,12,CharacterStates.die,false);
    this.animations = [ this.idleAnimation, this.walkAnimation, this.runAnimation, this.jumpAnimation, this.hurtAnimation, this.dieAnimation ];
  }

  startJump() {
    const physics = this.getComponent(Physics); // Get physics component
    // Initiate a jump if the player is on a platform
    if (physics.isOnPlatform) { 
      this.isJumping = true;
      this.jumpTimer = this.jumpTime;
      this.getComponent(Physics).velocity.y = -this.jumpForce;
      physics.isOnPlatform = false;
    }
  }
  
  updateJump(deltaTime) {
    // Updates the jump progress over time
    this.jumpTimer -= deltaTime;
    if (this.jumpTimer <= 0 || this.getComponent(Physics).velocity.y > 0) {
      this.isJumping = false;
    }
  }

  collidedWithEnemy() {
    let sound = this.getComponent(Sound);
    // Checks collision with an enemy and reduce player's life if not invulnerable
    if (!this.isInvulnerable) {
      this.lives--;
      this.isInvulnerable = true;
      sound.playSound('hurt'); // Play hurt sound using sound class
      // Make player vulnerable again after 1 second
      setTimeout(() => {
        this.isInvulnerable = false;
      }, 1000);
    }
  }

  collect(collectible) {
    // Handle collectible pickup
    this.score += collectible.value;
    console.log(`Score: ${this.score}`);
    this.emitCollectParticles(collectible);
  }

  emitCollectParticles() {
    // Create a particle system at the player's position when a collectible is collected
    const particleSystem = new ParticleSystem(this.x, this.y, 'yellow', 20, 1, 0.5);
    this.game.addGameObject(particleSystem);
  }

  resetPlayerState() {
    // Reset the player's state, repositioning it to the furthest platform they had reached and nullifying movement
    this.x = ((this.level.towers - 2) * 800) - 580; // Set player's x position to the furthest platform they had reached
    this.y = this.game.canvas.height - 600;
    this.getComponent(Physics).velocity = { x: 0, y: 0 };
    this.getComponent(Physics).acceleration = { x: 0, y: 0 };
    this.direction = 1;
    this.isJumping = false;
    this.jumpTimer = 0;
    this.collidedWithEnemy(); // Make player take damage if they fall off the bottom of the screen
  }
}

export default Player;