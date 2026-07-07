// GameScene.js — la scena principale del gioco.
// Responsabilità: orchestrare i sistemi (player, piattaforme, monete…)
// chiamando le funzioni dai moduli in /systems.

import Phaser from "phaser";
import { createPlayer, updatePlayer } from "../systems/player.js";
import { createPlatforms } from "../systems/platforms.js";
import { createCoins, preloadCoins } from "../systems/coins.js";
import { setupCamera } from "../systems/camera.js";
import { createUI } from "../systems/ui.js";
import { getLevelConfig } from "../systems/levels.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  // ----------------------------------------------------------
  // PRELOAD — carica asset prima che la scena parta
  // ----------------------------------------------------------
  preload() {
    // Le texture sono generate via codice (niente file esterni)
    preloadCoins(this);
    this._generateTextures();
  }

  // ----------------------------------------------------------
  // CREATE — costruisce la scena una volta sola
  // ----------------------------------------------------------
  create() {
    this.score = 0;
    this.lives = 3;
    this.currentLevelIndex = 1;
    this.coinsCollectedThisLevel = 0;

    // Inizializza stato tasti virtuali mobili
    this.mobileKeys = { left: false, right: false, jump: false };

    // Crea il giocatore prima, così è disponibile per la creazione del livello
    this.player = createPlayer(this);

    // Crea la UI HUD prima, così gli aggiornamenti in _buildLevel funzionano
    this.ui = createUI(this);

    // Costruisce la scena del livello iniziale
    this._buildLevel();

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
  // COSTRUZIONE LIVELLO DINAMICO
  // ----------------------------------------------------------
  _buildLevel() {
    const levelConfig = getLevelConfig(this.currentLevelIndex);

    // Aggiorna velocità e fisica basate sul livello corrente
    this.playerSpeed = levelConfig.playerSpeed;
    this.playerJump = levelConfig.playerJump;
    this.physics.world.gravity.y = levelConfig.gravityY;

    // Pulisce le piattaforme del livello precedente
    if (this.platforms) {
      this.platforms.clear(true, true);
    }
    // Crea piattaforme con la forma e tonalità specifiche di questo livello
    this.platforms = createPlatforms(this, levelConfig.platforms, levelConfig.platformTint);

    // Pulisce le monete del livello precedente
    if (this.coins) {
      this.coins.clear(true, true);
    }
    // Genera monete specifiche per questo livello
    this.coins = createCoins(this, levelConfig.coins);

    // Riposiziona il giocatore alla partenza sicura
    this.player.setPosition(50, 240);
    this.player.setVelocity(0, 0);

    // Gestione collisioni
    this.physics.add.collider(this.player, this.platforms);

    // Overlap player ↔ monete → callback di raccolta
    this.physics.add.overlap(
      this.player,
      this.coins,
      (player, coin) => this._onCoinCollected(coin),
      null,
      this,
    );

    // Ridisegna lo sfondo stellato sintonizzato sui colori del livello
    this._drawBackground();

    // Aggiorna elementi HUD
    this.ui.scoreText.setText("⭐ PUNTI: " + this.score);
    this.ui.levelCoinsText.setText(`🪙 0 / ${levelConfig.coins.length}`);
    this.ui.levelText.setText(
      `🏆 LIVELLO ${levelConfig.levelNumber}: ${levelConfig.name.toUpperCase()}`,
    );
    this.ui.livesText.setText("❤️ VITE: " + this.lives);

    // Rigenera i controlli touch sintonizzati ai colori del livello
    this._createMobileControls();
  }

  // ----------------------------------------------------------
  // TRANSIZIONE DI LIVELLO UP (CELEBRAZIONE)
  // ----------------------------------------------------------
  _startLevelUpTransition() {
    // Pausa fisica e controlli
    this.physics.pause();
    this.player.setVelocity(0, 0);

    const nextLevelIndex = this.currentLevelIndex + 1;
    const nextLevelConfig = getLevelConfig(nextLevelIndex);

    // Effetto flash celestiale sulla camera principale
    this.cameras.main.flash(450, 175, 169, 236);

    // Testo celebrativo primario
    const completionText = this.add
      .text(340, 130, "LIVELLO COMPLETATO!", {
        fontSize: "26px",
        fontFamily: "monospace",
        fontWeight: "bold",
        fill: "#5DCAA5",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setShadow(2, 2, "#000000", 4);

    // Testo celebrativo secondario (Nome e sottotitolo del prossimo livello)
    const nextText = this.add
      .text(340, 185, `PROSSIMO: ${nextLevelConfig.name}\n"${nextLevelConfig.subtitle}"`, {
        fontSize: "13px",
        fontFamily: "monospace",
        align: "center",
        fill: "#FAC775",
        lineSpacing: 6,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setShadow(1, 1, "#000000", 3);

    // Entrata trionfale animata
    completionText.setScale(0);
    this.tweens.add({
      targets: completionText,
      scale: 1,
      duration: 500,
      ease: "Back.easeOut",
    });

    // Dopo 2.2 secondi di celebrazione, ricostruisce il prossimo livello
    this.time.delayedCall(2200, () => {
      completionText.destroy();
      nextText.destroy();

      // Avanza il livello
      this.currentLevelIndex = nextLevelIndex;
      this.coinsCollectedThisLevel = 0;

      // Premio livello completato: aggiunge 1 vita (fino a un massimo di 5)
      if (this.lives < 5) {
        this.lives++;
      }

      // Ricostruisce la mappa
      this._buildLevel();

      // Ripristina la fisica
      this.physics.resume();
    });
  }

  // ----------------------------------------------------------
  // METODI PRIVATI DI SCENA
  // ----------------------------------------------------------

  _onCoinCollected(coin) {
    coin.destroy();
    this.score += 10; // 10 punti a moneta
    this.coinsCollectedThisLevel++;

    const levelConfig = getLevelConfig(this.currentLevelIndex);
    this.ui.scoreText.setText("⭐ PUNTI: " + this.score);
    this.ui.levelCoinsText.setText(
      `🪙 ${this.coinsCollectedThisLevel} / ${levelConfig.coins.length}`,
    );

    // Se tutte le monete del livello sono state raccolte, passa al livello successivo
    if (this.coinsCollectedThisLevel >= levelConfig.coins.length) {
      this._startLevelUpTransition();
    }
  }

  _checkFallOffScreen() {
    if (this.player.y > 400) {
      this.lives--;

      // Feedback drammatico: sussulto della camera
      this.cameras.main.shake(250, 0.012);
      this.ui.livesText.setText("❤️ VITE: " + this.lives);

      if (this.lives <= 0) {
        this._endGame(false);
      } else {
        this.player.setPosition(50, 240);
        this.player.setVelocity(0, 0);

        // Effetto lampeggiante di rinascita temporanea
        this.tweens.add({
          targets: this.player,
          alpha: 0.2,
          duration: 120,
          yoyo: true,
          repeat: 4,
          onComplete: () => {
            this.player.alpha = 1;
          },
        });
      }
    }
  }

  _endGame(won) {
    this.physics.pause();
    this.time.delayedCall(600, () => {
      // Trasmette vittoria/sconfitta, punteggio totale e livello massimo raggiunto
      this.scene.start("GameOverScene", {
        won,
        score: this.score,
        level: this.currentLevelIndex,
      });
    });
  }

  _drawBackground() {
    if (!this.bgGraphics) {
      this.bgGraphics = this.add.graphics();
    } else {
      this.bgGraphics.clear();
    }

    const levelConfig = getLevelConfig(this.currentLevelIndex);
    const starCol = levelConfig.starColor || 0xffffff;

    // Disegna stelle scintillanti con la sfumatura di colore dell'universo corrente
    this.bgGraphics.fillStyle(starCol, 0.35);
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
      [30, 100],
      [150, 80],
      [270, 120],
      [420, 90],
      [580, 110],
      [650, 50],
      [180, 50],
      [350, 130],
      [480, 70],
      [600, 140],
    ].forEach(([x, y]) => this.bgGraphics.fillCircle(x, y, 1.5));

    // Stelle dorate fisse grandi e luminose
    this.bgGraphics.fillStyle(0xffd700, 0.65);
    [
      [80, 15],
      [290, 50],
      [520, 25],
      [610, 85],
    ].forEach(([x, y]) => this.bgGraphics.fillCircle(x, y, 2.5));
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

  // ----------------------------------------------------------
  // CREAZIONE CONTROLLI VIRTUALI PER DISPOSITIVI TOUCH
  // ----------------------------------------------------------
  _createMobileControls() {
    // 1. Pulisce controlli mobili precedenti se presenti per evitare accumuli di eventi
    if (this.mobileControlsGroup) {
      this.mobileControlsGroup.forEach((child) => child.destroy());
    }
    this.mobileControlsGroup = [];

    // Rileva se il dispositivo supporta il touch o è un sistema mobile in modo robusto e nativo
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isTouchDevice) {
      return; // Non renderizza i bottoni su PC desktop per non occupare spazio inutilmente
    }

    // Abilita puntatori multipli (fino a 2 contemporanei) per saltare e correre insieme
    if (
      this.input.manager &&
      this.input.manager.pointers &&
      this.input.manager.pointers.length < 3
    ) {
      this.input.addPointer(2);
    }

    const levelConfig = getLevelConfig(this.currentLevelIndex);
    const colorTheme = levelConfig.platformTint || 0x56ffb8;

    // Bottone di Movimento a Sinistra
    const leftBtn = this.add
      .circle(55, 265, 24, 0x000000, 0.45)
      .setStrokeStyle(2.5, colorTheme)
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(1000);
    const leftText = this.add
      .text(55, 265, "◀", {
        fontSize: "20px",
        fontFamily: "monospace",
        fontWeight: "bold",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001);

    leftBtn.on("pointerdown", () => {
      this.mobileKeys.left = true;
      leftBtn.setFillStyle(0xffffff, 0.25);
    });
    const releaseLeft = () => {
      this.mobileKeys.left = false;
      leftBtn.setFillStyle(0x000000, 0.45);
    };
    leftBtn.on("pointerup", releaseLeft);
    leftBtn.on("pointerout", releaseLeft);

    // Bottone di Movimento a Destra
    const rightBtn = this.add
      .circle(120, 265, 24, 0x000000, 0.45)
      .setStrokeStyle(2.5, colorTheme)
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(1000);
    const rightText = this.add
      .text(120, 265, "▶", {
        fontSize: "20px",
        fontFamily: "monospace",
        fontWeight: "bold",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001);

    rightBtn.on("pointerdown", () => {
      this.mobileKeys.right = true;
      rightBtn.setFillStyle(0xffffff, 0.25);
    });
    const releaseRight = () => {
      this.mobileKeys.right = false;
      rightBtn.setFillStyle(0x000000, 0.45);
    };
    rightBtn.on("pointerup", releaseRight);
    rightBtn.on("pointerout", releaseRight);

    // Bottone di Salto (Posizionato sulla destra dello schermo)
    const jumpBtn = this.add
      .circle(620, 260, 28, 0x000000, 0.45)
      .setStrokeStyle(2.5, colorTheme)
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(1000);
    const jumpText = this.add
      .text(620, 260, "▲", {
        fontSize: "22px",
        fontFamily: "monospace",
        fontWeight: "bold",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001);

    jumpBtn.on("pointerdown", () => {
      this.mobileKeys.jump = true;
      jumpBtn.setFillStyle(0xffffff, 0.25);
    });
    const releaseJump = () => {
      jumpBtn.setFillStyle(0x000000, 0.45);
    };
    jumpBtn.on("pointerup", releaseJump);
    jumpBtn.on("pointerout", releaseJump);

    // Salva le referenze per poterle pulire correttamente durante la transizione di livello
    this.mobileControlsGroup.push(leftBtn, leftText, rightBtn, rightText, jumpBtn, jumpText);
  }
}
