// player.js — tutto ciò che riguarda il player.
// Responsabilità: creare il corpo fisico del player
// e aggiornarne velocità e aspetto ogni frame.

const SPEED = 200; // px/sec orizzontale
const JUMP_V = -400; // px/sec verticale (negativo = su)

// Crea il player e registra i tasti di input sulla scena.
export function createPlayer(scene) {
  const player = scene.physics.add.sprite(50, 240, "player");
  player.setCollideWorldBounds(false); // gestiamo noi la caduta
  player.body.setSize(22, 28);

  // Tasti frecce + space
  scene.cursors = scene.input.keyboard.createCursorKeys();
  // WASD come alternativa
  scene.wasd = scene.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  });

  return player;
}

// Chiamata ogni frame da GameScene.update().
// Legge i tasti e aggiorna velocità, flip e tint del player.
export function updatePlayer(scene) {
  const { player, cursors, wasd } = scene;
  const onGround = player.body.blocked.down;

  // Supporto controlli tastiera + touch mobile
  const goLeft =
    cursors.left.isDown || wasd.left.isDown || (scene.mobileKeys && scene.mobileKeys.left);
  const goRight =
    cursors.right.isDown || wasd.right.isDown || (scene.mobileKeys && scene.mobileKeys.right);

  let jump =
    Phaser.Input.Keyboard.JustDown(cursors.up) ||
    Phaser.Input.Keyboard.JustDown(cursors.space) ||
    Phaser.Input.Keyboard.JustDown(wasd.up);

  if (scene.mobileKeys && scene.mobileKeys.jump) {
    jump = true;
    scene.mobileKeys.jump = false; // consuma il salto per un feedback JustDown responsivo
  }

  // Usa i valori dinamici della scena o quelli di default
  const speed = scene.playerSpeed || SPEED;
  const jumpV = scene.playerJump || JUMP_V;

  // Movimento orizzontale con attrito naturale
  if (goLeft) {
    player.setVelocityX(-speed);
    player.setFlipX(true);
  } else if (goRight) {
    player.setVelocityX(speed);
    player.setFlipX(false);
  } else {
    player.setVelocityX(player.body.velocity.x * 0.8);
  }

  // Salto — solo se a terra
  if (jump && onGround) {
    player.setVelocityY(jumpV);
  }

  // Feedback visivo: tint in aria
  if (!onGround) player.setTint(0xccccff);
  else player.clearTint();
}
