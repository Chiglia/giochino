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
  }

  create() {
    const { width, height } = this.scale;

    // Sfondo scuro semitrasparente
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    // Titolo vittoria o sconfitta
    const title = this.won ? "🎉 Hai vinto!" : "💀 Game Over";
    const color = this.won ? "#5DCAA5" : "#F0997B";

    this.add
      .text(width / 2, height / 2 - 50, title, {
        fontSize: "30px",
        fontFamily: "monospace",
        fill: color,
      })
      .setOrigin(0.5);

    // Punteggio finale
    this.add
      .text(width / 2, height / 2, `Monete raccolte: ${this.score} / 9`, {
        fontSize: "14px",
        fontFamily: "monospace",
        fill: "#cccccc",
      })
      .setOrigin(0.5);

    // Prompt rigioca
    const prompt = this.add
      .text(width / 2, height / 2 + 55, "Premi SPACE per rigiocare", {
        fontSize: "14px",
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

    // SPACE → ricomincia da MenuScene
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("MenuScene");
    });
  }
}
