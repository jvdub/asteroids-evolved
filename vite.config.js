const { defineConfig, loadEnv } = require("vite");
const { VitePWA } = require("vite-plugin-pwa");
const fs = require("node:fs");
const path = require("node:path");

function normalizeBasePath(basePath) {
  if (!basePath || basePath === "/") {
    return "/";
  }

  let normalized = basePath.trim();
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (!normalized.endsWith("/")) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

function copyStaticRuntimeAssets() {
  const runtimeScriptFiles = [
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

  const runtimeImageFiles = [
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

  const runtimeSoundFiles = [
    "sounds/laserGun.mp3",
    "sounds/blast.mp3",
    "sounds/shipExplosion.mp3",
  ];

  return {
    name: "copy-static-runtime-assets",
    closeBundle() {
      const rootDir = process.cwd();
      const distDir = path.join(rootDir, "dist");

      const runtimeFiles = [
        ...runtimeScriptFiles,
        ...runtimeImageFiles,
        ...runtimeSoundFiles,
      ];

      for (const relativeFilePath of runtimeFiles) {
        const sourceFilePath = path.join(rootDir, relativeFilePath);
        const targetFilePath = path.join(distDir, relativeFilePath);

        if (!fs.existsSync(sourceFilePath)) {
          continue;
        }

        fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
        fs.copyFileSync(sourceFilePath, targetFilePath);
      }
    },
  };
}

module.exports = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = normalizeBasePath(env.VITE_BASE_PATH || "/");
  const cacheVersion = env.npm_package_version || "v1";

  return {
    base,
    plugins: [
      copyStaticRuntimeAssets(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        includeAssets: ["pwa-icon.svg"],
        manifest: {
          name: "Asteroids Evolved",
          short_name: "Asteroids",
          description: "A modern take on the Asteroids classic",
          display: "standalone",
          start_url: ".",
          scope: ".",
          background_color: "#000000",
          theme_color: "#000000",
          icons: [
            {
              src: "pwa-icon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any",
            },
            {
              src: "pwa-icon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallback: "index.html",
          globPatterns: ["**/*.{js,css,html,svg,webmanifest,json}"],
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|gif|svg|webp)$/,
              handler: "CacheFirst",
              options: {
                cacheName: `images-${cacheVersion}`,
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: /\.(?:mp3|wav|ogg)$/,
              handler: "CacheFirst",
              options: {
                cacheName: `audio-${cacheVersion}`,
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: /\.(?:js|css)$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: `static-${cacheVersion}`,
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
              },
            },
          ],
        },
      }),
    ],
  };
});
