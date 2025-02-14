const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 700,
    width: 30,
    height: 50,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpStrength: -12,
    isJumping: false,
    targetX: null, // property for smooth movement
    moveSpeed: 20, // Speed of movement per frame
    visible: true
};


  const playerImage = new Image();
  playerImage.src = "nomnom.jpg";

  const CarolineMe = {
    x: 700,
    y: 150,
    height: 100,
    width: 100,
    visible: true
  };

  const CarolineMeImage = new Image();
  CarolineMeImage.src = "CarolineMe.jpg";

  const TogetherBubble = {
    x: 700,
    y: 150,
    height: 100,
    width: 100,
    visible: false
  };

  const TogetherBubbleImage = new Image();
  TogetherBubbleImage.src = "bubbletogether.jpg";

  const rocket = {
    x: player.x + player.width /2, 
    y: 750, // Starts under the player
    width: 41, // Adjust as needed
    height: 100, // Adjust as needed
    visible: false 
  };

  const rocketImage = new Image();
  rocketImage.src = "Jinx Ult.png";

  const explosion = {
    x: 0,
    y: 0,
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    visible: false
  };

  const explosionImage = new Image();
  explosionImage.src = "explosion.png";

  const boxbox =[
    { x: 700, y: 550, width: 50, height: 50, visible: false, enable: true},
    { x: 650, y: 50, width: 50, height: 50, visible: false, enable: true},
    { x: 420, y: 200, width: 50, height: 50, visible: false, enable: true},
    { x: 300, y: 70, width: 50, height: 50, visible: false, enable: true},
    { x: 600, y: 700, width: 50, height: 50, visible: false, enable: true},
    { x: 530, y: 300, width: 50, height: 50, visible: false, enable: true}  
  ];

  const boxboxImage = new Image();
  boxboxImage.src = "boxboxbox.png"

  const platforms = [
    { x: 0, y: 750, width: 800, height: 50},
    { x: 50, y: 550, width: 80, height: 50},  
    { x: 450, y: 600, width: 300, height: 50},  
    { x: 700, y: 500, width: 80, height: 50},  
    { x: 520, y: 350, width: 150, height: 50},  
    { x: 260, y: 520, width: 70, height: 50},  
    { x: 10, y: 370, width: 20, height: 50},  
    { x: 400, y: 250, width: 200, height: 50},  
    { x: 300, y: 120, width: 170, height: 50},  
    { x: 650, y: 100, width: 150, height: 50},  
    { x: 650, y: 0, width: 150, height: 50},  
    { x: 50, y: 50, width: 90, height: 50}
  ];

  const platformTile = new Image();
  platformTile.src = "platform.jpg";

  const goal = {
    x: 750,
    y: 50,
    width: 50,
    height: 50
  }

  const keys = {}; // Track which keys are pressed

  document.addEventListener('keydown', (e) => {
      keys[e.key.toLowerCase()] = true; // Store key state
  
      if (keys['d']) player.dx = 5;
      if (keys['a']) player.dx = -5;
      if (keys['w'] && !player.isJumping) {
          player.dy = player.jumpStrength;
          player.isJumping = true;
      }
  });
  
  document.addEventListener('keyup', (e) => {
      keys[e.key.toLowerCase()] = false; // Remove key from tracking
  
      if (!keys['d'] && !keys['a']) player.dx = 0; // Stop movement only if neither key is held
  });

  function updatePlayer() {
    if (player.visible){
      player.dy += player.gravity;
      player.x += player.dx;
      player.y += player.dy;

      // Smooth movement towards targetX *only* when needed after rocket hit
      if (player.targetX !== null && player.x > player.targetX) {
          player.x -= Math.min(player.moveSpeed, player.x - player.targetX);

          // If player reaches targetX, allow normal movement again
          if (player.x <= player.targetX) {
              player.targetX = null; // Reset targetX after reaching it
          }
      }

      // Prevent the player from leaving the canvas horizontally
      if (player.x < 0) {
        player.x = 0;
      } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
      }
    
      let onPlatform = false;
    
      // Check player collision with platforms
      platforms.forEach(platform => {
        const isWithinXRange = player.x + player.width > platform.x && player.x < platform.x + platform.width;
        const isTouchingPlatform = player.y + player.height >= platform.y && player.y + player.height <= platform.y + platform.height;
    
        if (isWithinXRange && isTouchingPlatform) {
          player.y = platform.y - player.height; // Snap to platform top
          player.dy = 0; // Stop vertical movement
          player.isJumping = false; // Allow jumping again
          onPlatform = true;
        }
      });

      // Check player collision with shaco boxes
      boxbox.forEach(box => {
        const isWithinXRange = player.x + player.width > box.x && player.x < box.x + box.width;
        const isTouchingBox = player.y + player.height >= box.y && player.y + player.height <= box.y + box.height;
    
        if (isWithinXRange && isTouchingBox && box.enable) {
          player.dy = 0; // Stop vertical movement
          player.isJumping = false; // Allow jumping again
          // Move player left without going off-screen
          player.targetX = Math.max(0, player.x - 50);
          
        }
      });

      // Check player collision with bubble
      const isWithinXRange = player.x + player.width > CarolineMe.x && player.x < CarolineMe.x + CarolineMe.width;
      const isTouchingCarolineMe = player.y + player.height >= CarolineMe.y && player.y + player.height <= CarolineMe.y + CarolineMe.height;

      if (isWithinXRange && isTouchingCarolineMe) {
        player.y = CarolineMe.y + CarolineMe.height ; // prevent from snapping to top
        player.dy = 0; // Stop vertical movement
        player.isJumping = false; // Allow jumping again
      }
    
    
      // If the player is not on any platform, they are falling
      if (!onPlatform) {
        player.isJumping = true;
      }
    
      // Prevent falling off the canvas bottom
      if (player.y > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.isJumping = false;
      }

      // Rocket movement logic
      if (rocket.visible) {
        rocket.y -= 10; // Move up at 5 pixels per frame

        // Check for collision with player
        const isRocketCollidingWithPlayer = 
            player.x + player.width > rocket.x &&
            player.x < rocket.x + rocket.width &&
            player.y + player.height > rocket.y &&
            player.y < rocket.y + rocket.height;

        if (isRocketCollidingWithPlayer) {
            // Move player left without going off-screen
            player.targetX = Math.max(0, player.x - 150);
            
            // Show explosion at rocket's position
            explosion.x = rocket.x - 27;
            explosion.y = rocket.y - 55;
            explosion.visible = true;

            // Hide rocket
            rocket.visible = false;

            // Remove explosion after 1 second
            setTimeout(() => {
                explosion.visible = false;
            }, 500);
        }

        // Check for collision with Bubble
        const isRocketCollidingWithBubble = 
            CarolineMe.x + CarolineMe.width > rocket.x &&
            CarolineMe.x < rocket.x + rocket.width &&
            CarolineMe.y + CarolineMe.height > rocket.y &&
            CarolineMe.y < rocket.y + rocket.height;

        if (isRocketCollidingWithBubble) {
            // Show explosion at rocket's position
            explosion.x = rocket.x - 27;
            explosion.y = rocket.y - 25;
            explosion.visible = true;

            // Hide rocket
            rocket.visible = false;

            // Remove explosion after 1 second
            setTimeout(() => {
                explosion.visible = false;
            }, 500);
        }

        // Make the rocket disappear once it leaves the canvas
        if (rocket.y + rocket.height < 0) {
            rocket.visible = false;
        }
        }

        // Check for goal
        const isGoalColliding = 
            player.x + player.width > goal.x &&
            player.x < goal.x + goal.width &&
            player.y + player.height > goal.y &&
            player.y < goal.y + goal.height;

        if (isGoalColliding){
            CarolineMe.visible = false;
            TogetherBubble.visible = true;
            player.visible = false;
        }

      }
    }
  
  
  

  function draw() {
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    
      // Draw sprites
      if (player.visible){
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
      }
      if (CarolineMe.visible){
        ctx.drawImage(CarolineMeImage, CarolineMe.x, CarolineMe.y, CarolineMe.width, CarolineMe.height);
      }
      if (TogetherBubble.visible){
        ctx.drawImage(TogetherBubbleImage, TogetherBubble.x, TogetherBubble.y, TogetherBubble.width, TogetherBubble.height);
      }


      // Draw platforms with 50x50 tiles
      const tileSize = 50;
      platforms.forEach(platform => {
        const columns = Math.ceil(platform.width / tileSize);
        const rows = Math.ceil(platform.height / tileSize);
        for (let i = 0; i < columns; i++) {
          for (let j = 0; j < rows; j++) {
            ctx.drawImage(platformTile,
              platform.x + i * tileSize,
              platform.y + j * tileSize,
              tileSize,
              tileSize
            );
          }
        }
      });

      //Draw ShacoBoxes
      boxbox.forEach(box =>{
        if(box.visible){ctx.drawImage(boxboxImage, box.x, box.y, box.width, box.height)};
      })

      // Draw Rocket if visible
      if (rocket.visible) {
        ctx.drawImage(rocketImage, rocket.x, rocket.y, rocket.width, rocket.height);
      }
      // Draw explosion if visible
      if (explosion.visible) {
        ctx.drawImage(explosionImage, explosion.x, explosion.y, explosion.width, explosion.height);
      } 

    }
  


  function spawnRocket() {
    if (!rocket.visible){
      rocket.x = player.x - 12; // Reset x position
      rocket.y = 800; // Place under player
      rocket.visible = true; 
      }
    }  
  
  setInterval(spawnRocket, 5000); // Call spawnRocket every 5 seconds


  
  function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);
  }
  
  
  gameLoop();