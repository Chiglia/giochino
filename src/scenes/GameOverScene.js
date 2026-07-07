// GameOverScene.js — schermata di fine partita.
// Responsabilità: ricevere i dati di fine partita
// (punteggio, vittoria/sconfitta) e offrire di ricominciare.
//
// I dati arrivano tramite this.scene.start('GameOverScene', { won, score })
// e Phaser li inietta in this.scene.settings.data, accessibili
// nel metodo init() che viene chiamato prima di create().

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  // init() riceve i dati passati da this.scene.start().
  // È il posto giusto per salvare parametri prima di create().
  init(data) {
    this.won = data.won ?? false;
    this.score = data.score ?? 0;
    this.level = data.level ?? 1;
  }

  create() {
    const { width, height } = this.scale;

    // Sfondo scuro semitrasparente
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    // Titolo vittoria o sconfitta
    const title = this.won ? "🎉 HAI VINTO!" : "💀 GAME OVER";
    const color = this.won ? "#5DCAA5" : "#F0997B";

    this.add
      .text(width / 2, height / 2 - 50, title, {
        fontSize: "30px",
        fontFamily: "monospace",
        fontWeight: "bold",
        fill: color,
      })
      .setOrigin(0.5);

    // Punteggio finale e livello raggiunto
    this.add
      .text(
        width / 2,
        height / 2,
        `LIVELLO RAGGIUNTO: ${this.level}\nPUNTEGGIO TOTALE: ⭐ ${this.score}`,
        {
          fontSize: "14px",
          fontFamily: "monospace",
          fill: "#cccccc",
          align: "center",
          lineSpacing: 8,
        },
      )
      .setOrigin(0.5);

    // Prompt rigioca
    const prompt = this.add
      .text(width / 2, height / 2 + 55, "Premi SPACE o TOCCA lo schermo per rigiocare", {
        fontSize: "13px",
        fontFamily: "monospace",
        fill: "#FAC775",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // SPACE o tocco → ricomincia da MenuScene con transizione protetta
    let transitionStarted = false;
    const restartMenuScene = () => {
      if (transitionStarted) return;
      transitionStarted = true;
      this.scene.start("MenuScene");
    };

    this.input.keyboard.once("keydown-SPACE", restartMenuScene);
    this.input.once("pointerdown", restartMenuScene);
  }
}
