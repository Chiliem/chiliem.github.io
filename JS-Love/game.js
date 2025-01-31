const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    color: 'red',
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpStrength: -10,
    isJumping: false
  };
  
  const platforms = [
    { x: 0, y: 750, width: 800, height: 50, color: 'green' }
  ];

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') player.dx = 5;
    if (e.key === 'ArrowLeft') player.dx = -5;
    if (e.key === 'ArrowUp' && !player.isJumping) {
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
  
    let onPlatform = false;
  
    // Check collision with platforms
    platforms.forEach(platform => {
      const isWithinXRange = player.x + player.width > platform.x && player.x < platform.x + platform.width;
      const isTouchingPlatform = player.y + player.height >= platform.y && player.y + player.height <= platform.y + 50;
  
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  
    // Draw platforms
    platforms.forEach(platform => {
      ctx.fillStyle = platform.color;
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
  }

  function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop();