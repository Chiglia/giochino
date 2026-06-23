// GameScene.js — la scena principale del gioco.
// Responsabilità: orchestrare i sistemi (player, piattaforme, monete…)
// chiamando le funzioni dai moduli in /systems.
// Non contiene logica specifica: delega tutto ai sistemi.

import { createPlayer, updatePlayer } from "../systems/player.js";
import { createPlatforms } from "../systems/platforms.js";
import { createCoins, preloadCoins } from "../systems/coins.js";
import { setupCamera } from "../systems/camera.js";
import { createUI } from "../systems/ui.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  // ----------------------------------------------------------
  // PRELOAD — carica asset prima che la scena parta
  // ----------------------------------------------------------
  preload() {
    // Le texture sono generate via codice (niente file esterni),
    // ma questa è la fase giusta per this.load.image() / this.load.audio()
    preloadCoins(this);
    this._generateTextures();
  }

  // ----------------------------------------------------------
  // CREATE — costruisce la scena una volta sola
  // ----------------------------------------------------------
  create() {
    this.score = 0;
    this.lives = 3;

    this._drawBackground();

    this.platforms = createPlatforms(this);
    this.coins = createCoins(this);
    this.player = createPlayer(this);
    this.ui = createUI(this);

    // Collisione player ↔ piattaforme (Phaser la risolve automaticamente)
    this.physics.add.collider(this.player, this.platforms);

    // Overlap player ↔ monete → callback di raccolta
    this.physics.add.overlap(
      this.player,
      this.coins,
      (player, coin) => this._onCoinCollected(coin),
      null,
      this,
    );

    setupCamera(this);
  }

  // ----------------------------------------------------------
  // UPDATE — eseguito ogni frame (~60fps)
  // ----------------------------------------------------------
  update() {
    if (!this.player.active) return;
    updatePlayer(this);
    this._checkFallOffScreen();
  }

  // ----------------------------------------------------------
  // METODI PRIVATI DI SCENA
  // ----------------------------------------------------------

  _onCoinCollected(coin) {
    coin.destroy();
    this.score++;
    this.ui.scoreText.setText("⭐ " + this.score);
    if (this.score >= 9) this._endGame(true);
  }

  _checkFallOffScreen() {
    if (this.player.y > 400) {
      this.lives--;
      this.ui.livesText.setText("❤️ " + this.lives);
      if (this.lives <= 0) {
        this._endGame(false);
      } else {
        this.player.setPosition(50, 240);
        this.player.setVelocity(0, 0);
      }
    }
  }

  _endGame(won) {
    this.physics.pause();
    // Breve pausa prima di cambiare scena, così il giocatore
    // vede l'ultimo frame di gioco prima di essere portato via.
    this.time.delayedCall(600, () => {
      // Passa won e score a GameOverScene tramite il secondo argomento.
      // Phaser li consegna al metodo init() della scena di destinazione.
      this.scene.start("GameOverScene", { won, score: this.score });
    });
  }

  _drawBackground() {
    const gfx = this.add.graphics();
    gfx.fillStyle(0xffffff, 0.5);
    [
      [50, 20],
      [120, 40],
      [200, 15],
      [310, 35],
      [450, 20],
      [560, 45],
      [620, 10],
      [90, 60],
      [390, 55],
      [500, 30],
    ].forEach(([x, y]) => gfx.fillCircle(x, y, 1.5));
  }

  _generateTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Player (22×28)
    g.fillStyle(0xafa9ec);
    g.fillRect(2, 0, 18, 14);
    g.fillStyle(0xeeedfe);
    g.fillRect(5, 2, 8, 6);
    g.fillStyle(0x1d9e75);
    g.fillRect(0, 14, 22, 12);
    g.fillStyle(0x7f77dd);
    g.fillRect(0, 10, 9, 6);
    g.fillStyle(0x7f77dd);
    g.fillRect(13, 10, 9, 6);
    g.fillStyle(0x3c3489);
    g.fillRect(1, 26, 8, 2);
    g.fillStyle(0x3c3489);
    g.fillRect(13, 26, 8, 2);
    g.generateTexture("player", 22, 28);
    g.clear();

    // Piattaforme — 3 varianti di colore
    const fills = [0x16213e, 0x0f3460, 0x533483];
    const highlights = [0x2471a3, 0x1a5276, 0x7f77dd];
    fills.forEach((col, i) => {
      g.fillStyle(col);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(highlights[i]);
      g.fillRect(0, 0, 32, 4);
      g.generateTexture("platform" + i, 32, 32);
      g.clear();
    });

    g.destroy();
  }
}
