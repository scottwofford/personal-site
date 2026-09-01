// Adrian's Maze Game - Level 1
// Created by: Adrian (6 years old)
// Date: January 1, 2026
// Updated: August 31, 2026 - Traps take a life! / ¡Las trampas te quitan una vida!

// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// ============================================
// ❤️ LIVES - Adrian's rule (2026-08-31)
// "Con 10 vidas en el primer nivel, con 5 vidas en el segundo nivel,
//  con tres en el tercer nivel y con una en el cuarto nivel."
// ============================================
const LIVES_BY_LEVEL = [10, 5, 3, 1]; // Level 1, 2, 3, 4
const CURRENT_LEVEL = 1;               // Only Level 1 is built so far
const STARTING_LIVES = LIVES_BY_LEVEL[CURRENT_LEVEL - 1];

// Game Variables
let player1;
let player2;
let platforms;
let lavaTraps;
let waterTraps;
let rockTraps;
let cursors;
let wasd;
let player1Lives = STARTING_LIVES;
let player2Lives = STARTING_LIVES;
let p1LivesText;
let p2LivesText;
let gameOver = false;
let winnerText;
let scene; // Reference to scene for use in functions

// Constants
// Adrian's rule: "las trampas te quitan una vida" - a trap costs ONE life
const TRAP_LIFE_COST = 1;

// Adrian's rule (2026-08-31): "las trampas de roca son unas que te quitan cinco vidas...
// y son para el tercer nivel." One rock trap, and it costs FIVE lives.
const ROCK_TRAP_LIFE_COST = 5;
const ROCK_TRAP_LEVEL = 3;   // where Adrian wants it. Level 3 is not built yet, so for now
                             // the one rock trap lives in the level we can actually play.
const DAMAGE_COOLDOWN = 1500; // after any trap, every trap leaves you alone this long

// Where each player starts, so the water can send them back there
const P1_START = { x: 100, y: 450 };
const P2_START = { x: 150, y: 450 };

// One timer per player: after any trap hits you, every trap leaves you alone
// for DAMAGE_COOLDOWN. Separate timers let traps chain into each other.
let player1LastDamage = 0;
let player2LastDamage = 0;

function preload() {
    // This function will load assets (images, sounds, etc.)
    // For now, we'll use simple shapes
    console.log('🎮 Loading Adrian\'s Maze Game...');
}

function create() {
    // Background
    this.add.rectangle(400, 300, 800, 600, 0x2d3436);

    // Store scene reference (helpers use it)
    scene = this;

    // Title
    this.add.text(400, 30, 'ADRIAN\'S MAZE GAME', {
        fontSize: '32px',
        fill: '#fff',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(400, 65, `Level ${CURRENT_LEVEL}: Race to the Exit! / ¡Corre a la salida!`, {
        fontSize: '18px',
        fill: '#00ff00'
    }).setOrigin(0.5);

    // Create platforms (simple maze)
    platforms = this.physics.add.staticGroup();

    // Ground
    platforms.create(400, 580, null).setDisplaySize(800, 40).setTint(0x8B4513).refreshBody();

    // Simple maze walls for testing
    platforms.create(200, 500, null).setDisplaySize(300, 20).setTint(0x8B4513).refreshBody();
    platforms.create(600, 420, null).setDisplaySize(300, 20).setTint(0x8B4513).refreshBody();
    platforms.create(300, 340, null).setDisplaySize(200, 20).setTint(0x8B4513).refreshBody();
    platforms.create(650, 260, null).setDisplaySize(250, 20).setTint(0x8B4513).refreshBody();
    platforms.create(200, 180, null).setDisplaySize(150, 20).setTint(0x8B4513).refreshBody();

    // Exit (goal)
    this.add.rectangle(750, 140, 40, 40, 0x00ff00);
    this.add.text(750, 140, '🚪', {
        fontSize: '32px'
    }).setOrigin(0.5);

    // ============================================
    // 🔥 TRAPS - every trap costs one life
    // Adrian's rule: you can always SEE the traps ("puedes ver todas las trampas")
    // ============================================
    lavaTraps = this.physics.add.staticGroup();

    // Adrian (2026-08-31): "no pongas demasiado, como solo cuatro" and
    // "por todo el tablero" - four lava traps, spread across the whole board.
    createLavaTrap(this, 450, 550, 60, 20);  // bottom - on the ground
    createLavaTrap(this, 280, 480, 50, 20);  // left - low platform
    createLavaTrap(this, 600, 400, 50, 20);  // right - middle platform
    createLavaTrap(this, 650, 240, 50, 20);  // top - high platform near the exit

    // ============================================
    // 💧 WATER TRAPS - Adrian's rule (2026-08-31):
    // "Trampas de agua, te devuelven al empezar" - water sends you back to the start.
    // The water does NOT take a life, it just sends you back.
    // ============================================
    waterTraps = this.physics.add.staticGroup();

    createWaterTrap(this, 150, 550, 60, 20);  // bottom left - on the ground
    createWaterTrap(this, 330, 320, 50, 20);  // middle platform
    createWaterTrap(this, 710, 400, 50, 20);  // right platform

    // ============================================
    // 🪨 ROCK TRAP - just ONE, and it takes FIVE lives
    // ============================================
    rockTraps = this.physics.add.staticGroup();
    createRockTrap(this, 560, 238, 54, 24);   // high platform, right before the exit

    // Player 1 (Dinosaur 🦖)
    player1 = this.add.text(100, 450, '🦖', {
        fontSize: '60px'
    }).setOrigin(0.5);
    this.physics.add.existing(player1);
    player1.body.setSize(48, 60); // Hitbox size
    player1.body.setBounce(0.2);
    player1.body.setCollideWorldBounds(true);

    // Player 2 (Robot 🤖)
    player2 = this.add.text(150, 450, '🤖', {
        fontSize: '60px'
    }).setOrigin(0.5);
    this.physics.add.existing(player2);
    player2.body.setSize(48, 60); // Hitbox size
    player2.body.setBounce(0.2);
    player2.body.setCollideWorldBounds(true);

    // Collisions
    this.physics.add.collider(player1, platforms);
    this.physics.add.collider(player2, platforms);

    // Lives Display / Marcador de vidas
    this.add.text(20, 100, 'Player 1 (🦖)', {
        fontSize: '16px',
        fill: '#ff0000'
    });

    p1LivesText = this.add.text(20, 125, livesLabel(player1Lives), {
        fontSize: '14px',
        fill: '#fff'
    });

    this.add.text(20, 170, 'Player 2 (🤖)', {
        fontSize: '16px',
        fill: '#0000ff'
    });

    p2LivesText = this.add.text(20, 195, livesLabel(player2Lives), {
        fontSize: '14px',
        fill: '#fff'
    });

    // Trap collisions - stepping in lava costs a life
    this.physics.add.overlap(player1, lavaTraps, hitLava, null, this);
    this.physics.add.overlap(player2, lavaTraps, hitLava, null, this);

    // Water sends you back to where you started
    this.physics.add.overlap(player1, waterTraps, hitWater, null, this);
    this.physics.add.overlap(player2, waterTraps, hitWater, null, this);

    // The rock takes five lives at once
    this.physics.add.overlap(player1, rockTraps, hitRock, null, this);
    this.physics.add.overlap(player2, rockTraps, hitRock, null, this);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    console.log('✅ Game created! Player 1: Arrow Keys | Player 2: WASD');
    console.log(`❤️ Level ${CURRENT_LEVEL}: everybody starts with ${STARTING_LIVES} lives`);
}

function update() {
    // Don't process input if game is over
    if (gameOver) return;

    // Player 1 Controls (Arrow Keys)
    if (cursors.left.isDown) {
        player1.body.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player1.body.setVelocityX(160);
    } else {
        player1.body.setVelocityX(0);
    }

    if (cursors.up.isDown && player1.body.touching.down) {
        player1.body.setVelocityY(-250);
    }

    // Player 2 Controls (WASD)
    if (wasd.left.isDown) {
        player2.body.setVelocityX(-160);
    } else if (wasd.right.isDown) {
        player2.body.setVelocityX(160);
    } else {
        player2.body.setVelocityX(0);
    }

    if (wasd.up.isDown && player2.body.touching.down) {
        player2.body.setVelocityY(-250);
    }

    // Check if player reached exit
    if (player1.x > 730 && player1.y < 160) {
        endGame('🦖 Player 1');
    }

    if (player2.x > 730 && player2.y < 160) {
        endGame('🤖 Player 2');
    }
}

// ============================================
// 🔥 HELPER FUNCTIONS
// ============================================

// Lives label shown on screen / El texto de las vidas
function livesLabel(lives) {
    const safe = Math.max(lives, 0);
    return `Lives / Vidas: ${safe} ${'❤️'.repeat(safe)}`;
}

// Create a lava trap at specified position
function createLavaTrap(scene, x, y, width, height) {
    const lava = scene.add.rectangle(x, y, width, height, 0xff4500); // Orange-red lava
    lavaTraps.add(lava); // Static group gives it a static body sized to the rectangle

    // Add bubbling effect (visual only - the body stays the same size)
    scene.tweens.add({
        targets: lava,
        scaleY: 1.1,
        duration: 300,
        yoyo: true,
        repeat: -1
    });

    // Add lava emoji label
    scene.add.text(x, y - 18, '🔥', {
        fontSize: '18px'
    }).setOrigin(0.5);

    return lava;
}

// Create a water trap at specified position
function createWaterTrap(scene, x, y, width, height) {
    const water = scene.add.rectangle(x, y, width, height, 0x2196f3); // Blue water
    waterTraps.add(water);

    // Wavy effect so it looks like water
    scene.tweens.add({
        targets: water,
        scaleX: 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1
    });

    scene.add.text(x, y - 18, '💧', {
        fontSize: '18px'
    }).setOrigin(0.5);

    return water;
}

// Create the rock trap / Crear la trampa de roca
function createRockTrap(scene, x, y, width, height) {
    const rock = scene.add.rectangle(x, y, width, height, 0x757575); // Grey rock
    rockTraps.add(rock);

    scene.add.text(x, y - 20, '🪨', {
        fontSize: '20px'
    }).setOrigin(0.5);

    // A warning label, because five lives is a lot to lose
    scene.add.text(x, y + 22, '-5 ❤️', {
        fontSize: '13px',
        fill: '#ff8a80',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    return rock;
}

// Player touched the rock trap - lose FIVE lives! / ¡Pierdes cinco vidas!
function hitRock(player, rock) {
    if (gameOver) return;

    const now = Date.now();
    const isPlayer1 = (player === player1);

    if (isPlayer1) {
        if (now - player1LastDamage < DAMAGE_COOLDOWN) return;
        player1LastDamage = now;
    } else {
        if (now - player2LastDamage < DAMAGE_COOLDOWN) return;
        player2LastDamage = now;
    }

    const playerName = isPlayer1 ? '🦖 Player 1' : '🤖 Player 2';

    if (isPlayer1) {
        player1Lives = Math.max(player1Lives - ROCK_TRAP_LIFE_COST, 0);
        p1LivesText.setText(livesLabel(player1Lives));
    } else {
        player2Lives = Math.max(player2Lives - ROCK_TRAP_LIFE_COST, 0);
        p2LivesText.setText(livesLabel(player2Lives));
    }

    const livesLeft = isPlayer1 ? player1Lives : player2Lives;
    console.log(`🪨 ${playerName} hit the ROCK TRAP! -${ROCK_TRAP_LIFE_COST} lives (${livesLeft} left)`);

    showRockMessage(playerName);

    if (livesLeft <= 0) {
        endGame(isPlayer1 ? '🤖 Player 2' : '🦖 Player 1');
        return;
    }

    // Push them clear of the rock, same as the lava
    pushClearOf(player, rock);
}

// Flash a big warning when the rock takes five lives
function showRockMessage(playerName) {
    const message = scene.add.text(400, 480, `🪨 ${playerName}: -5 ❤️ ¡La roca te quitó CINCO vidas!`, {
        fontSize: '20px',
        fill: '#ff8a80',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: message,
        alpha: 0,
        duration: 1800,
        onComplete: () => message.destroy()
    });
}

// Player touched water - go back to the start! / ¡Te regresa al principio!
function hitWater(player, water) {
    if (gameOver) return;

    const now = Date.now();
    const isPlayer1 = (player === player1);

    // Same shared cooldown as the other traps
    if (isPlayer1) {
        if (now - player1LastDamage < DAMAGE_COOLDOWN) return;
        player1LastDamage = now;
    } else {
        if (now - player2LastDamage < DAMAGE_COOLDOWN) return;
        player2LastDamage = now;
    }

    const playerName = isPlayer1 ? '🦖 Player 1' : '🤖 Player 2';
    const start = isPlayer1 ? P1_START : P2_START;

    console.log(`💧 ${playerName} fell in the water! Back to the start.`);

    // Send them back to the beginning - no life lost
    player.setPosition(start.x, start.y);
    player.body.setVelocity(0, 0);

    showWaterMessage(playerName);
}

// Flash a message when the water sends a player back
function showWaterMessage(playerName) {
    const message = scene.add.text(400, 560, `💧 ${playerName}: ¡Al principio otra vez! / Back to the start!`, {
        fontSize: '18px',
        fill: '#4fc3f7',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: message,
        alpha: 0,
        duration: 1500,
        onComplete: () => message.destroy()
    });
}

// Player touched lava - lose ONE life! / ¡Pierdes una vida!
function hitLava(player, lava) {
    if (gameOver) return;

    const now = Date.now();
    const isPlayer1 = (player === player1);

    // Check cooldown - one trap should only cost one life
    if (isPlayer1) {
        if (now - player1LastDamage < DAMAGE_COOLDOWN) return;
        player1LastDamage = now;
    } else {
        if (now - player2LastDamage < DAMAGE_COOLDOWN) return;
        player2LastDamage = now;
    }

    const playerName = isPlayer1 ? '🦖 Player 1' : '🤖 Player 2';

    // Take one life away
    if (isPlayer1) {
        player1Lives -= TRAP_LIFE_COST;
        p1LivesText.setText(livesLabel(player1Lives));
    } else {
        player2Lives -= TRAP_LIFE_COST;
        p2LivesText.setText(livesLabel(player2Lives));
    }

    const livesLeft = isPlayer1 ? player1Lives : player2Lives;
    console.log(`🔥 ${playerName} fell in a trap! -${TRAP_LIFE_COST} life (${livesLeft} left)`);

    showTrapMessage(playerName);

    // Out of lives = the other player wins
    if (livesLeft <= 0) {
        endGame(isPlayer1 ? '🤖 Player 2' : '🦖 Player 1');
        return;
    }

    // Push the player right out of the lava, so one trap only ever costs one life
    // (Adrian's rule: "las trampas te quitan una vida" - ONE life, not three)
    pushClearOf(player, lava);

    // Flash player to show they got hurt
    scene.tweens.add({
        targets: player,
        alpha: 0.3,
        duration: 100,
        yoyo: true,
        repeat: 3
    });
}

// Move a player clear of a trap, to a spot that is not sitting on ANOTHER trap.
// Without this the player bounced rock -> lava -> rock and lost every life at once.
function pushClearOf(player, trap) {
    const goLeft = player.x < trap.x;
    const y = trap.y - 60;

    // Try further and further away until we find a spot with no trap under it
    for (const distance of [70, 120, 170, 220]) {
        const x = goLeft
            ? trap.x - trap.width / 2 - distance
            : trap.x + trap.width / 2 + distance;
        if (x < 30 || x > 770) continue;
        if (isSpotClear(x, y)) {
            player.body.reset(x, y);
            player.body.setVelocityY(-150);
            return;
        }
    }

    // Nowhere safe nearby: go back to the start
    const start = (player === player1) ? P1_START : P2_START;
    player.body.reset(start.x, start.y);
}

// Is there any trap sitting at this spot?
function isSpotClear(x, y) {
    const groups = [lavaTraps, waterTraps, rockTraps];
    return groups.every(group => group.getChildren().every(trap =>
        Math.abs(trap.x - x) > trap.width / 2 + 34 || Math.abs(trap.y - y) > 90
    ));
}

// Flash a message when a trap takes a life
function showTrapMessage(playerName) {
    const message = scene.add.text(400, 520, `🔥 ${playerName}: -1 ❤️ ¡Perdiste una vida!`, {
        fontSize: '20px',
        fill: '#ffdd00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: message,
        alpha: 0,
        duration: 1200,
        onComplete: () => message.destroy()
    });
}

// End the game with a winner
function endGame(winner) {
    if (gameOver) return;
    gameOver = true;

    // Display winner
    winnerText = scene.add.text(400, 300, `${winner} WINS! ¡GANA!`, {
        fontSize: '44px',
        fill: '#ffff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5);

    // Add "Play Again" instruction
    scene.add.text(400, 360, 'Refresh page to play again! / ¡Recarga la página!', {
        fontSize: '20px',
        fill: '#ffffff'
    }).setOrigin(0.5);

    console.log('🎮 Game Over!');
}

console.log('🎮 Adrian\'s Maze Game Loaded!');
console.log('👾 Created by Adrian (6 years old)');
console.log('🔥 Traps are ON - each trap costs one life!');
console.log('🚀 Ready to play!');
