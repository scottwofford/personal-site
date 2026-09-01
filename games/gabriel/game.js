// Gabriel's Star Wars Game
// Created by: Gabriel (Game Designer)
// Date: August 31, 2026
// Gabriel's words: "Como tienes que destruir a los malos con el sable laser...
//                   Yo usaba una nave espacial, mi espada, en sables laseres...
//                   Y que hayan unos volcanes que no los puedes tocar...
//                   (extraterrestres) Si, muchas... Y los tienes que esquivar."

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },   // space! no gravity
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

// Game Variables
let ship;
let saber;
let badGuys;    // 👾 you DESTROY these with the lightsaber
let aliens;     // 👽 you only DODGE these
let volcanoes;  // 🌋 never touch them
let packages;   // 📦 the bad guys throw these at your ship
let rockTraps;  // 🪨 five rock traps floating in space - do not touch them
let cursors;
let spaceKey;
let aKey;
let livesText;
let scoreText;
let messageText;
let packageText;
let scene;
let gameOver = false;

// Constants
const STARTING_LIVES = 5;
const BAD_GUYS_TO_WIN = 10;
const SHIP_SPEED = 260;
const SABER_TIME = 300;      // how long a saber swing lasts (ms)
const HIT_COOLDOWN = 2000;   // invincible time after you get hit
const PACKAGE_SPEED = 170;   // how fast a thrown package flies
const GROUND_Y = 540;        // the volcano surface

let lives = STARTING_LIVES;
let destroyed = 0;
let packagesCut = 0;
let saberOn = false;
let saberOffAt = 0;
let lastHit = 0;

function preload() {
    console.log('⚔️ Loading Gabriel\'s Star Wars Game...');
}

function create() {
    scene = this;

    // Space
    this.add.rectangle(400, 300, 800, 600, 0x0b0d2b);
    for (let i = 0; i < 70; i++) {
        const star = this.add.circle(
            Phaser.Math.Between(0, 800),
            Phaser.Math.Between(0, GROUND_Y - 40),
            Phaser.Math.Between(1, 2),
            0xffffff
        );
        star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
    }

    // Title
    this.add.text(400, 26, 'GABRIEL\'S STAR WARS GAME ⚔️', {
        fontSize: '26px',
        fill: '#ffe082',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // ============================================
    // 🌋 VOLCANOES - Gabriel: "volcanes que no los puedes tocar"
    // ============================================
    volcanoes = this.physics.add.staticGroup();
    // Kept clear of x=100, where the ship starts and respawns: a volcano sitting under
    // the spawn column killed you the moment you flew down.
    createVolcano(this, 300, 150);
    createVolcano(this, 520, 190);
    createVolcano(this, 730, 150);

    // ============================================
    // 🪨 ROCK TRAPS - Gabriel: "Cinco trampas de roca en la de Gabriel"
    // Five rocks floating in space. Touching one costs a life.
    // ============================================
    rockTraps = this.physics.add.staticGroup();
    createRockTrap(this, 300, 120);
    createRockTrap(this, 430, 330);
    createRockTrap(this, 560, 170);
    createRockTrap(this, 640, 420);
    createRockTrap(this, 750, 260);

    // The lava ground the volcanoes sit on
    this.add.rectangle(400, 585, 800, 40, 0x4a1c1c);

    // ============================================
    // 🚀 THE SHIP - Gabriel: "Yo usaba una nave espacial"
    // ============================================
    ship = this.add.text(100, 300, '🚀', { fontSize: '46px' }).setOrigin(0.5);
    this.physics.add.existing(ship);
    ship.body.setSize(30, 30);
    ship.body.setCollideWorldBounds(true);

    // ============================================
    // ⚔️ THE LIGHTSABER - Gabriel: "destruir a los malos con el sable laser"
    // ============================================
    saber = this.add.rectangle(0, 0, 80, 10, 0x40c4ff);
    hideSaber();

    // Enemy groups
    badGuys = this.physics.add.group();
    aliens = this.physics.add.group();
    packages = this.physics.add.group();

    // The saber hits are checked by hand every frame in update() - simpler and more
    // reliable than a physics body that has to be re-synced each frame.

    // Everything hurts the ship
    this.physics.add.overlap(ship, badGuys, () => loseLife('👾 ¡Un malo te dio! / A bad guy got you!'), null, this);
    this.physics.add.overlap(ship, aliens, () => loseLife('👽 ¡Un extraterrestre te dio! / An alien got you!'), null, this);
    this.physics.add.overlap(ship, volcanoes, () => loseLife('🌋 ¡Tocaste un volcán! / You touched a volcano!'), null, this);
    this.physics.add.overlap(ship, packages, hitByPackage, null, this);
    this.physics.add.overlap(ship, rockTraps, () => loseLife('🪨 ¡Chocaste con una roca! / You hit a rock!'), null, this);

    // Score and lives
    // Top right, so the instructions box does not cover it
    livesText = this.add.text(780, 60, livesLabel(), { fontSize: '18px', fill: '#ffffff' }).setOrigin(1, 0);
    scoreText = this.add.text(780, 86, scoreLabel(), { fontSize: '18px', fill: '#ffe082' }).setOrigin(1, 0);
    packageText = this.add.text(780, 112, packageLabel(), { fontSize: '16px', fill: '#a5d6a7' }).setOrigin(1, 0);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();
    // The lightsaber swings with SPACE or with the letter A
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    // Enemies keep coming
    this.time.addEvent({ delay: 1600, callback: spawnBadGuy, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 2800, callback: spawnAlien,  callbackScope: this, loop: true });
    this.time.addEvent({ delay: 2200, callback: throwPackage, callbackScope: this, loop: true });

    console.log(`✅ Ready! Destroy ${BAD_GUYS_TO_WIN} bad guys to win. ${STARTING_LIVES} lives.`);
}

function update() {
    if (gameOver) return;

    // Fly the ship
    let vx = 0;
    let vy = 0;
    if (cursors.left.isDown) vx = -SHIP_SPEED;
    if (cursors.right.isDown) vx = SHIP_SPEED;
    if (cursors.up.isDown) vy = -SHIP_SPEED;
    if (cursors.down.isDown) vy = SHIP_SPEED;
    ship.body.setVelocity(vx, vy);

    // Swing the lightsaber
    if (Phaser.Input.Keyboard.JustDown(spaceKey) || Phaser.Input.Keyboard.JustDown(aKey)) {
        swingSaber();
    }

    // The saber follows the ship while it is on, and cuts whatever it touches
    if (saberOn) {
        saber.setPosition(ship.x + 55, ship.y);
        checkSaberHits();
        if (Date.now() > saberOffAt) hideSaber();
    }

    // The rocks drift, so keep their hit areas on top of the drawing
    rockTraps.getChildren().forEach(rock => rock.body.updateFromGameObject());

    // Clean up enemies that flew off the left side
    cleanUp(badGuys);
    cleanUp(aliens);
    cleanUpPackages();
}

// ============================================
// HELPERS
// ============================================

function livesLabel() {
    return `Lives / Vidas: ${'❤️'.repeat(Math.max(lives, 0))}`;
}

function scoreLabel() {
    return `Malos destruidos / Bad guys: ${destroyed} / ${BAD_GUYS_TO_WIN}`;
}

function packageLabel() {
    return `Paquetes cortados / Packages cut: ${packagesCut}`;
}

function cleanUpPackages() {
    packages.getChildren().forEach(box => {
        if (box.x < -60 || box.x > 880 || box.y < -60 || box.y > 660) box.destroy();
    });
}

function saberHitsPackage(saberObj, box) {
    if (gameOver) return;
    box.destroy();
    packagesCut += 1;
    packageText.setText(packageLabel());
    console.log(`📦 Package cut! (${packagesCut})`);
}

function hitByPackage(shipObj, box) {
    if (gameOver) return;
    box.destroy();
    loseLife('📦 ¡Un paquete te pegó! / A package hit you!');
}

// A rock floating in space. You cannot cut it and you cannot touch it.
function createRockTrap(scene, x, y) {
    const rock = scene.add.text(x, y, '🪨', { fontSize: '38px' }).setOrigin(0.5);
    rockTraps.add(rock);
    rock.body.setSize(30, 30);

    // Drift slowly up and down so space feels alive
    scene.tweens.add({
        targets: rock,
        y: y + Phaser.Math.Between(-30, 30),
        duration: Phaser.Math.Between(2000, 3500),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

    return rock;
}

function createVolcano(scene, x, size) {
    const triangle = new Phaser.Geom.Triangle(
        x - size / 2, GROUND_Y + 25,
        x + size / 2, GROUND_Y + 25,
        x, GROUND_Y + 25 - size
    );
    const g = scene.add.graphics();
    g.fillStyle(0x5d2b1a, 1);
    g.fillTriangleShape(triangle);

    // The hot top
    scene.add.text(x, GROUND_Y + 25 - size + 8, '🌋', { fontSize: '34px' }).setOrigin(0.5);

    // The part you must not touch
    const hitZone = scene.add.rectangle(x, GROUND_Y + 25 - size / 2, size * 0.55, size, 0xff5722, 0);
    volcanoes.add(hitZone);
    return g;
}

function spawnBadGuy() {
    if (gameOver) return;
    const y = Phaser.Math.Between(70, GROUND_Y - 90);
    const bad = scene.add.text(830, y, '👾', { fontSize: '40px' }).setOrigin(0.5);
    // Add to the group FIRST: the group gives it its physics body and wipes any
    // velocity set before, which is why the bad guys used to sit still off-screen.
    badGuys.add(bad);
    bad.body.setSize(34, 34);
    bad.body.setVelocityX(Phaser.Math.Between(-150, -80));
}

function spawnAlien() {
    if (gameOver) return;
    const y = Phaser.Math.Between(70, GROUND_Y - 90);
    const alien = scene.add.text(830, y, '👽', { fontSize: '36px' }).setOrigin(0.5);
    aliens.add(alien);
    alien.body.setSize(30, 30);
    alien.body.setVelocityX(Phaser.Math.Between(-180, -110));
    alien.body.setVelocityY(Phaser.Math.Between(-40, 40));
}

// ============================================
// 📦 PACKAGES - Gabriel: "que mandan muchos paquetes por la nave espacial"
// The bad guys throw packages at your ship. Cut them with the lightsaber!
// ============================================
function throwPackage() {
    if (gameOver) return;

    // Only a bad guy that is actually on the screen can throw
    const throwers = badGuys.getChildren().filter(b => b.x < 800 && b.x > 0);
    if (throwers.length === 0) return;

    const thrower = Phaser.Utils.Array.GetRandom(throwers);
    const box = scene.add.text(thrower.x - 20, thrower.y, '📦', { fontSize: '28px' }).setOrigin(0.5);
    packages.add(box);
    box.body.setSize(24, 24);

    // Send it toward the ship
    const angle = Phaser.Math.Angle.Between(box.x, box.y, ship.x, ship.y);
    box.body.setVelocity(Math.cos(angle) * PACKAGE_SPEED, Math.sin(angle) * PACKAGE_SPEED);

    scene.tweens.add({ targets: box, angle: 360, duration: 1500, repeat: -1 });
}

function cleanUp(group) {
    group.getChildren().forEach(item => {
        if (item.x < -60) item.destroy();
    });
}

function swingSaber() {
    if (gameOver) return;
    saberOn = true;
    saberOffAt = Date.now() + SABER_TIME;
    saber.setPosition(ship.x + 55, ship.y);
    saber.setVisible(true);

    // A quick flash so the swing feels like a swing
    scene.tweens.add({
        targets: saber,
        scaleX: 1.15,
        duration: SABER_TIME / 2,
        yoyo: true
    });
}

function hideSaber() {
    saberOn = false;
    saber.setVisible(false);
    saber.setPosition(-200, -200);
}

// Anything within reach of the glowing blade gets cut
// The blade sweeps in front of the ship, so the reach is measured from a point
// between the ship and the tip. Big enough that a swing actually protects you.
const SABER_REACH = 85;
function checkSaberHits() {
    const cx = ship.x + 30;
    const cy = ship.y;
    badGuys.getChildren().slice().forEach(bad => {
        if (Phaser.Math.Distance.Between(cx, cy, bad.x, bad.y) < SABER_REACH) {
            saberHitsBadGuy(saber, bad);
        }
    });
    packages.getChildren().slice().forEach(box => {
        if (Phaser.Math.Distance.Between(cx, cy, box.x, box.y) < SABER_REACH) {
            saberHitsPackage(saber, box);
        }
    });
}

function saberHitsBadGuy(saberObj, bad) {
    if (gameOver) return;
    bad.destroy();
    destroyed += 1;
    scoreText.setText(scoreLabel());
    console.log(`⚔️ Bad guy destroyed! (${destroyed}/${BAD_GUYS_TO_WIN})`);

    if (destroyed >= BAD_GUYS_TO_WIN) {
        endGame('¡GANASTE! / YOU WIN! ⚔️');
    }
}

function loseLife(why) {
    if (gameOver) return;

    const now = Date.now();
    if (now - lastHit < HIT_COOLDOWN) return;
    lastHit = now;

    lives -= 1;
    livesText.setText(livesLabel());
    console.log(`${why} (${lives} lives left)`);
    flashMessage(why);

    // Blink the ship so you know you are safe for a moment
    scene.tweens.add({ targets: ship, alpha: 0.3, duration: 150, yoyo: true, repeat: 3 });

    // Push the ship back to a safe spot, and clear the area around it so you do not
    // get hit again the instant you come back (that used to eat every life at once)
    ship.setPosition(100, 300);
    ship.body.setVelocity(0, 0);
    clearAreaAround(ship.x, ship.y, 220);

    if (lives <= 0) endGame('GAME OVER ⚔️');
}

// Clear the enemies and packages near a point, so respawning is fair
function clearAreaAround(x, y, radius) {
    packages.getChildren().slice().forEach(box => box.destroy());
    [badGuys, aliens].forEach(group => {
        group.getChildren().slice().forEach(item => {
            if (Phaser.Math.Distance.Between(x, y, item.x, item.y) < radius) item.destroy();
        });
    });
}

function flashMessage(text) {
    if (messageText) messageText.destroy();
    messageText = scene.add.text(400, 130, text, {
        fontSize: '20px',
        fill: '#ffe082',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: messageText,
        alpha: 0,
        duration: 1500,
        onComplete: () => { if (messageText) messageText.destroy(); }
    });
}

function endGame(text) {
    if (gameOver) return;
    gameOver = true;
    ship.body.setVelocity(0, 0);
    hideSaber();

    scene.add.text(400, 290, text, {
        fontSize: '40px',
        fill: '#ffe082',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
    }).setOrigin(0.5);

    scene.add.text(400, 350, 'Refresh to play again / Recarga para jugar otra vez', {
        fontSize: '18px',
        fill: '#ffffff'
    }).setOrigin(0.5);

    console.log('🎮 Game over:', text);
}

console.log('⚔️ Gabriel\'s Star Wars Game loaded!');
console.log('👾 Designed by Gabriel');
