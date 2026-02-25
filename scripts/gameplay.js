game.screens["game-play"] = (function () {
  "use strict";

  var lastTime = 0,
    canvas = null,
    background = null,
    elapsedTime = 0,
    start = 0,
    cancelNextRequest = false,
    myKeyboard = game.input.Keyboard(),
    numAsteroids = 3,
    graphics = game.Graphics("asteroids"),
    spaceship = game.spaceship(),
    saucerBig = game.saucer(),
    saucerSmall = game.saucer(),
    asteroidsInPlay = [],
    bulletsInPlay = [],
    alienBulletsInPlay = [],
    alienFireTimer = 4000,
    saucerToggle = "big",
    hasRespawned = true,
    shield = null,
    sheildTimer = 10000,
    rechargeRatio = 0,
    sessionCore = null;

  function validatePlayerName(name) {
    if (typeof name !== "string") {
      return "Anonymous";
    }

    var trimmed = name.trim().slice(0, 24);
    var cleaned = trimmed.replace(/[^a-zA-Z0-9 _.-]/g, "");

    if (cleaned.length === 0) {
      return "Anonymous";
    }

    return cleaned;
  }

  function gameLoop(time) {
    var i = 0;

    // Update timers
    elapsedTime = time - lastTime;
    lastTime = time;

    // Update universal variables
    myKeyboard.update(elapsedTime);
    spaceship.update(elapsedTime);
    game.bulletIntervalCountdown -= elapsedTime;

    var saucerLifecycle = sessionCore.handleSaucerLifecycle({
      elapsedTime: elapsedTime,
      saucerBig: saucerBig,
      saucerSmall: saucerSmall,
      bulletsInPlay: bulletsInPlay,
      alienBulletsInPlay: alienBulletsInPlay,
      spaceship: spaceship,
      alienFireTimer: alienFireTimer,
      saucerToggle: saucerToggle,
      bigSaucerFireDelay: 3000,
      smallSaucerFireDelay: 4000,
    });
    alienFireTimer = saucerLifecycle.alienFireTimer;
    saucerToggle = saucerLifecycle.saucerToggle;

    // Update the shield time
    if (game.shield.count > 0 && game.shield.time > 0) {
      game.shield.time -= elapsedTime;
      shield.setCoordinates(spaceship.coordinates.x, spaceship.coordinates.y);
      shield.setRotation(spaceship.rotation());
    } else {
      sheildTimer -= elapsedTime;
    }

    sessionCore.processCollisionsAndCleanup({
      spaceship: spaceship,
      asteroidsInPlay: asteroidsInPlay,
      bulletsInPlay: bulletsInPlay,
      alienBulletsInPlay: alienBulletsInPlay,
      canvasName: "asteroids",
    });

    sessionCore.updateDynamicObjects({
      elapsedTime: elapsedTime,
      asteroidsInPlay: asteroidsInPlay,
      bulletsInPlay: bulletsInPlay,
      alienBulletsInPlay: alienBulletsInPlay,
    });

    spaceship.updateTeleportTimer(elapsedTime);

    // Drawing section
    graphics.clear();
    background.draw();

    sessionCore.drawDynamicObjects({
      asteroidsInPlay: asteroidsInPlay,
      bulletsInPlay: bulletsInPlay,
      alienBulletsInPlay: alienBulletsInPlay,
      saucerBig: saucerBig,
      saucerSmall: saucerSmall,
    });

    // if(spaceship.coordinates.toBeDeleted === true && game.shield.count > 0 && game.shield.time > 0) {
    //     spaceship.coordinates.toBeDeleted = false;
    //     --game.shield.count;
    // }

    //draw spaceship
    if (!spaceship.coordinates.toBeDeleted) {
      spaceship.draw();
      hasRespawned = true;

      if (game.shield.count > 0 && game.shield.time > 0) {
        shield.draw();
      }
    } else {
      game.audio.play("shipExplosion");
      if (game.lives > 0) {
        spaceship.respawn(elapsedTime, asteroidsInPlay, hasRespawned);
        game.particles.push(
          particleSystem(
            {
              image: game.images["images/explosion.png"],
              center: {
                x: spaceship.coordinates.x,
                y: spaceship.coordinates.y,
              },
              speed: { mean: 1.25, stdev: 0.25 },
              lifetime: { mean: 1000, stdev: 50 },
              direction: Random.nextDouble(),
            },
            graphics,
          ),
        );

        if (hasRespawned) {
          hasRespawned = false;

          for (i = 0; i < 100; ++i) {
            game.particles[game.particles.length - 1].create(
              false,
              false,
              Random.nextDoubleRange(-Math.PI, Math.PI),
              Random.nextGaussian(30, 15),
            );
          }
        }
      } else {
        // Clear the board (reset game)
        bulletsInPlay.length = 0;
        asteroidsInPlay.length = 0;
        alienBulletsInPlay.length = 0;
        game.particles.length = 0;

        spaceship.coordinates.toBeDeleted = false;
        spaceship.coordinates.x = 960;
        spaceship.coordinates.y = 540;
        myKeyboard.clearQueue();

        initializeSpaceship();

        for (i = 0; i < numAsteroids; i++) {
          game.generateAnAsteroid(
            3,
            game.generateRandomAsteroidLocation(spaceship),
            "asteroids",
            asteroidsInPlay,
          );
        }

        var name = prompt(
          "GAME OVER!!!\nScore: " + game.score + "\nPlease enter your name:",
        );

        game.storage
          .addHighScore({
            name: validatePlayerName(name),
            score: +game.score,
          })
          .then(function () {
            game.screens["high-scores"].run();
          })
          .catch(function () {
            // There was a local storage error of some sort
            // console.log('Could not save high score');
          });

        game.score = 0;
        game.level = 1;
        game.teleports = 3;
        game.lives = 3;
        game.saucerAppearCounter = game.SAUCER_APPEAR_COUNTER_RESET;
        game.putSaucerIntoPlay = false;
        game.saucerInPlay = false;
        game.hasPausedGame = false;
        game.resumeGameplay = false;
        saucerSmall.active = false;
        saucerBig.active = false;

        game.game.showScreen("high-scores");

        // Stop the game loop
        cancelNextRequest = true;
      }
    }

    graphics.renderStats();
    spaceship.drawTeleportRecharge();

    if (sheildTimer < 0) {
      rechargeRatio = 1;
    } else {
      rechargeRatio = (10000 - sheildTimer) / 10000;
    }

    graphics.drawSheildRecharge(rechargeRatio);

    if (game.displayDistances) {
      game.findSafeLocation(true, spaceship, asteroidsInPlay);
    }

    if (!cancelNextRequest) {
      requestAnimationFrame(gameLoop);
    }
  }

  function teleport() {
    spaceship.teleport(asteroidsInPlay);
  }

  function fire() {
    spaceship.fireMissile(bulletsInPlay);
  }

  function activateShield() {
    if (sheildTimer < 0) {
      sheildTimer = 10000;
      game.shield.count = 2;
      game.shield.time = 10000 + elapsedTime;
    }
  }

  function attachHandlers() {
    myKeyboard.clearHandlers();

    // Create the keyboard input handler and register the keyboard commands
    myKeyboard.registerCommand(game.controls.accel, function (time) {
      spaceship.moveUp(time);
      spaceship.generateParticles();
    });
    myKeyboard.registerCommand(game.controls.safe, game.toggleGraph);
    myKeyboard.registerCommand(game.controls.tele, teleport);
    myKeyboard.registerCommand(game.controls.left, spaceship.rotateLeft);
    myKeyboard.registerCommand(game.controls.right, spaceship.rotateRight);
    myKeyboard.registerCommand(game.controls.fire, fire);
    myKeyboard.registerCommand(game.controls.shield, activateShield);
    myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
      // Stop the game loop by canceling the request for the next animation frame
      cancelNextRequest = true;
      game.hasPausedGame = true;
      game.resumeGameplay = false;

      // Then, return to the main menu
      game.game.showScreen("main-menu");
    });
  }

  function initializeSpaceship() {
    spaceship.init({
      image: game.images["images/battlecruiser2.png"],
      center: { x: 960, y: 540 },
      width: game.shipWidth,
      height: game.shipHeight,
      rotation: 0,
      moveRate: 23,
      rotateRate: Math.PI,
      startVector: { x: 0, y: 0 },
      initialRotation: 0,
      lifetime: null,
      asteroidClass: null,
    });
  }

  function initialize() {
    canvas = document.getElementById("asteroids");

    initializeSpaceship();

    saucerBig.init({
      image: game.images["images/saucersquare.png"],
      center: { x: 0, y: 0 },
      width: 111,
      height: 95,
      rotation: 0,
      moveRate: Random.nextGaussian(40, 10), // pixels per second
      rotateRate: Math.PI, // Radians per second
      startVector: { x: 0, y: 0 },
      initialRotation: 0,
      lifetime: null,
      pointValue: 100,
      asteroidClass: null,
    });

    saucerSmall.init({
      image: game.images["images/saucersquare.png"],
      center: { x: 0, y: 0 },
      width: 55,
      height: 47,
      rotation: 0,
      moveRate: Random.nextGaussian(40, 10), // pixels per second
      rotateRate: Math.PI, // Radians per second
      startVector: { x: 0, y: 0 },
      initialRotation: 0,
      lifetime: null,
      pointValue: 100,
      asteroidClass: null,
    });

    for (var i = 0; i < numAsteroids; i++) {
      game.generateAnAsteroid(
        3,
        game.generateRandomAsteroidLocation(spaceship),
        "asteroids",
        asteroidsInPlay,
      );
    }

    background = graphics.Background({
      image: game.images["images/background1.jpg"],
      center: {
        x: Math.floor(canvas.width / 2),
        y: Math.floor(canvas.height / 2),
      },
      width: canvas.width,
      height: canvas.height,
    });

    shield = graphics.Texture({
      image: game.images["images/shield_field.png"],
      center: { x: spaceship.coordinates.x, y: spaceship.coordinates.y },
      width: 151,
      height: 142,
      rotation: 0,
      moveRate: Random.nextGaussian(40, 10), // pixels per second
      rotateRate: Math.PI, // Radians per second
      startVector: { x: 0, y: 0 },
      initialRotation: 0,
      lifetime: null,
      pointValue: 0,
      asteroidClass: null,
    });

    sessionCore = game.createSessionCore({
      graphics: graphics,
      playShipExplosion: function () {
        game.audio.play("shipExplosion");
      },
    });
  }

  function resetSessionState() {
    var i = 0;

    bulletsInPlay.length = 0;
    asteroidsInPlay.length = 0;
    alienBulletsInPlay.length = 0;
    game.particles.length = 0;

    game.score = 0;
    game.level = 1;
    game.teleports = 3;
    game.lives = 3;
    game.saucerAppearCounter = game.SAUCER_APPEAR_COUNTER_RESET;
    game.putSaucerIntoPlay = false;
    game.saucerInPlay = false;
    game.hasExploded = 1;

    game.shield.count = 2;
    game.shield.time = 0;
    sheildTimer = 10000;
    rechargeRatio = 0;
    alienFireTimer = 4000;
    saucerToggle = "big";
    hasRespawned = true;

    saucerSmall.active = false;
    saucerBig.active = false;

    initializeSpaceship();

    for (i = 0; i < numAsteroids; i++) {
      game.generateAnAsteroid(
        3,
        game.generateRandomAsteroidLocation(spaceship),
        "asteroids",
        asteroidsInPlay,
      );
    }
  }

  function run() {
    var shouldResume = game.hasPausedGame === true && game.resumeGameplay === true;

    attachHandlers();
    myKeyboard.clearQueue();

    if (shouldResume) {
      game.resumeGameplay = false;
    } else {
      game.hasPausedGame = false;
      game.resumeGameplay = false;
      resetSessionState();
    }

    start = performance.now();
    lastTime = start;
    cancelNextRequest = false;
    requestAnimationFrame(gameLoop);
  }

  return {
    initialize: initialize,
    run: run,
  };
})();
