// camera.js — configurazione della camera.
// Responsabilità: definire i bounds del mondo
// e far seguire il player con uno smooth factor.

const WORLD_WIDTH = 720;
const WORLD_HEIGHT = 320;

// lerp x: quanto velocemente la camera insegue il player
// 0 = mai, 1 = istantaneo, 0.1 = smooth
const LERP_X = 0.1;

export function setupCamera(scene) {
  scene.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  scene.cameras.main.startFollow(
    scene.player,
    true, // roundPixels: evita blur su pixel art
    LERP_X, // lerp orizzontale
    1, // lerp verticale (istantaneo = non ballare su/giù)
  );
}
