// El Videojuego de Rafa / Rafa's Video Game
// Diseñado por / Designed by: Rafa (4)
// Estilo / Style: Plataformas tipo Mario / Mario-style platformer
//
// Visión de Rafa: plomero italiano, dragones, unicornios, dinosaurios verdes pequeños.
// Rafa's vision: Italian plumber, dragons, unicorns, small green dinosaurs.

const WORLD_W = 2800;
const WORLD_H = 500;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: WORLD_H,
    parent: 'game-container',
    backgroundColor: '#87ceeb',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 900 }, debug: false }
    },
    scene: { preload, create, update }
};

let player, cursors, spaceKey;
let platforms, dinos, unicorns, dragons, goal;
let unicornCount = 0;
let dinoCount = 0;
let scoreText, messageText;
let gameState = 'playing';

const game = new Phaser.Game(config);

function preload() {}

function create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    for (let i = 0; i < 10; i++) {
        const c = this.add.text(200 + i * 300, 60 + (i % 2) * 40, '☁️', { fontSize: '40px' });
        c.setScrollFactor(0.3);
    }

    platforms = this.physics.add.staticGroup();
    for (let x = 0; x < WORLD_W; x += 64) {
        const g = this.add.rectangle(x + 32, 470, 64, 60, 0x8b5a2b);
        g.setStrokeStyle(2, 0x5a3a1c);
        platforms.add(g);
    }

    const floats = [
        [280, 380, 128], [480, 320, 96], [680, 380, 128],
        [900, 320, 96], [1100, 380, 128], [1350, 300, 160],
        [1650, 380, 128], [1900, 320, 96], [2150, 380, 128],
        [2400, 320, 128]
    ];
    floats.forEach(([x, y, w]) => {
        const p = this.add.rectangle(x, y, w, 20, 0xd97706);
        p.setStrokeStyle(2, 0x78350f);
        platforms.add(p);
    });

    player = this.add.text(80, 400, '👨‍🔧', { fontSize: '40px' }).setOrigin(0.5);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);

    this.cameras.main.startFollow(player, true, 0.1, 0.1);
    this.physics.add.collider(player, platforms);

    dinos = this.physics.add.group();
    [400, 750, 1050, 1400, 1750, 2050, 2350, 2600].forEach(x => spawnDino.call(this, x, 420));
    this.physics.add.collider(dinos, platforms);
    this.physics.add.overlap(player, dinos, hitDino, null, this);

    unicorns = this.physics.add.staticGroup();
    [[280, 340], [680, 340], [900, 280], [1350, 260], [1650, 340], [1900, 280], [2400, 280]].forEach(([x, y]) => {
        const u = this.add.text(x, y, '🦄', { fontSize: '32px' }).setOrigin(0.5);
        this.physics.add.existing(u, true);
        unicorns.add(u);
    });
    this.physics.add.overlap(player, unicorns, collectUnicorn, null, this);

    dragons = this.physics.add.group();
    [[900, 180], [1500, 160], [2100, 180]].forEach(([x, y]) => spawnDragon.call(this, x, y));
    this.physics.add.overlap(player, dragons, hitDragon, null, this);

    goal = this.add.text(2720, 420, '🚩', { fontSize: '56px' }).setOrigin(0.5);
    this.physics.add.existing(goal, true);
    this.physics.add.overlap(player, goal, reachGoal, null, this);

    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    scoreText = this.add.text(16, 16, '🦄 0   🦖 0', {
        fontSize: '20px',
        fill: '#fff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: { x: 10, y: 6 }
    }).setScrollFactor(0);

    messageText = this.add.text(400, 220, '', {
        fontSize: '28px',
        fill: '#fff',
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: { x: 20, y: 14 },
        align: 'center'
    }).setOrigin(0.5).setScrollFactor(0);
}

function spawnDino(x, y) {
    const d = this.add.text(x, y, '🦖', { fontSize: '28px' }).setOrigin(0.5);
    this.physics.add.existing(d);
    d.body.setVelocityX(-60);
    d.body.setBounce(1, 0);
    d.body.setCollideWorldBounds(true);
    dinos.add(d);
}

function spawnDragon(x, y) {
    const d = this.add.text(x, y, '🐉', { fontSize: '40px' }).setOrigin(0.5);
    this.physics.add.existing(d);
    d.body.setAllowGravity(false);
    d.body.setVelocityX(-100);
    d.startX = x;
    dragons.add(d);
}

function update() {
    if (gameState !== 'playing') {
        if (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(spaceKey)) {
            unicornCount = 0;
            dinoCount = 0;
            gameState = 'playing';
            this.scene.restart();
        }
        return;
    }

    if (cursors.left.isDown) {
        player.body.setVelocityX(-220);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(220);
    } else {
        player.body.setVelocityX(0);
    }

    const onGround = player.body.touching.down || player.body.blocked.down;
    if ((cursors.up.isDown || spaceKey.isDown) && onGround) {
        player.body.setVelocityY(-500);
    }

    dragons.children.iterate(d => {
        if (!d) return;
        if (d.x < d.startX - 250 && d.body.velocity.x < 0) d.body.setVelocityX(100);
        if (d.x > d.startX + 250 && d.body.velocity.x > 0) d.body.setVelocityX(-100);
    });

    if (player.y > 550) loseGame.call(this, '¡Te caíste!\nYou fell!');
}

function hitDino(player, dino) {
    // Falling onto the dino = stomp (kid-friendly threshold)
    if (player.body.velocity.y > 30) {
        dino.destroy();
        player.body.setVelocityY(-380);
        dinoCount++;
        scoreText.setText(`🦄 ${unicornCount}   🦖 ${dinoCount}`);
    } else {
        loseGame.call(this, '¡Te tocó un dinosaurio! 🦖\nA dinosaur got you!');
    }
}

function hitDragon() {
    loseGame.call(this, '¡Te tocó un dragón! 🐉\nA dragon got you!');
}

function collectUnicorn(player, unicorn) {
    unicorn.destroy();
    unicornCount++;
    scoreText.setText(`🦄 ${unicornCount}   🦖 ${dinoCount}`);
}

function reachGoal() {
    if (gameState !== 'playing') return;
    gameState = 'won';
    messageText.setText(`¡GANASTE! 🏆\nYou won!\n🦄 ${unicornCount}   🦖 ${dinoCount}\n\nPresiona ↑ o ESPACIO\nPress ↑ or SPACE`);
}

function loseGame(reason) {
    if (gameState !== 'playing') return;
    gameState = 'lost';
    messageText.setText(`${reason}\n\nPresiona ↑ o ESPACIO\nPress ↑ or SPACE`);
}
