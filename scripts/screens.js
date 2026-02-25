game.screens["instructions"] = (function () {
  "use strict";

  function initialize() {
    document.getElementById("id-instructions-back").addEventListener(
      "click",
      function () {
        game.game.showScreen("main-menu");
      },
      false,
    );
  }

  function run() {
    //maybe not necessary to have this function
  }

  return {
    initialize: initialize,
    run: run,
  };
})();

game.screens["high-scores"] = (function () {
  "use strict";

  var scoreList;

  function showScores(scores) {
    var i = 0,
      l = 0,
      item = null,
      sortedScores = Array.isArray(scores) ? scores.slice() : [];

    sortedScores.sort(function (a, b) {
      return b.score - a.score;
    });

    while (scoreList.firstChild) {
      scoreList.removeChild(scoreList.firstChild);
    }

    for (i = 0, l = sortedScores.length; i < 10 && i < l; ++i) {
      item = document.createElement("li");
      item.textContent = sortedScores[i].score + " - " + sortedScores[i].name;
      scoreList.appendChild(item);
    }
  }

  function initialize() {
    scoreList = document.getElementById("scores-list");

    document.getElementById("id-high-scores-back").addEventListener(
      "click",
      function () {
        game.game.showScreen("main-menu");
      },
      false,
    );
  }

  function run() {
    game.storage
      .getHighScores()
      .then(function (rslt) {
        showScores(rslt || []);
      })
      .catch(function () {
        // There was a local storage error of some sort
        // console.log('Could not load high scores');
      });
  }

  return {
    initialize: initialize,
    run: run,
  };
})();

game.screens["options"] = (function () {
  "use strict";

  var controlNames = [
    "accel",
    "right",
    "left",
    "fire",
    "tele",
    "shield",
    "safe",
  ];
  var eles = {
    accel: null,
    right: null,
    left: null,
    fire: null,
    tele: null,
    shield: null,
    safe: null,
    bind: {},
  };
  var activeControl = null;

  function getKeyLabel(keyCode) {
    return KeyCodes[keyCode] || "Key " + keyCode;
  }

  function updateControlLabels() {
    var i = 0;

    for (i = 0; i < controlNames.length; i++) {
      eles[controlNames[i]].value = getKeyLabel(game.controls[controlNames[i]]);
    }
  }

  function stopCapture() {
    if (!activeControl) {
      return;
    }

    eles.bind[activeControl].textContent = "Bind";
    eles.bind[activeControl].classList.remove("is-capturing");
    eles.bind[activeControl].removeAttribute("aria-pressed");
    eles.bind[activeControl].removeAttribute("aria-live");
    window.removeEventListener("keydown", captureKeyPress, true);
    activeControl = null;
  }

  function captureKeyPress(e) {
    var keyCode = +(e.keyCode || e.which);

    if (!activeControl || !keyCode) {
      return;
    }

    game.controls[activeControl] = keyCode;
    eles[activeControl].value = getKeyLabel(keyCode);
    game.storage.saveControls(game.controls).catch(function () {
      // There was a local storage error of some sort
      // console.log('Could not save controls');
    });

    e.stopPropagation();
    e.preventDefault();

    stopCapture();
  }

  function beginCapture(controlName) {
    stopCapture();
    activeControl = controlName;
    eles.bind[controlName].textContent = "Press key";
    eles.bind[controlName].classList.add("is-capturing");
    eles.bind[controlName].setAttribute("aria-pressed", "true");
    eles.bind[controlName].setAttribute("aria-live", "polite");
    window.addEventListener("keydown", captureKeyPress, true);
  }

  function onBindButtonClick(e) {
    var controlName = e.currentTarget.getAttribute("data-control");

    if (!controlName) {
      return;
    }

    beginCapture(controlName);
    e.stopPropagation();
    e.preventDefault();
  }

  function initialize() {
    eles.accel = document.getElementById("accel");
    eles.right = document.getElementById("right");
    eles.left = document.getElementById("left");
    eles.fire = document.getElementById("fire");
    eles.tele = document.getElementById("tele");
    eles.shield = document.getElementById("shield");
    eles.safe = document.getElementById("safe");

    eles.bind.accel = document.getElementById("bind-accel");
    eles.bind.right = document.getElementById("bind-right");
    eles.bind.left = document.getElementById("bind-left");
    eles.bind.fire = document.getElementById("bind-fire");
    eles.bind.tele = document.getElementById("bind-tele");
    eles.bind.shield = document.getElementById("bind-shield");
    eles.bind.safe = document.getElementById("bind-safe");

    eles.bind.accel.setAttribute("data-control", "accel");
    eles.bind.right.setAttribute("data-control", "right");
    eles.bind.left.setAttribute("data-control", "left");
    eles.bind.fire.setAttribute("data-control", "fire");
    eles.bind.tele.setAttribute("data-control", "tele");
    eles.bind.shield.setAttribute("data-control", "shield");
    eles.bind.safe.setAttribute("data-control", "safe");

    eles.bind.accel.addEventListener("click", onBindButtonClick, false);
    eles.bind.right.addEventListener("click", onBindButtonClick, false);
    eles.bind.left.addEventListener("click", onBindButtonClick, false);
    eles.bind.fire.addEventListener("click", onBindButtonClick, false);
    eles.bind.tele.addEventListener("click", onBindButtonClick, false);
    eles.bind.shield.addEventListener("click", onBindButtonClick, false);
    eles.bind.safe.addEventListener("click", onBindButtonClick, false);

    document.getElementById("id-options-back").addEventListener(
      "click",
      function () {
        stopCapture();
        game.storage
          .getControls()
          .then(function (rslt) {
            game.controls = rslt;
          })
          .catch(function () {
            // There was a local storage error of some sort
            // console.log('Could not load controls');
          });

        game.game.showScreen("main-menu");
      },
      false,
    );
  }

  function run() {
    stopCapture();
    updateControlLabels();
  }

  return {
    initialize: initialize,
    run: run,
  };
})();

game.screens["about"] = (function () {
  "use strict";

  function initialize() {
    document.getElementById("id-about-back").addEventListener(
      "click",
      function () {
        game.game.showScreen("main-menu");
      },
      false,
    );
  }

  function run() {
    //
    //maybe not necessary to have this function
  }

  return {
    initialize: initialize,
    run: run,
  };
})();
