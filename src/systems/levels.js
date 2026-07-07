// levels.js — Configurazione dei livelli per il gioco.
// Ogni livello ha un nome, velocità dedicate, gravità, colore sintonizzato e disposizioni di piattaforme e monete.

export const LEVELS = [
  {
    levelNumber: 1,
    name: "Pianura Smeraldo",
    subtitle: "Riscaldamento facile",
    playerSpeed: 210,
    playerJump: -400,
    gravityY: 600,
    platformTint: 0x56ffb8, // Smeraldo / Verde acqua brillante
    starColor: 0x56ffb8,
    // Piattaforme stabili e facili da saltare
    platforms: [
      [0, 280, 8, 0],
      [270, 280, 6, 0],
      [480, 280, 8, 0],
      [100, 215, 4, 1],
      [310, 205, 4, 1],
      [180, 140, 4, 2],
      [420, 140, 4, 2],
    ],
    // 6 monete posizionate strategicamente ma vicine
    coins: [
      [140, 180],
      [340, 170],
      [210, 240],
      [430, 240],
      [540, 240],
      [240, 100],
    ],
  },
  {
    levelNumber: 2,
    name: "Rovine di Cobalto",
    subtitle: "Distanze medie e dislivelli",
    playerSpeed: 220,
    playerJump: -410,
    gravityY: 620,
    platformTint: 0x58b9ff, // Cobalto brillante
    starColor: 0x58b9ff,
    // Spaziature medie, richiede più attenzione nei salti
    platforms: [
      [0, 280, 6, 0],
      [200, 280, 5, 0],
      [380, 280, 5, 0],
      [560, 280, 6, 0],
      [80, 210, 3, 1],
      [260, 200, 3, 1],
      [440, 190, 3, 1],
      [140, 130, 3, 2],
      [320, 120, 3, 2],
      [500, 110, 2, 2],
    ],
    // 8 monete in punti più elevati
    coins: [
      [90, 170],
      [280, 160],
      [460, 150],
      [150, 90],
      [330, 80],
      [510, 70],
      [210, 240],
      [390, 240],
    ],
  },
  {
    levelNumber: 3,
    name: "Picchi di Ametista",
    subtitle: "Salti di precisione",
    playerSpeed: 230,
    playerJump: -420,
    gravityY: 640,
    platformTint: 0xd375fa, // Ametista / Viola brillante
    starColor: 0xd375fa,
    // Piattaforme più piccole, salti verticali stretti
    platforms: [
      [0, 280, 4, 0],
      [160, 250, 3, 0],
      [280, 220, 3, 1],
      [420, 190, 3, 1],
      [560, 160, 4, 2],
      [100, 130, 2, 2],
      [240, 110, 2, 2],
      [380, 100, 2, 2],
    ],
    // 9 monete sparse in punti alti e bassi
    coins: [
      [180, 210],
      [300, 180],
      [440, 150],
      [590, 120],
      [110, 90],
      [250, 70],
      [390, 60],
      [80, 240],
      [480, 150],
    ],
  },
  {
    levelNumber: 4,
    name: "Vuoto Cosmico",
    subtitle: "La sfida finale",
    playerSpeed: 240,
    playerJump: -430,
    gravityY: 660,
    platformTint: 0xffa751, // Oro ambrato ardente
    starColor: 0xffa751,
    // Grandi varchi e piattaforme minuscole
    platforms: [
      [0, 280, 3, 0],
      [130, 260, 2, 0],
      [260, 220, 2, 1],
      [380, 180, 2, 1],
      [500, 140, 2, 2],
      [610, 110, 3, 2],
      [60, 130, 1, 2],
      [180, 110, 1, 2],
      [300, 100, 1, 2],
      [420, 110, 1, 2],
    ],
    // 10 monete, posizionate su piattaforme isolate
    coins: [
      [140, 220],
      [270, 180],
      [390, 140],
      [510, 100],
      [625, 70],
      [65, 90],
      [185, 70],
      [305, 60],
      [425, 70],
      [540, 100],
    ],
  },
];

export function getLevelConfig(levelIndex) {
  // Se andiamo oltre il livello 4, ripetiamo i livelli in modalità "New Game+"
  // aumentando la velocità del player e la difficoltà!
  const numHandcrafted = LEVELS.length;
  const loopCount = Math.floor((levelIndex - 1) / numHandcrafted);
  const baseIndex = (levelIndex - 1) % numHandcrafted;
  const baseConfig = LEVELS[baseIndex];

  // Incrementi New Game+
  const speedBonus = loopCount * 15;
  const jumpBonus = loopCount * -10;
  const gravityBonus = loopCount * 20;

  // Se siamo in loopCount > 0, creiamo una versione sintonizzata del livello
  return {
    levelNumber: levelIndex,
    name: loopCount > 0 ? `${baseConfig.name} II (NG+)` : baseConfig.name,
    subtitle: loopCount > 0 ? `Difficoltà aumentata ×${loopCount + 1}` : baseConfig.subtitle,
    playerSpeed: baseConfig.playerSpeed + speedBonus,
    playerJump: baseConfig.playerJump + jumpBonus,
    gravityY: baseConfig.gravityY + gravityBonus,
    platformTint:
      loopCount > 0
        ? rotateColor(baseConfig.platformTint, loopCount * 60)
        : baseConfig.platformTint,
    starColor: baseConfig.starColor,
    platforms: baseConfig.platforms,
    coins: baseConfig.coins,
  };
}

// Funzione helper per cambiare i colori nel New Game+
function rotateColor(hexColor, degrees) {
  // Semplice rotazione o shift di colore per diversificare i loop
  return (hexColor + degrees * 1000) % 0xffffff;
}
