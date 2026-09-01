// El Tigre Contra Los Leones / The Tiger vs The Lions
// Diseñado por / Designed by: Rafa (4)
//
// Diseño v4 (regla clara): el tigre tiene que MOVERSE para atacar.
// Si está quieto, los leones le hacen daño. 3 corazones. Vence a 12 leones.
//
// Design v4 (clear rule): tiger MUST be moving to attack. If still,
// lions damage the tiger. 3 hearts. Defeat 12 lions to win.

const GAME_W = 800;
const GAME_H = 600;
const TOTAL_TO_WIN = 12;
const MAX_LIONS = 6;
const TIGER_SPEED = 280;
const LION_SPEED = 110;
const RESPAWN_DELAY_MS = 600;
const HIT_INVINCIBILITY_MS = 1500;
const STARTING_HEARTS = 3;

const config = {
    type: Phaser.AUTO,
    width: GAME_W,
    height: GAME_H,
    parent: 'game-container',
    backgroundColor: '#f59e0b',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: { preload, create, update }
};

let tiger, cursors;
let lions;
let lionsDefeated = 0;
let hearts = STARTING_HEARTS;
let scoreText, heartsText, messageText, statusText;
let gameState = 'playing';
let lastHit = 0;
let isInvincible = false;

const game = new Phaser.Game(config);

function preload() {}

function create() {
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * GAME_W;
        const y = Math.random() * GAME_H;
        const tuft = this.add.text(x, y, '🌾', { fontSize: '20px' }).setOrigin(0.5);
        tuft.setAlpha(0.5);
    }

    tiger = this.add.text(GAME_W / 2, GAME_H / 2, '🐅', { fontSize: '52px' }).setOrigin(0.5);
    this.physics.add.existing(tiger);
    tiger.body.setCollideWorldBounds(true);

    lions = this.physics.add.group();
    for (let i = 0; i < MAX_LIONS; i++) spawnLionAtEdge.call(this);

    this.physics.add.overlap(tiger, lions, onContact, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, `🦁 ${lionsDefeated} / ${TOTAL_TO_WIN}`, {
        fontSize: '24px',
        fill: '#fff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: { x: 12, y: 6 }
    });

    heartsText = this.add.text(GAME_W - 16, 16, '❤️'.repeat(hearts), {
        fontSize: '28px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: { x: 12, y: 4 }
    }).setOrigin(1, 0);

    statusText = this.add.text(GAME_W / 2, GAME_H - 30, '', {
        fontSize: '20px',
        fill: '#fff',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: { x: 12, y: 6 }
    }).setOrigin(0.5, 1);

    messageText = this.add.text(GAME_W / 2, GAME_H / 2 - 20, '', {
        fontSize: '32px',
        fill: '#fff',
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: { x: 24, y: 16 },
        align: 'center'
    }).setOrigin(0.5).setDepth(10);
}

function spawnLionAtEdge() {
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) { x = Math.random() * GAME_W; y = 30; }
    else if (edge === 1) { x = Math.random() * GAME_W; y = GAME_H - 30; }
    else if (edge === 2) { x = 30; y = Math.random() * GAME_H; }
    else { x = GAME_W - 30; y = Math.random() * GAME_H; }

    const lion = this.add.text(x, y, '🦁', { fontSize: '40px' }).setOrigin(0.5);
    this.physics.add.existing(lion);
    lion.body.setCollideWorldBounds(true);

    lion.setScale(0);
    this.tweens.add({
        targets: lion,
        scale: 1,
        duration: 250,
        ease: 'Back.easeOut'
    });

    lions.add(lion);
}

function isMoving() {
    return cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown;
}

function update() {
    if (gameState !== 'playing') {
        if (cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown) {
            lionsDefeated = 0;
            hearts = STARTING_HEARTS;
            isInvincible = false;
            gameState = 'playing';
            this.scene.restart();
        }
        return;
    }

    let vx = 0, vy = 0;
    if (cursors.left.isDown) vx = -TIGER_SPEED;
    else if (cursors.right.isDown) vx = TIGER_SPEED;
    if (cursors.up.isDown) vy = -TIGER_SPEED;
    else if (cursors.down.isDown) vy = TIGER_SPEED;
    tiger.body.setVelocity(vx, vy);
    if (vx > 0) tiger.setFlipX(false);
    else if (vx < 0) tiger.setFlipX(true);

    // Visual cue: tiger pulses when in pounce-ready (moving) state
    if (isMoving()) {
        tiger.setScale(1 + Math.sin(this.time.now / 70) * 0.08);
        statusText.setText('💨 ¡ATACANDO! / POUNCING!').setColor('#86efac');
    } else {
        tiger.setScale(1);
        statusText.setText('⚠️ ¡QUIETO — peligro! / STILL — danger!').setColor('#fca5a5');
    }

    lions.children.iterate(lion => {
        if (!lion) return;
        const dx = tiger.x - lion.x;
        const dy = tiger.y - lion.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
            lion.body.setVelocity((dx / dist) * LION_SPEED, (dy / dist) * LION_SPEED);
        }
    });
}

function onContact(tiger, lion) {
    if (gameState !== 'playing') return;
    if (isMoving()) {
        defeatLion.call(this, lion);
    } else {
        damageTiger.call(this, lion);
    }
}

function defeatLion(lion) {
    const x = lion.x;
    const y = lion.y;
    lion.destroy();
    lionsDefeated++;
    scoreText.setText(`🦁 ${lionsDefeated} / ${TOTAL_TO_WIN}`);

    const boom = this.add.text(x, y, '💥', { fontSize: '72px' }).setOrigin(0.5);
    this.tweens.add({
        targets: boom,
        scale: { from: 0.4, to: 2.2 },
        alpha: { from: 1, to: 0 },
        duration: 450,
        onComplete: () => boom.destroy()
    });

    for (let i = 0; i < 4; i++) {
        const star = this.add.text(x, y, '⭐', { fontSize: '32px' }).setOrigin(0.5);
        const angle = (Math.PI * 2 * i) / 4 + Math.random() * 0.5;
        this.tweens.add({
            targets: star,
            x: x + Math.cos(angle) * 80,
            y: y + Math.sin(angle) * 80 - 40,
            alpha: { from: 1, to: 0 },
            scale: { from: 1, to: 0.3 },
            duration: 600,
            onComplete: () => star.destroy()
        });
    }

    this.cameras.main.shake(120, 0.008);

    if (lionsDefeated >= TOTAL_TO_WIN) {
        winGame.call(this);
    } else {
        this.time.delayedCall(RESPAWN_DELAY_MS, () => {
            if (gameState === 'playing') spawnLionAtEdge.call(this);
        });
    }
}

function damageTiger(lion) {
    if (isInvincible) return;
    if (this.time.now - lastHit < HIT_INVINCIBILITY_MS) return;
    lastHit = this.time.now;
    isInvincible = true;

    hearts--;
    heartsText.setText('❤️'.repeat(Math.max(0, hearts)) + '🖤'.repeat(STARTING_HEARTS - hearts));

    const dx = tiger.x - lion.x;
    const dy = tiger.y - lion.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    tiger.body.setVelocity((dx / dist) * 450, (dy / dist) * 450);

    const heartBreak = this.add.text(tiger.x, tiger.y - 40, '💔', { fontSize: '48px' }).setOrigin(0.5);
    this.tweens.add({
        targets: heartBreak,
        y: heartBreak.y - 60,
        alpha: { from: 1, to: 0 },
        duration: 800,
        onComplete: () => heartBreak.destroy()
    });

    this.cameras.main.shake(200, 0.015);
    this.cameras.main.flash(150, 255, 0, 0);

    this.tweens.add({
        targets: tiger,
        alpha: { from: 0.3, to: 1 },
        duration: 200,
        repeat: 6,
        onComplete: () => {
            tiger.setAlpha(1);
            isInvincible = false;
        }
    });

    if (hearts <= 0) loseGame.call(this);
}

function winGame() {
    gameState = 'won';
    statusText.setText('');

    lions.children.iterate(lion => {
        if (!lion) return;
        const lx = lion.x, ly = lion.y;
        lion.destroy();
        const poof = this.add.text(lx, ly, '✨', { fontSize: '40px' }).setOrigin(0.5);
        this.tweens.add({
            targets: poof,
            scale: { from: 0.5, to: 2 },
            alpha: { from: 1, to: 0 },
            duration: 600,
            onComplete: () => poof.destroy()
        });
    });

    for (let i = 0; i < 25; i++) {
        const emoji = ['⭐', '🎉', '🏆', '✨', '💛'][Math.floor(Math.random() * 5)];
        const c = this.add.text(
            Math.random() * GAME_W,
            -30 - Math.random() * 100,
            emoji,
            { fontSize: '32px' }
        ).setOrigin(0.5).setDepth(5);
        this.tweens.add({
            targets: c,
            y: GAME_H + 30,
            angle: Math.random() * 360,
            duration: 2000 + Math.random() * 1500,
            ease: 'Quad.easeIn'
        });
    }

    messageText.setText(`¡GANÓ EL TIGRE! 🐅🏆\nThe tiger won!\n\nPresiona una flecha para jugar otra vez\nPress an arrow to play again`);
}

function loseGame() {
    gameState = 'lost';
    statusText.setText('');
    messageText.setText(`Los leones ganaron 🦁\nThe lions won!\n\n¡Recuerda: muévete para atacar!\nRemember: move to attack!\n\nPresiona una flecha\nPress an arrow`);
}
