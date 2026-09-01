// Gio's Lava Game
// Created by: Gio (Game Designer)
// Date: August 31, 2026
// Gio's words: "volcanoes and a bunch of lava and you gotta try to get through the lava
//               and there's cracks you've been falling thru"

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
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
// 🗺️ THE LEVELS - Gio (2026-08-31): "I just want a level two lava game...
// level two is a little harder."
// rocks: [leftX, width] - the gaps between them are the cracks you fall through
// lava:  [x, y, width, height]
// ============================================
const LEVELS = [
    {
        name: 'Level 1 / Nivel 1',
        rocks: [[0, 180], [235, 145], [470, 90], [615, 185]],
        lava: [
            [425, 528, 90, 26],   // lava pit in the middle gap
            [300, 380, 60, 20],   // floating lava
            [660, 455, 70, 20]    // lava before the flag
        ]
    },
    {
        name: 'Level 2 / Nivel 2 (más difícil)',
        rocks: [[0, 130], [210, 95], [360, 80], [520, 70], [660, 140]],
        lava: [
            [170, 528, 80, 26],   // lava pit
            [480, 528, 80, 26],   // lava pit
            [625, 528, 70, 26],   // lava pit
            [255, 430, 70, 20],   // low floating lava: do not jump here
            [560, 430, 60, 20],   // low floating lava
            [740, 440, 60, 20]    // guarding the flag
        ]
    },
    {
        // Gio (2026-08-31): "I want level three lava game but with boxing."
        name: 'Level 3 / Nivel 3 - ¡BOXEO! 🥊',
        rocks: [[0, 150], [230, 130], [430, 120], [620, 180]],
        lava: [
            [190, 528, 70, 26],
            [380, 528, 80, 26],
            [575, 528, 80, 26],
            [300, 430, 60, 20]
        ],
        // Boxers walk back and forth on a rock. Punch them with SPACE!
        boxers: [
            [280, 470, 235, 350],   // x, y, patrol from, patrol to
            [480, 470, 435, 540],
            [690, 470, 625, 780]
        ]
    }
];

let currentLevel = 0;   // 0 = level 1

// Game Variables
let player;
let rocks;      // the rock you can stand on
let lavaPools;  // the lava that burns you
let boxers;     // 🥊 the guys you box in level 3
let glove;      // your boxing glove
let facing = 1; // 1 = looking right, -1 = looking left
let punching = false;
let punchOffAt = 0;
let spaceKey;
let knockedOut = 0;
let koText;
let cursors;
let livesText;
let messageText;
let scene;
let gameOver = false;

// Constants
const STARTING_LIVES = 3;
const START_X = 60;
const START_Y = 420;
const FALL_LINE = 640;   // below this you fell through a crack
const MOVE_SPEED = 200;
const JUMP_SPEED = -330;

let lives = STARTING_LIVES;
let lastHit = 0;
const HIT_COOLDOWN = 800;
const PUNCH_TIME = 250;    // how long a punch lasts
const PUNCH_REACH = 55;

function preload() {
    console.log('🌋 Loading Gio\'s Lava Game...');
}

function create() {
    scene = this;
    gameOver = false;
    lastHit = 0;
    messageText = null;
    punching = false;
    facing = 1;

    // Sky above a lava world
    this.add.rectangle(400, 300, 800, 600, 0x3b1f1f);

    // Volcanoes in the background / Volcanes en el fondo
    createVolcano(this, 150, 500, 150);
    createVolcano(this, 430, 500, 190);
    createVolcano(this, 700, 500, 140);

    // Title
    this.add.text(400, 30, 'GIO\'S LAVA GAME 🌋', {
        fontSize: '30px',
        fill: '#ffd54f',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 62, `${LEVELS[currentLevel].name} - ¡Pasa por la lava! / Get through the lava!`, {
        fontSize: '16px',
        fill: '#ff8a65'
    }).setOrigin(0.5);

    // ============================================
    // 🪨 ROCK + 🕳️ CRACKS
    // The gaps between the rocks are the cracks you fall through
    // ============================================
    rocks = this.physics.add.staticGroup();

    LEVELS[currentLevel].rocks.forEach(([leftX, width]) => createRock(this, leftX, 520, width));

    // ============================================
    // 🔥 LAVA - it burns you
    // ============================================
    lavaPools = this.physics.add.staticGroup();

    LEVELS[currentLevel].lava.forEach(([x, y, w, h]) => createLava(this, x, y, w, h));

    // ============================================
    // 🥊 BOXING - Gio: "level three lava game but with boxing"
    // ============================================
    boxers = this.physics.add.group();
    knockedOut = 0;
    (LEVELS[currentLevel].boxers || []).forEach(([x, y, fromX, toX]) => createBoxer(this, x, y, fromX, toX));

    glove = this.add.text(-200, -200, '🥊', { fontSize: '30px' }).setOrigin(0.5);
    glove.setVisible(false);
    punching = false;

    // Finish flag / La bandera
    this.add.text(760, 480, '🏁', { fontSize: '40px' }).setOrigin(0.5);

    // Player (Gio picks who this is!) / ¡Gio escoge quién es!
    player = this.add.text(START_X, START_Y, '🏃', { fontSize: '48px' }).setOrigin(0.5);
    this.physics.add.existing(player);
    player.body.setSize(36, 48);
    player.body.setCollideWorldBounds(false);

    this.physics.add.collider(player, rocks);
    this.physics.add.overlap(player, lavaPools, hitLava, null, this);
    this.physics.add.overlap(player, boxers, hitByBoxer, null, this);

    // Lives / Vidas
    livesText = this.add.text(20, 100, livesLabel(), {
        fontSize: '18px',
        fill: '#ffffff'
    });

    if ((LEVELS[currentLevel].boxers || []).length > 0) {
        koText = this.add.text(20, 126, boxerLabel(), { fontSize: '16px', fill: '#ffcc80' });
        this.add.text(400, 92, 'ESPACIO / SPACE = 🥊 puñetazo / punch', {
            fontSize: '15px',
            fill: '#ffcc80'
        }).setOrigin(0.5);
    }

    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    console.log(`✅ Game created! Arrow keys to move. ${STARTING_LIVES} lives.`);
}

function update() {
    if (gameOver) return;

    // Move left and right
    if (cursors.left.isDown) {
        player.body.setVelocityX(-MOVE_SPEED);
        facing = -1;
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(MOVE_SPEED);
        facing = 1;
    } else {
        player.body.setVelocityX(0);
    }

    // Punch! / ¡Puñetazo!
    if (Phaser.Input.Keyboard.JustDown(spaceKey)) punch();
    if (punching) {
        glove.setPosition(player.x + facing * 40, player.y);
        checkPunchHits();
        if (Date.now() > punchOffAt) stopPunch();
    }

    // The boxers walk back and forth on their rock
    boxers.getChildren().forEach(boxer => {
        if (boxer.x < boxer.fromX) boxer.body.setVelocityX(Math.abs(boxer.speed));
        if (boxer.x > boxer.toX) boxer.body.setVelocityX(-Math.abs(boxer.speed));
    });

    // Jump (only when standing on rock)
    if (cursors.up.isDown && player.body.blocked.down) {
        player.body.setVelocityY(JUMP_SPEED);
    }

    // Keep the player on the screen left and right
    if (player.x < 20) player.x = 20;
    if (player.x > 790) player.x = 790;

    // Fell through a crack! / ¡Te caíste por una grieta!
    if (player.y > FALL_LINE) {
        loseLife('🕳️ You fell through a crack! / ¡Te caíste por una grieta!');
    }

    // Made it to the flag / Llegaste a la bandera
    if (player.x > 740 && player.y < 520) {
        win();
    }
}

// ============================================
// HELPERS
// ============================================

function livesLabel() {
    return `Lives / Vidas: ${'❤️'.repeat(Math.max(lives, 0))}`;
}

function boxerLabel() {
    const total = (LEVELS[currentLevel].boxers || []).length;
    return `🥊 Boxeadores / Boxers: ${knockedOut} / ${total}`;
}

// A boxer walking on a rock. Punch him! / ¡Dale un puñetazo!
function createBoxer(scene, x, y, fromX, toX) {
    const boxer = scene.add.text(x, y, '🥊', { fontSize: '34px' }).setOrigin(0.5);
    boxers.add(boxer);
    boxer.body.setSize(28, 28);
    boxer.body.setAllowGravity(false);
    boxer.fromX = fromX;
    boxer.toX = toX;
    boxer.speed = 70;
    boxer.body.setVelocityX(70);
    return boxer;
}

function punch() {
    if (gameOver) return;
    punching = true;
    punchOffAt = Date.now() + PUNCH_TIME;
    glove.setPosition(player.x + facing * 40, player.y);
    glove.setVisible(true);
}

function stopPunch() {
    punching = false;
    glove.setVisible(false);
    glove.setPosition(-200, -200);
}

function checkPunchHits() {
    boxers.getChildren().slice().forEach(boxer => {
        if (Phaser.Math.Distance.Between(glove.x, glove.y, boxer.x, boxer.y) < PUNCH_REACH) {
            boxer.destroy();
            knockedOut += 1;
            if (koText) koText.setText(boxerLabel());
            flashMessage('🥊 ¡KNOCKOUT!');
        }
    });
}

// A boxer hit you first / Un boxeador te pegó primero
function hitByBoxer() {
    loseLife('🥊 ¡Un boxeador te pegó! / A boxer hit you!');
}

// A rock slab you can stand on. The space between slabs is a crack.
function createRock(scene, leftX, y, width) {
    const rock = scene.add.rectangle(leftX + width / 2, y, width, 40, 0x5d4037);
    rocks.add(rock);
    // A crumbly top edge so it looks like rock
    scene.add.rectangle(leftX + width / 2, y - 18, width, 6, 0x8d6e63);
    return rock;
}

// A pool of lava. Touching it burns you.
function createLava(scene, x, y, width, height) {
    const lava = scene.add.rectangle(x, y, width, height, 0xff5722);
    lavaPools.add(lava);

    scene.tweens.add({
        targets: lava,
        scaleY: 1.25,
        duration: 400,
        yoyo: true,
        repeat: -1
    });

    scene.add.text(x, y - height, '🔥', { fontSize: '20px' }).setOrigin(0.5);
    return lava;
}

// A volcano in the background
function createVolcano(scene, x, baseY, size) {
    const shape = new Phaser.Geom.Triangle(
        x - size / 2, baseY,
        x + size / 2, baseY,
        x, baseY - size
    );
    const volcano = scene.add.graphics();
    volcano.fillStyle(0x4e342e, 1);
    volcano.fillTriangleShape(shape);
    scene.add.text(x, baseY - size + 6, '🌋', { fontSize: `${Math.round(size / 4)}px` }).setOrigin(0.5);
    return volcano;
}

// The lava got you
function hitLava() {
    loseLife('🔥 The lava burned you! / ¡La lava te quemó!');
}

// Lose one life and go back to the start
function loseLife(why) {
    if (gameOver) return;

    const now = Date.now();
    if (now - lastHit < HIT_COOLDOWN) return;
    lastHit = now;

    lives -= 1;
    livesText.setText(livesLabel());
    console.log(`${why} (${lives} lives left)`);

    flashMessage(why);

    if (lives <= 0) {
        endGame('GAME OVER 🌋');
        return;
    }

    // Back to the start
    player.setPosition(START_X, START_Y);
    player.body.setVelocity(0, 0);
}

function flashMessage(text) {
    if (messageText) messageText.destroy();
    messageText = scene.add.text(400, 160, text, {
        fontSize: '20px',
        fill: '#ffeb3b',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: messageText,
        alpha: 0,
        duration: 1500,
        onComplete: () => { if (messageText) messageText.destroy(); }
    });
}

function win() {
    // Was that the last level? / ¿Era el último nivel?
    if (currentLevel >= LEVELS.length - 1) {
        endGame('YOU BEAT EVERY LEVEL! 🏁\n¡GANASTE TODOS LOS NIVELES!');
        return;
    }

    // On to the next level / Al siguiente nivel
    gameOver = true;
    player.body.setVelocity(0, 0);
    player.body.setAllowGravity(false);

    scene.add.text(400, 280, `¡NIVEL ${currentLevel + 2}! / LEVEL ${currentLevel + 2}!`, {
        fontSize: '40px',
        fill: '#ffeb3b',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5);

    scene.add.text(400, 340, 'Es más difícil... / It is harder...', {
        fontSize: '20px',
        fill: '#ffffff'
    }).setOrigin(0.5);

    scene.time.delayedCall(1800, () => {
        currentLevel += 1;
        lives = STARTING_LIVES;
        gameOver = false;
        scene.scene.restart();
    });
}

function endGame(text) {
    if (gameOver) return;
    gameOver = true;
    player.body.setVelocity(0, 0);
    player.body.setAllowGravity(false);

    scene.add.text(400, 300, text, {
        fontSize: '34px',
        fill: '#ffeb3b',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center'
    }).setOrigin(0.5);

    scene.add.text(400, 380, 'Refresh to play again / Recarga para jugar otra vez', {
        fontSize: '18px',
        fill: '#ffffff'
    }).setOrigin(0.5);

    console.log('🎮 Game over:', text);
}

console.log('🌋 Gio\'s Lava Game loaded!');
console.log('👾 Designed by Gio');
