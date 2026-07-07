// coins.js — monete collezionabili.
// Responsabilità: generare le monete, aggiungere
// l'animazione bob con Tween e gestire la texture.

// Genera la texture della moneta (chiamata in preload)
export function preloadCoins(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0xfac775);
  g.fillCircle(7, 7, 7);
  g.fillStyle(0xef9f27);
  g.fillCircle(5, 5, 3);
  g.generateTexture("coin", 14, 14);
  g.destroy();
}

// Crea il gruppo monete con animazione bob
export function createCoins(scene, positions) {
  const group = scene.physics.add.staticGroup();

  const activePositions = positions || [
    [130, 178],
    [340, 168],
    [510, 158],
    [75, 108],
    [240, 98],
    [420, 88],
    [575, 78],
    [160, 248],
    [380, 248],
  ];

  activePositions.forEach(([x, y]) => {
    const coin = group.create(x, y, "coin");
    coin.setCircle(7); // bounding circle più preciso del rect di default

    // Tween: muove la moneta su e giù continuamente
    scene.tweens.add({
      targets: coin,
      y: y + 6,
      duration: 700 + Math.random() * 300,
      yoyo: true, // torna indietro alla fine
      repeat: -1, // ripeti all'infinito
      ease: "Sine.easeInOut",
      onUpdate: () => {
        if (coin.active) coin.body.reset(coin.x, coin.y);
      },
    });
  });

  return group;
}
