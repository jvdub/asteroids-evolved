game.storage = (function () {
  "use strict";

  var SCHEMA_VERSION = 1;
  var MAX_HIGH_SCORES = 50;
  var SCHEMA_KEY = "asteroids.storage.schemaVersion";
  var CONTROLS_KEY = "asteroids.storage.controls";
  var HIGH_SCORES_KEY = "asteroids.storage.highScores";
  var memoryStore = {};
  var persistenceWarningShown = false;
  var runtimeStatus = {
    readMode: "unknown",
    writeMode: "unknown",
    writeDegraded: false,
  };
  var LEGACY_CONTROL_KEYS = ["controls", "game.controls", "asteroids.controls"];
  var LEGACY_SCORE_KEYS = [
    "scores",
    "highScores",
    "game.highScores",
    "asteroids.highScores",
  ];
  var CONTROL_FIELDS = [
    "accel",
    "right",
    "left",
    "tele",
    "safe",
    "fire",
    "shield",
  ];
  var DEFAULT_CONTROLS = {
    accel: 87,
    right: 68,
    left: 65,
    tele: 84,
    safe: 80,
    fire: 32,
    shield: 83,
  };

  function hasLocalStorage() {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      return !!window.localStorage;
    } catch (error) {
      logDev("localStorage access unavailable", error);
      return false;
    }
  }

  function hasIndexedDbAdapter() {
    return (
      game.idbKeyval &&
      typeof game.idbKeyval.get === "function" &&
      typeof game.idbKeyval.set === "function"
    );
  }

  function parseLocalValue(rawValue) {
    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch (error) {
      return null;
    }
  }

  function readLegacyLocalStorage(keys) {
    if (!hasLocalStorage()) {
      return null;
    }

    for (var index = 0; index < keys.length; index++) {
      var value = parseLocalValue(window.localStorage.getItem(keys[index]));
      if (value !== null) {
        return value;
      }
    }

    return null;
  }

  async function getFromAdapter(key) {
    if (hasIndexedDbAdapter()) {
      try {
        var idbValue = await game.idbKeyval.get(key);
        runtimeStatus.readMode = "indexeddb";
        return idbValue;
      } catch (error) {
        logDev("IndexedDB read failed for key", key, error);
      }
    }

    if (hasLocalStorage()) {
      try {
        runtimeStatus.readMode = "localStorage";
        return parseLocalValue(window.localStorage.getItem(key));
      } catch (error) {
        logDev("localStorage read failed for key", key, error);
      }
    }

    if (Object.prototype.hasOwnProperty.call(memoryStore, key)) {
      runtimeStatus.readMode = "memory";
      return memoryStore[key];
    }

    runtimeStatus.readMode = "memory";

    return null;
  }

  async function setInAdapter(key, value) {
    if (hasIndexedDbAdapter()) {
      try {
        await game.idbKeyval.set(key, value);
        runtimeStatus.writeMode = "indexeddb";
        runtimeStatus.writeDegraded = false;
        return;
      } catch (error) {
        logDev("IndexedDB write failed for key", key, error);
      }
    }

    if (hasLocalStorage()) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        runtimeStatus.writeMode = "localStorage";
        runtimeStatus.writeDegraded = false;
        return;
      } catch (error) {
        logDev("localStorage write failed for key", key, error);
      }
    }

    memoryStore[key] = value;
    runtimeStatus.writeMode = "memory";
    runtimeStatus.writeDegraded = true;
    notifyPersistenceWarning();
  }

  function notifyPersistenceWarning() {
    if (persistenceWarningShown || typeof document === "undefined") {
      return;
    }

    persistenceWarningShown = true;

    var root = document.getElementById("game") || document.body;
    if (!root) {
      return;
    }

    var banner = document.createElement("div");
    banner.className = "storage-warning";
    banner.textContent =
      "Storage is unavailable. Progress is temporary for this session.";
    root.appendChild(banner);

    if (
      typeof window !== "undefined" &&
      typeof window.setTimeout === "function"
    ) {
      window.setTimeout(function () {
        if (banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
      }, 5000);
    }
  }

  function normalizeControls(candidate) {
    var normalized = {};
    var source = candidate && typeof candidate === "object" ? candidate : {};

    CONTROL_FIELDS.forEach(function (field) {
      var value = source[field];
      if (typeof value === "number" && Number.isFinite(value)) {
        normalized[field] = Math.trunc(value);
      } else {
        normalized[field] = DEFAULT_CONTROLS[field];
      }
    });

    return normalized;
  }

  function normalizeName(name) {
    if (typeof name !== "string") {
      return "Anonymous";
    }

    var trimmed = name.trim().slice(0, 24);
    var cleaned = trimmed.replace(/[^a-zA-Z0-9 _.-]/g, "");

    return cleaned.length > 0 ? cleaned : "Anonymous";
  }

  function normalizeHighScoreEntry(candidate) {
    if (!candidate || typeof candidate !== "object") {
      return null;
    }

    var parsedScore = Number(candidate.score);
    var score =
      Number.isFinite(parsedScore) && parsedScore >= 0
        ? Math.floor(parsedScore)
        : null;

    if (score === null) {
      return null;
    }

    return {
      name: normalizeName(candidate.name),
      score: score,
      date: typeof candidate.date === "string" ? candidate.date : "",
      time: typeof candidate.time === "string" ? candidate.time : "",
    };
  }

  function sortAndBoundHighScores(entries) {
    var sorted = entries.slice().sort(function (left, right) {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (left.name !== right.name) {
        return left.name.localeCompare(right.name);
      }

      if (left.date !== right.date) {
        return left.date.localeCompare(right.date);
      }

      return left.time.localeCompare(right.time);
    });

    return sorted.slice(0, MAX_HIGH_SCORES);
  }

  function normalizeHighScores(candidate) {
    if (!Array.isArray(candidate)) {
      return [];
    }

    var normalized = candidate
      .map(normalizeHighScoreEntry)
      .filter(function (entry) {
        return entry !== null;
      });

    return sortAndBoundHighScores(normalized);
  }

  async function readSchemaVersion() {
    var value = await getFromAdapter(SCHEMA_KEY);
    var numericValue = Number(value);

    return Number.isFinite(numericValue) ? Math.floor(numericValue) : 0;
  }

  async function migrateToCurrentSchema() {
    var controls = await getFromAdapter(CONTROLS_KEY);
    var highScores = await getFromAdapter(HIGH_SCORES_KEY);

    if (controls === null) {
      controls = readLegacyLocalStorage(LEGACY_CONTROL_KEYS);
    }

    if (highScores === null) {
      highScores = readLegacyLocalStorage(LEGACY_SCORE_KEYS);
    }

    await setInAdapter(CONTROLS_KEY, normalizeControls(controls));
    await setInAdapter(HIGH_SCORES_KEY, normalizeHighScores(highScores));
    await setInAdapter(SCHEMA_KEY, SCHEMA_VERSION);

    return {
      controls: await getFromAdapter(CONTROLS_KEY),
      highScores: await getFromAdapter(HIGH_SCORES_KEY),
    };
  }

  var schemaReadyPromise = null;

  function ensureSchemaReady() {
    if (!schemaReadyPromise) {
      schemaReadyPromise = (async function () {
        var schemaVersion = await readSchemaVersion();

        if (schemaVersion !== SCHEMA_VERSION) {
          logDev(
            "Migrating storage schema",
            "from",
            schemaVersion,
            "to",
            SCHEMA_VERSION,
          );
          await migrateToCurrentSchema();
        }
      })().catch(function (error) {
        schemaReadyPromise = Promise.resolve();
        runtimeStatus.writeMode = "memory";
        runtimeStatus.writeDegraded = true;
        notifyPersistenceWarning();
        logDev("Schema initialization degraded to memory", error);
      });
    }

    return schemaReadyPromise;
  }

  async function getControls() {
    try {
      await ensureSchemaReady();
    } catch (error) {
      logDev("Schema ready check failed during getControls", error);
    }
    var controls = await getFromAdapter(CONTROLS_KEY);
    var normalized = normalizeControls(controls);

    if (JSON.stringify(normalized) !== JSON.stringify(controls)) {
      await setInAdapter(CONTROLS_KEY, normalized);
    }

    return normalized;
  }

  async function saveControls(candidate) {
    try {
      await ensureSchemaReady();
    } catch (error) {
      logDev("Schema ready check failed during saveControls", error);
    }
    var normalized = normalizeControls(candidate);
    await setInAdapter(CONTROLS_KEY, normalized);
    return normalized;
  }

  async function getHighScores() {
    try {
      await ensureSchemaReady();
    } catch (error) {
      logDev("Schema ready check failed during getHighScores", error);
    }
    var highScores = await getFromAdapter(HIGH_SCORES_KEY);
    var normalized = normalizeHighScores(highScores);

    if (JSON.stringify(normalized) !== JSON.stringify(highScores || [])) {
      await setInAdapter(HIGH_SCORES_KEY, normalized);
    }

    return normalized;
  }

  async function addHighScore(candidate) {
    try {
      await ensureSchemaReady();
    } catch (error) {
      logDev("Schema ready check failed during addHighScore", error);
    }
    var entry = normalizeHighScoreEntry(candidate);

    if (!entry) {
      throw new Error("Invalid high score entry");
    }

    var scores = await getHighScores();
    scores.push(entry);

    var bounded = sortAndBoundHighScores(scores);
    await setInAdapter(HIGH_SCORES_KEY, bounded);
    return bounded;
  }

  function logDev() {
    if (game.isDev) {
      console.info.apply(console, ["[storage]"].concat(Array.from(arguments)));
    }
  }

  async function runDevChecks() {
    if (!game.isDev) {
      return;
    }

    try {
      var controls = await getControls();
      var highScores = await getHighScores();
      logDev("Controls read success", controls);
      logDev("High score read success", highScores.length, "entries");
    } catch (error) {
      console.error("[storage] Runtime check failed", error);
    }
  }

  runDevChecks();

  return {
    getControls: getControls,
    saveControls: saveControls,
    getHighScores: getHighScores,
    addHighScore: addHighScore,
    constants: {
      schemaVersion: SCHEMA_VERSION,
      maxHighScores: MAX_HIGH_SCORES,
    },
    getRuntimeStatus: function () {
      return {
        readMode: runtimeStatus.readMode,
        writeMode: runtimeStatus.writeMode,
        writeDegraded: runtimeStatus.writeDegraded,
      };
    },
  };
})();
