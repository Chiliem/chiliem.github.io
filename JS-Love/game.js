const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 700,
    width: 22,
    height: 50,
    color: 'red',
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpStrength: -12,
    isJumping: false
  };

  const playerImage = new Image();
  playerImage.src = "nomnom.jpg";
  
  const platformTile = new Image();
  platformTile.src = "platform.jpg";

  const platforms = [
    { x: 0, y: 750, width: 800, height: 50, color: 'green' },
    { x: 50, y: 550, width: 80, height: 50, color: 'green' },  
    { x: 450, y: 600, width: 300, height: 50, color: 'green'},  
    { x: 700, y: 500, width: 80, height: 50, color: 'green'},  
    { x: 520, y: 350, width: 150, height: 50, color: 'green'},  
    { x: 260, y: 520, width: 70, height: 50, color: 'green'},  
    { x: 10, y: 370, width: 20, height: 50, color: 'green'},  
    { x: 400, y: 250, width: 200, height: 50, color: 'green'},  
    { x: 300, y: 120, width: 250, height: 50, color: 'green'},  
    { x: 650, y: 100, width: 120, height: 50, color: 'green'},  
    { x: 50, y: 130, width: 90, height: 50, color: 'green'},  

  ];

  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'd') player.dx = 5;
    if (key === 'a') player.dx = -5;
    if (key === 'w' && !player.isJumping) {
      player.dy = player.jumpStrength;
      player.isJumping = true;
    }
  });
  

  document.addEventListener('keyup', () => {
    player.dx = 0;
  });

  function updatePlayer() {
    player.dy += player.gravity; // Apply gravity
    player.x += player.dx; // Update horizontal position
    player.y += player.dy; // Update vertical position

    // Prevent the player from leaving the canvas horizontally
    if (player.x < 0) {
      player.x = 0;
    } else if (player.x + player.width > canvas.width) {
      player.x = canvas.width - player.width;
    }
  
    let onPlatform = false;
  
    // Check collision with platforms
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
  }
  
  

  function draw() {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw player
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
  
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
  }

  function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop();