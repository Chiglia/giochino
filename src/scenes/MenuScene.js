// MenuScene.js — schermata iniziale.
// Responsabilità: mostrare il titolo e aspettare
// che il giocatore prema un tasto per iniziare.
// Non sa nulla di GameScene: si limita a chiederle
// a Phaser di avviarla con this.scene.start().

import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    const { width, height } = this.scale;

    // Sfondo stellato (stesso stile di GameScene)
    const gfx = this.add.graphics();
    gfx.fillStyle(0xffffff, 0.4);
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

    // Titolo
    this.add
      .text(width / 2, height / 2 - 60, "⭐ PLATFORM GAME", {
        fontSize: "28px",
        fontFamily: "monospace",
        fill: "#AFA9EC",
      })
      .setOrigin(0.5);

    // Istruzioni
    this.add
      .text(
        width / 2,
        height / 2,
        "← → o Controlli Touch per muoverti\nSPACE o ↑ o ▲ per saltare\nRaccogli tutte le monete!",
        {
          fontSize: "13px",
          fontFamily: "monospace",
          fill: "#888888",
          align: "center",
          lineSpacing: 6,
        },
      )
      .setOrigin(0.5);

    // Prompt lampeggiante
    const prompt = this.add
      .text(width / 2, height / 2 + 80, "Premi un tasto o TOCCA lo schermo per iniziare", {
        fontSize: "13px",
        fontFamily: "monospace",
        fill: "#FAC775",
      })
      .setOrigin(0.5);

    // Tween di lampeggio sul prompt
    this.tweens.add({
      targets: prompt,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Qualsiasi tasto o tocco sullo schermo avvia il gioco con transizione protetta
    let transitionStarted = false;
    const startNextScene = () => {
      if (transitionStarted) return;
      transitionStarted = true;
      this.scene.start("GameScene");
    };

    this.input.keyboard.once("keydown", startNextScene);
    this.input.once("pointerdown", startNextScene);
  }
}
