// platforms.js — generazione delle piattaforme.
// Responsabilità: leggere il layout e costruire
// un StaticGroup Phaser con i tile giusti.

// Layout: [x, y, numero_di_tile, variante_colore (0-2)]
// Variante 0 = bassa  (blu scuro)
// Variante 1 = media  (blu medio)
// Variante 2 = alta   (viola)
const LAYOUT = [
  [0, 280, 7, 0],
  [240, 280, 6, 0],
  [460, 280, 7, 0],
  [100, 210, 4, 1],
  [300, 200, 4, 1],
  [470, 190, 4, 1],
  [50, 140, 3, 2],
  [200, 130, 4, 2],
  [380, 120, 3, 2],
  [540, 110, 3, 2],
];

const TILE_SIZE = 32;

export function createPlatforms(scene) {
  // StaticGroup = corpi fisici immobili, ottimizzati per molte collisioni
  const group = scene.physics.add.staticGroup();

  LAYOUT.forEach(([x, y, tiles, variant]) => {
    for (let t = 0; t < tiles; t++) {
      // Phaser usa il centro come origine → +16 per allineare al tile
      group.create(x + t * TILE_SIZE + TILE_SIZE / 2, y + TILE_SIZE / 2, "platform" + variant);
    }
  });

  return group;
}
