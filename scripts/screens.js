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

  var eles = {
    accel: null,
    right: null,
    left: null,
    fire: null,
    tele: null,
    shield: null,
    safe: null,
    save: null,
  };

  function getKey(e) {
    game.controls[e.target.id] = +e.keyCode;
    eles[e.target.id].value = KeyCodes[e.keyCode];
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
    eles.save = document.getElementById("controls-save");

    eles.accel.addEventListener("keydown", getKey, false);
    eles.right.addEventListener("keydown", getKey, false);
    eles.left.addEventListener("keydown", getKey, false);
    eles.fire.addEventListener("keydown", getKey, false);
    eles.tele.addEventListener("keydown", getKey, false);
    eles.shield.addEventListener("keydown", getKey, false);
    eles.safe.addEventListener("keydown", getKey, false);

    eles.save.addEventListener(
      "click",
      function () {
        game.storage.saveControls(game.controls).catch(function () {
          // There was a local storage error of some sort
          // console.log('Could not save controls');
        });
      },
      false,
    );

    document.getElementById("id-options-back").addEventListener(
      "click",
      function () {
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
    eles.accel.value = KeyCodes[game.controls.accel];
    eles.right.value = KeyCodes[game.controls.right];
    eles.left.value = KeyCodes[game.controls.left];
    eles.fire.value = KeyCodes[game.controls.fire];
    eles.tele.value = KeyCodes[game.controls.tele];
    eles.shield.value = KeyCodes[game.controls.shield];
    eles.safe.value = KeyCodes[game.controls.safe];
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
