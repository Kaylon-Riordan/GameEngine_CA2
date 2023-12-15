// Importing necessary components and resources
import GameObject from '../engine/gameobject.js';
import Renderer from '../engine/renderer.js';
import Physics from '../engine/physics.js';
import Input from '../engine/input.js';
import Sound from '../engine/sounds.js';
import Enemy from './enemy.js';
import Platform from './platform.js';
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
    this.renderer = new Renderer('blue', 75, 75, new Images('player/idle/tile001')); // Add renderer
    this.addComponent(this.renderer);
    this.addComponent(new Physics({ x: 0, y: 0 }, { x: 0, y: 0 })); // Add physics
    this.addComponent(new Input()); // Add input for handling user input
    this.addComponent(new Sound());
    // Initialize all the player specific properties
    this.direction = 1;
    this.lives = 3;
    this.score = 0;
    this.isOnPlatform = false;
    this.isJumping = false;
    this.jumpForce = 400;
    this.jumpTime = 0.3;
    this.jumpTimer = 0;
    this.isInvulnerable = false;
    this.isGamepadMovement = false;
    this.isGamepadJump = false;
    this.isDead = false;
    this.state = CharacterStates.idle;
    this.#createAnimations();
  }

  // The update function runs every frame and contains game logic
  update(deltaTime) {
    const physics = this.getComponent(Physics); // Get physics component
    const input = this.getComponent(Input); // Get input component
    const sound = this.getComponent(Sound);

    this.handleGamepadInput(input);
    this.renderer.image = this.animations.find((animation) => animation.isFor(this.state)).getImage();
    
    // Handle player movement
    if (!this.isGamepadMovement && input.isKeyDown('KeyD')) {
      physics.velocity.x = 100;
      this.direction = -1;
    } else if (!this.isGamepadMovement && input.isKeyDown('KeyA')) {
      physics.velocity.x = -100;
      this.direction = 1;
    } else if (!this.isGamepadMovement) {
      physics.velocity.x = 0;
    }

    // Handle player sprinting
    if (input.isKeyDown('ShiftLeft')) {
      physics.velocity.x *= 2;
    }

    // Handle player jumping
    if (!this.isGamepadJump && input.isKeyDown('Space') && this.isOnPlatform) {
      this.startJump();
      sound.playSound('jump');
    }

    if (this.isJumping) {
      this.updateJump(deltaTime);
    }

    // Handle collisions with collectibles
    const collectibles = this.game.gameObjects.filter((obj) => obj instanceof Collectible);
    for (const collectible of collectibles) {
      if (physics.isColliding(collectible.getComponent(Physics))) {
        this.collect(collectible);
        this.game.removeGameObject(collectible);
        sound.playSound('collect');
      }
    }
  
    // Handle collisions with enemies
    const enemies = this.game.gameObjects.filter((obj) => obj instanceof Enemy);
    for (const enemy of enemies) {
      if (physics.isColliding(enemy.getComponent(Physics))) {
        this.collidedWithEnemy();
      }
    }
  
    // Handle collisions with platforms
    this.isOnPlatform = false;  // Reset this before checking collisions with platforms
    const platforms = this.game.gameObjects.filter((obj) => obj instanceof Platform);
    for (const platform of platforms) {
      if (physics.isColliding(platform.getComponent(Physics))) {
        if (!this.isJumping) {
          physics.velocity.y = 0;
          physics.acceleration.y = 0;
          this.y = platform.y - this.renderer.height;
          this.isOnPlatform = true;
        }
      }
    }
  
    // Check if player has fallen off the bottom of the screen
    if (this.y > this.game.canvas.height) {
      this.resetPlayerState();
    }

    // Check if player has no lives left
    if (this.lives <= 0 ) {
      this.isDead = true;
      //location.reload();
    }

    // Check if player has collected all collectibles
    if (this.score >= 3) {
      console.log('You win!');
      //location.reload();d
    }

    super.update(deltaTime);

    // Set state for animations
    if (this.isDead) {
      this.state = CharacterStates.die;
    } else if (this.isInvulnerable) {
      this.state = CharacterStates.hurt;
    } else if (!this.isOnPlatform) {
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

  #createAnimations() {
    this.idleAnimation = new Animation("player/idle/tile00?",6,6,CharacterStates.idle);
    this.walkAnimation = new Animation("player/walk/tile00?",9,6,CharacterStates.walk);
    this.runAnimation = new Animation("player/run/tile00?",8,6,CharacterStates.run);
    this.jumpAnimation = new Animation("player/jump/tile00?",6,10,CharacterStates.jump,false);
    this.attackAnimation = new Animation("player/attack/tile00?",5,6,CharacterStates.attack);
    this.hurtAnimation = new Animation("player/hurt/tile00?",3,6,CharacterStates.hurt);
    this.dieAnimation = new Animation("player/die/tile00?",6,6,CharacterStates.die,false);
    this.animations = [ this.idleAnimation, this.walkAnimation, this.runAnimation, this.jumpAnimation, this.attackAnimation, this.hurtAnimation, this.dieAnimation ];
  }
  

  handleGamepadInput(input){
    const gamepad = input.getGamepad(); // Get the gamepad input
    const physics = this.getComponent(Physics); // Get physics component
    if (gamepad) {
      // Reset the gamepad flags
      this.isGamepadMovement = false;
      this.isGamepadJump = false;

      // Handle movement
      const horizontalAxis = gamepad.axes[0];
      // Move right
      if (horizontalAxis > 0.1) {
        this.isGamepadMovement = true;
        physics.velocity.x = 100;
        this.direction = -1;
      } 
      // Move left
      else if (horizontalAxis < -0.1) {
        this.isGamepadMovement = true;
        physics.velocity.x = -100;
        this.direction = 1;
      } 
      // Stop
      else {
        physics.velocity.x = 0;
      }
      
      // Handle jump, using gamepad button 0 (typically the 'A' button on most gamepads)
      if (input.isGamepadButtonDown(0) && this.isOnPlatform) {
        this.isGamepadJump = true;
        this.startJump();
      }
    }
  }

  startJump() {
    // Initiate a jump if the player is on a platform
    if (this.isOnPlatform) { 
      this.isJumping = true;
      this.jumpTimer = this.jumpTime;
      this.getComponent(Physics).velocity.y = -this.jumpForce;
      this.isOnPlatform = false;
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
    // Checks collision with an enemy and reduce player's life if not invulnerable
    if (!this.isInvulnerable) {
      this.lives--;
      this.isInvulnerable = true;
      // Make player vulnerable again after 2 seconds
      setTimeout(() => {
        this.isInvulnerable = false;
      }, 2000);
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
    // Reset the player's state, repositioning it and nullifying movement
    this.x = this.game.canvas.width / 2;
    this.y = this.game.canvas.height / 2;
    this.getComponent(Physics).velocity = { x: 0, y: 0 };
    this.getComponent(Physics).acceleration = { x: 0, y: 0 };
    this.direction = 1;
    this.isOnPlatform = false;
    this.isJumping = false;
    this.jumpTimer = 0;
  }

  resetGame() {
    // Reset the game state, which includes the player's state
    this.lives = 3;
    this.score = 0;
    this.resetPlayerState();
  }
}

export default Player;
