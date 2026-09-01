// El Videojuego de Victoria / Victoria's Video Game
// Diseñado por / Designed by: Victoria
// Estilo / Style: Unicornio mágico volador que protege casas / Flying magical unicorn that protects houses
//
// Visión de Victoria (v0.3) / Victoria's vision (v0.3):
// - El unicornio mágico VUELA (con alguien encima). / The magical unicorn FLIES (with someone on top).
// - El dragón ya no anda volando: vive en su lugar de MUCHAS rocas, encima de una NUBE, allá arriba.
//   The dragon doesn't roam: it lives in its place of MANY rocks, on top of a CLOUD, way up high.
// - El mundo es MUY LARGO, así que vuelas POR PARTES hacia arriba hasta la casa del dragón.
//   The world is VERY LONG, so you fly UP IN PARTS all the way to the dragon's house.
// - El dragón baja a coger una casa; si chocas con él, lo BLOQUEAS. / The dragon swoops to grab a house; bump it to BLOCK it.
//
// Las palabras exactas de Victoria están en dev/context/victoria-prompts.md
// Victoria's exact words are in dev/context/victoria-prompts.md

const VIEW_W = 800;
const VIEW_H = 500;
const WORLD_W = 800;
const WORLD_H = 1600;          // mundo alto: vuelas hacia arriba / tall world: you fly upward
const GROUND_Y = WORLD_H - 60; // el suelo está hasta abajo / the ground is at the very bottom

// La casa del dragón: arriba del todo, sobre una nube / The dragon's house: way up top, on a cloud
const DRAGON_HOME = { x: 540, y: 150 };

const config = {
    type: Phaser.AUTO,
    width: VIEW_W,
    height: VIEW_H,
    parent: 'game-container',
    backgroundColor: '#a7d8ff',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false } // sin gravedad: el unicornio vuela / no gravity: it flies
    },
    scene: { create, update }
};

let unicorn, rider, dragon, houses;
let cursors;
let housesSaved = 0;
let reachedHome = false;
let scoreText, messageText;

let dragonState = 'resting'; // 'resting' (en casa) | 'attacking' (baja por una casa) | 'returning' (sube a casa)
let dragonTarget = null;

const game = new Phaser.Game(config);

function create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);

    this.add.text(70, GROUND_Y - 360, '☀️', { fontSize: '46px' }).setOrigin(0.5);

    // ☁️ Nubes a muchas alturas: marcan las "partes" del viaje hacia arriba
    // Clouds at many heights: they mark the "parts" of the journey upward
    const cloudSpots = [
        [180, GROUND_Y - 180], [560, GROUND_Y - 300], [260, GROUND_Y - 470],
        [620, GROUND_Y - 640], [180, GROUND_Y - 820], [520, GROUND_Y - 1000],
        [300, GROUND_Y - 1160]
    ];
    cloudSpots.forEach(([x, y]) => this.add.text(x, y, '☁️', { fontSize: '42px' }).setOrigin(0.5));

    // 🟩 El suelo verde, hasta abajo / The green ground, at the very bottom
    const ground = this.add.rectangle(WORLD_W / 2, GROUND_Y + 40, WORLD_W, 90, 0x5fbf60);
    ground.setStrokeStyle(2, 0x3f8f40);

    // 🏠 Las casas que el dragón quiere coger / The houses the dragon wants to grab
    houses = this.physics.add.staticGroup();
    [150, 380, 620].forEach((x) => {
        const h = this.add.text(x, GROUND_Y - 8, '🏠', { fontSize: '46px' }).setOrigin(0.5);
        this.physics.add.existing(h, true);
        h.isScared = false;
        houses.add(h);
    });

    // 🪨 La casa del dragón: MUCHAS rocas encima de una NUBE grande, allá arriba
    // The dragon's house: LOTS of rocks on top of a big CLOUD, way up high
    this.add.text(DRAGON_HOME.x - 60, DRAGON_HOME.y + 55, '☁️', { fontSize: '64px' }).setOrigin(0.5);
    this.add.text(DRAGON_HOME.x + 55, DRAGON_HOME.y + 55, '☁️', { fontSize: '64px' }).setOrigin(0.5);
    this.add.text(DRAGON_HOME.x, DRAGON_HOME.y + 60, '☁️', { fontSize: '72px' }).setOrigin(0.5);
    const rockSpots = [
        [-90, 10], [-55, -12], [-20, 6], [15, -10], [50, 8],
        [85, -8], [-70, 28], [-30, 30], [10, 30], [55, 30], [88, 26]
    ];
    rockSpots.forEach(([dx, dy]) => {
        this.add.text(DRAGON_HOME.x + dx, DRAGON_HOME.y + dy, '🪨', { fontSize: '28px' }).setOrigin(0.5);
    });
    this.add.text(DRAGON_HOME.x, DRAGON_HOME.y - 35, 'casa del dragón', { fontSize: '13px', fill: '#555' }).setOrigin(0.5);

    // 🐉 El dragón, posado en su casa de rocas / The dragon, perched at its rocky house
    dragon = this.add.text(DRAGON_HOME.x, DRAGON_HOME.y, '🐉', { fontSize: '50px' }).setOrigin(0.5);
    this.physics.add.existing(dragon);

    // 🦄 El unicornio volador empieza abajo, cerca de las casas / The flying unicorn starts low, near the houses
    unicorn = this.add.text(120, GROUND_Y - 70, '🦄', { fontSize: '48px' }).setOrigin(0.5);
    this.physics.add.existing(unicorn);
    unicorn.body.setCollideWorldBounds(true);
    rider = this.add.text(unicorn.x, unicorn.y - 34, '👧', { fontSize: '26px' }).setOrigin(0.5);

    this.cameras.main.startFollow(unicorn, true, 0.12, 0.12);

    this.physics.add.overlap(unicorn, dragon, blockDragon, null, this);
    this.physics.add.overlap(dragon, houses, dragonGrabsHouse, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    // UI fija en la pantalla (no se mueve con la cámara) / UI fixed to the screen (doesn't move with the camera)
    scoreText = this.add.text(16, 16, '🏠 Casas salvadas / saved: 0', {
        fontSize: '18px', fill: '#fff', backgroundColor: 'rgba(0,0,0,0.7)', padding: { x: 10, y: 6 }
    }).setScrollFactor(0);

    messageText = this.add.text(VIEW_W / 2, 250, '', {
        fontSize: '21px', fill: '#fff', backgroundColor: 'rgba(0,0,0,0.85)',
        padding: { x: 18, y: 12 }, align: 'center'
    }).setOrigin(0.5).setScrollFactor(0);

    messageText.setText(
        'Vuela hacia arriba ⬆️ por las nubes hasta la casa del dragón 🪨\n' +
        'y choca con el dragón 🐉 para que no coja las casas 🏠\n\n' +
        'Fly up through the clouds to the dragon\'s house,\nand bump the dragon so it can\'t grab the houses!'
    );
    this.time.delayedCall(5000, () => messageText.setVisible(false));

    this.time.delayedCall(5500, () => startAttack.call(this));
}

function update() {
    rider.x = unicorn.x;
    rider.y = unicorn.y - 34;

    // 🦄 Volar en cualquier dirección con las flechas / Fly any direction with the arrows
    const SPEED = 280;
    unicorn.body.setVelocityX(cursors.left.isDown ? -SPEED : cursors.right.isDown ? SPEED : 0);
    unicorn.body.setVelocityY(cursors.up.isDown ? -SPEED : cursors.down.isDown ? SPEED : 0);

    // 🐉 El dragón baja por una casa y vuelve a subir a su nube / The dragon swoops for a house and climbs back to its cloud
    const DRAGON_SPEED = 120;
    if (dragonState === 'attacking' && dragonTarget) {
        moveToward(dragon, dragonTarget.x, dragonTarget.y, DRAGON_SPEED);
    } else if (dragonState === 'returning') {
        moveToward(dragon, DRAGON_HOME.x, DRAGON_HOME.y, DRAGON_SPEED);
        if (Phaser.Math.Distance.Between(dragon.x, dragon.y, DRAGON_HOME.x, DRAGON_HOME.y) < 30) {
            dragon.body.setVelocity(0, 0);
            dragonState = 'resting';
            this.time.delayedCall(1500, () => startAttack.call(this));
        }
    } else {
        dragon.body.setVelocity(0, 0);
    }

    // 🎉 ¿Llegaste hasta la casa del dragón? / Did you reach the dragon's house?
    if (!reachedHome && Phaser.Math.Distance.Between(unicorn.x, unicorn.y, DRAGON_HOME.x, DRAGON_HOME.y) < 80) {
        reachedHome = true;
        flashMessage.call(this, '¡Llegaste a la casa del dragón! 🪨🎉\nYou reached the dragon\'s house!', 2500);
        sparkleBurst.call(this, unicorn.x, unicorn.y);
    }
}

function moveToward(obj, tx, ty, speed) {
    const angle = Phaser.Math.Angle.Between(obj.x, obj.y, tx, ty);
    obj.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
}

// El dragón elige una casa y baja a cogerla / The dragon picks a house and swoops to grab it
function startAttack() {
    const standing = houses.getChildren().filter(h => !h.isScared);
    if (standing.length === 0) return;
    dragonTarget = Phaser.Utils.Array.GetRandom(standing);
    dragonState = 'attacking';
}

// Chocas con el dragón: lo bloqueas y regresa a su nube / Bump the dragon: you block it and it returns to its cloud
function blockDragon(unicorn, dragon) {
    if (dragonState !== 'attacking') return;
    dragonState = 'returning';
    dragonTarget = null;
    housesSaved++;
    scoreText.setText('🏠 Casas salvadas / saved: ' + housesSaved);
    sparkleBurst.call(this, dragon.x, dragon.y);
    flashMessage.call(this, '¡Lo bloqueaste con magia! ✨\nYou blocked it with magic!', 1200);
}

// El dragón llega a una casa: la asusta un ratito (se recupera sola) / Dragon reaches a house: scares it briefly (it recovers)
function dragonGrabsHouse(dragon, house) {
    if (dragonState !== 'attacking' || house.isScared) return;
    house.isScared = true;
    house.setTint(0xff6b6b);
    const homeX = house.x;
    this.tweens.add({ targets: house, x: homeX + 6, duration: 60, yoyo: true, repeat: 5,
        onComplete: () => { house.x = homeX; } });
    dragonState = 'returning';
    dragonTarget = null;
    flashMessage.call(this, '¡El dragón asustó una casa! 🐉\nThe dragon scared a house!', 1200);
    this.time.delayedCall(2000, () => { house.clearTint(); house.isScared = false; });
}

// Un brillito de magia que aparece y se desvanece / A little magic sparkle that pops and fades
function sparkleBurst(x, y) {
    const s = this.add.text(x, y, '✨', { fontSize: '40px' }).setOrigin(0.5);
    this.tweens.add({ targets: s, alpha: 0, scale: 1.8, duration: 500, onComplete: () => s.destroy() });
}

// Muestra un mensaje corto que se oculta solo / Shows a short message that hides itself.
// Ocultamos con setVisible(false): un texto vacío con fondo deja un cuadrito negro.
// We hide with setVisible(false): empty text with a background leaves a little black box.
function flashMessage(text, ms) {
    messageText.setText(text).setVisible(true);
    this.time.delayedCall(ms, () => {
        if (messageText.text === text) messageText.setVisible(false);
    });
}
