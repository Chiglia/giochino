// main.js — punto di ingresso dell'applicazione
// Responsabilità: configurare Phaser e avviare il gioco.
// Non contiene logica di gioco.

import MenuScene from "./scenes/MenuScene.js";
import GameScene from "./scenes/GameScene.js";
import GameOverScene from "./scenes/GameOverScene.js";

const config = {
  type: Phaser.AUTO,
  width: 680,
  height: 320,
  backgroundColor: "#1a1a2e",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false, // → true per vedere i bounding box
    },
  },
  // L'ordine conta: la prima scena della lista viene avviata automaticamente.
  // Le altre sono registrate e pronte ma non ancora attive.
  scene: [MenuScene, GameScene, GameOverScene],
};

new Phaser.Game(config);
