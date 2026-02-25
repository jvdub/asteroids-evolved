game.audio = (function () {
  "use strict";

  var registry = {};
  var initialized = false;

  function withBase(path) {
    if (typeof game.baseUrl === "string") {
      return game.baseUrl + path;
    }

    return path;
  }

  function createSound(name, path, options) {
    if (!game.Howl) {
      return;
    }

    registry[name] = new game.Howl({
      src: [withBase(path)],
      preload: true,
      volume:
        options && typeof options.volume === "number" ? options.volume : 1,
    });
  }

  function ensureInitialized() {
    if (initialized) {
      return;
    }

    initialized = true;

    createSound("laser", "sounds/laserGun.mp3", { volume: 0.45 });
    createSound("blast", "sounds/blast.mp3", { volume: 0.65 });
    createSound("shipExplosion", "sounds/shipExplosion.mp3", { volume: 0.8 });
  }

  function get(name) {
    ensureInitialized();
    return registry[name] || null;
  }

  function play(name) {
    var sound = get(name);
    if (!sound) {
      return null;
    }

    return sound.play();
  }

  function stop(name) {
    var sound = get(name);
    if (!sound) {
      return;
    }

    sound.stop();
  }

  function setVolume(name, value) {
    if (name === "master") {
      if (game.Howler && typeof game.Howler.volume === "function") {
        game.Howler.volume(value);
      }
      return;
    }

    var sound = get(name);
    if (!sound) {
      return;
    }

    sound.volume(value);
  }

  ensureInitialized();

  return {
    play: play,
    stop: stop,
    setVolume: setVolume,
    get: get,
  };
})();
