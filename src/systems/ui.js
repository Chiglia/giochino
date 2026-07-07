// ui.js — HUD e messaggi di fine partita.
// Responsabilità: creare e aggiornare solo gli elementi
// di interfaccia (testi, overlay). Nessuna logica di gioco.

const TEXT_STYLE = {
  fontSize: "13px",
  fontFamily: "monospace",
  fontWeight: "bold",
};

export function createUI(scene) {
  // setScrollFactor(0) → il testo resta fisso sullo schermo
  // anche quando la camera si muove

  // Punteggio totale accumulato
  const scoreText = scene.add
    .text(15, 10, "⭐ PUNTI: 0", { ...TEXT_STYLE, fill: "#FAC775" })
    .setScrollFactor(0)
    .setShadow(1, 1, "#000000", 3);

  // Monete raccolte nel livello corrente
  const levelCoinsText = scene.add
    .text(140, 10, "🪙 0 / 6", { ...TEXT_STYLE, fill: "#FFD700" })
    .setScrollFactor(0)
    .setShadow(1, 1, "#000000", 3);

  // Livello corrente e il suo nome evocativo (centrato)
  const levelText = scene.add
    .text(340, 10, "🏆 LIVELLO 1: PIANURA SMERALDO", { ...TEXT_STYLE, fill: "#AFA9EC" })
    .setOrigin(0.5, 0)
    .setScrollFactor(0)
    .setShadow(1, 1, "#000000", 3);

  // Vite rimanenti (allineato a destra dello schermo, width=680)
  const livesText = scene.add
    .text(665, 10, "❤️ VITE: 3", { ...TEXT_STYLE, fill: "#F0997B" })
    .setOrigin(1, 0)
    .setScrollFactor(0)
    .setShadow(1, 1, "#000000", 3);

  // Messaggio centrale (vittoria / game over) — nascosto all'inizio
  const centerMsg = scene.add
    .text(340, 160, "", {
      fontSize: "24px",
      fontFamily: "monospace",
      align: "center",
      lineSpacing: 10,
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setShadow(2, 2, "#000000", 4)
    .setVisible(false);

  return { scoreText, levelCoinsText, levelText, livesText, centerMsg };
}

export function showEndMessage(scene, won) {
  const { centerMsg } = scene.ui;
  centerMsg.setText(
    (won ? "🎉 HAI VINTO IL GIOCO!" : "💀 GAME OVER") + "\n\nPremi SPACE per rigiocare",
  );
  centerMsg.setFill(won ? "#5DCAA5" : "#F0997B");
  centerMsg.setVisible(true);
}
