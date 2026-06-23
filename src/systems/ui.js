// ui.js — HUD e messaggi di fine partita.
// Responsabilità: creare e aggiornare solo gli elementi
// di interfaccia (testi, overlay). Nessuna logica di gioco.

const TEXT_STYLE = {
  fontSize: "14px",
  fontFamily: "monospace",
};

export function createUI(scene) {
  // setScrollFactor(0) → il testo resta fisso sullo schermo
  // anche quando la camera si muove
  const scoreText = scene.add
    .text(10, 10, "⭐ 0", { ...TEXT_STYLE, fill: "#FAC775" })
    .setScrollFactor(0);

  const livesText = scene.add
    .text(580, 10, "❤️ 3", { ...TEXT_STYLE, fill: "#F0997B" })
    .setScrollFactor(0);

  // Messaggio centrale (vittoria / game over) — nascosto all'inizio
  const centerMsg = scene.add
    .text(340, 160, "", {
      fontSize: "26px",
      fontFamily: "monospace",
      align: "center",
      lineSpacing: 10,
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setVisible(false);

  return { scoreText, livesText, centerMsg };
}

export function showEndMessage(scene, won) {
  const { centerMsg } = scene.ui;
  centerMsg.setText((won ? "🎉 Hai vinto!" : "💀 Game Over") + "\n\nF5 per rigiocare");
  centerMsg.setFill(won ? "#5DCAA5" : "#F0997B");
  centerMsg.setVisible(true);
}
