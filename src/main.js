import * as idbKeyval from "idb-keyval";
import { Howl, Howler } from "howler";

const scriptFiles = [
  "scripts/saucer.js",
  "scripts/random.js",
  "scripts/graphics.js",
  "scripts/input.js",
  "scripts/particles.js",
  "scripts/spaceship.js",
  "scripts/services/http.js",
  "scripts/services/storage.js",
  "scripts/services/audio.js",
  "scripts/mainmenu.js",
  "scripts/game.js",
  "scripts/screens.js",
  "scripts/session/game-session-core.js",
  "scripts/gameplay.js",
  "scripts/attract.js",
  "scripts/loopFunctions.js",
];

const imageFiles = [
  "images/background1.jpg",
  "images/battlecruiser2.png",
  "images/asteroid1.png",
  "images/missile.png",
  "images/smoke.png",
  "images/fire.png",
  "images/laser.png",
  "images/smoke1.png",
  "images/wizard-fire.png",
  "images/livesDisplay.png",
  "images/fireball.png",
  "images/hyperspace.png",
  "images/energyBallBlue.png",
  "images/energyBallYellowFlash.png",
  "images/energyBallYellow.png",
  "images/explosion.png",
  "images/spinning-asteroid-3.png",
  "images/spinning-asteroid-6.png",
  "images/spinning-asteroid-9.png",
  "images/spinning-asteroid-8.png",
  "images/saucersquare.png",
  "images/shield_field.png",
];

window.game = {
  idbKeyval: idbKeyval,
  Howl: Howl,
  Howler: Howler,
  baseUrl: import.meta.env.BASE_URL,
  isDev: !!import.meta.env.DEV,
  images: {},
  screens: {},
  status: {
    preloadRequest: 0,
    preloadComplete: 0,
  },
  particles: [],
  objectNames: 0,
  BULLET_INTERVAL: 200,
  bulletIntervalCountdown: 200,
  score: 0,
  displayDistances: false,
  level: 1,
  lives: 3,
  teleports: 3,
  lifeBonusCounter: 10000,
  LIFE_BONUS_COUNTER_RESET: 10000,
  hasExploded: 1,
  controls: {},
  attractMode: false,
  saucerAppearCounter: 4000,
  SAUCER_APPEAR_COUNTER_RESET: 4000,
  putSaucerIntoPlay: false,
  saucerInPlay: false,
  shipWidth: 84,
  shipHeight: 67,
  shield: {
    count: 2,
    time: 0,
  },
};

function withBase(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function loadScript(path) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = withBase(path);
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed loading script: ${path}`));
    document.head.appendChild(script);
  });
}

function preloadImage(path) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      window.game.images[path] = image;
      window.game.status.preloadComplete += 1;
      resolve();
    };
    image.onerror = () => reject(new Error(`Failed preloading image: ${path}`));
    image.src = withBase(path);
  });
}

async function boot() {
  for (const scriptFile of scriptFiles) {
    await loadScript(scriptFile);
  }

  window.game.status.preloadRequest = imageFiles.length;
  await Promise.all(imageFiles.map(preloadImage));

  if (!window.game.game || typeof window.game.game.init !== "function") {
    throw new Error("Game init function was not found after script load");
  }

  window.game.game.init();
}

window.addEventListener("load", () => {
  boot().catch((error) => {
    console.error(error);
  });
});
