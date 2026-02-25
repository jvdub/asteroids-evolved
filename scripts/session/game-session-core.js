(function () {
  "use strict";

  /**
   * Shared per-frame game session helpers used by gameplay and attract mode.
   *
   * Interface:
   * - game.createSessionCore({ graphics, playShipExplosion })
   *   -> { handleSaucerLifecycle, processCollisionsAndCleanup, updateDynamicObjects, drawDynamicObjects }
   *
   * All mode-specific behavior remains outside this module and is injected via
   * function arguments/callbacks.
   */
  game.createSessionCore = function createSessionCore(config) {
    var graphics = config.graphics;
    var playShipExplosion = config.playShipExplosion;

    function createExplosion(center, count, speedMean, speedStdDev) {
      game.particles.push(
        particleSystem(
          {
            image: game.images["images/explosion.png"],
            center: { x: center.x, y: center.y },
            speed: { mean: 1.25, stdev: 0.25 },
            lifetime: { mean: 1000, stdev: 50 },
            direction: Random.nextDouble(),
          },
          graphics,
        ),
      );

      for (var i = 0; i < count; ++i) {
        game.particles[game.particles.length - 1].create(
          false,
          false,
          Random.nextDoubleRange(-Math.PI, Math.PI),
          Random.nextGaussian(speedMean, speedStdDev),
        );
      }
    }

    function handleSaucerHit(saucer, bulletsInPlay, bulletIndex) {
      saucer.coordinates.toBeDeleted = true;
      saucer.active = false;
      bulletsInPlay[bulletIndex].toBeDeleted = true;
      game.saucerInPlay = false;
      if (typeof playShipExplosion === "function") {
        playShipExplosion();
      }

      createExplosion(saucer.coordinates, 50, 30, 15);
    }

    function handleSaucerLifecycle(state) {
      var elapsedTime = state.elapsedTime;
      var saucerBig = state.saucerBig;
      var saucerSmall = state.saucerSmall;
      var bulletsInPlay = state.bulletsInPlay;
      var alienBulletsInPlay = state.alienBulletsInPlay;
      var spaceship = state.spaceship;
      var alienFireTimer = state.alienFireTimer;
      var saucerToggle = state.saucerToggle;
      var bigSaucerFireDelay = state.bigSaucerFireDelay;
      var smallSaucerFireDelay = state.smallSaucerFireDelay;

      if (game.putSaucerIntoPlay) {
        game.saucerInPlay = true;
        game.putSaucerIntoPlay = false;

        if (saucerToggle == "small" || game.score >= 20000) {
          saucerSmall.active = true;
          saucerSmall.reset();
          saucerToggle = "big";
        } else {
          saucerBig.active = true;
          saucerBig.reset();
          saucerToggle = "small";
        }
      }

      if (saucerBig.active) {
        alienFireTimer -= elapsedTime;
        saucerBig.update(elapsedTime);

        if (alienFireTimer < 0 && saucerBig.active) {
          alienFireTimer = bigSaucerFireDelay;
          saucerBig.fireMissile(alienBulletsInPlay, Random.nextCircleVector());
        }

        for (var i = 0, l = bulletsInPlay.length; i < l; i++) {
          if (game.detectCollision(saucerBig.coordinates, bulletsInPlay[i])) {
            handleSaucerHit(saucerBig, bulletsInPlay, i);
          }
        }
      }

      if (saucerSmall.active) {
        alienFireTimer -= elapsedTime;
        saucerSmall.update(elapsedTime);

        if (alienFireTimer < 0 && saucerSmall.active) {
          alienFireTimer = smallSaucerFireDelay;
          saucerSmall.fireMissile(
            alienBulletsInPlay,
            game.getFiringVector(
              saucerSmall.coordinates,
              spaceship.coordinates,
            ),
          );
        }

        for (var i = 0, l = bulletsInPlay.length; i < l; i++) {
          if (game.detectCollision(saucerSmall.coordinates, bulletsInPlay[i])) {
            handleSaucerHit(saucerSmall, bulletsInPlay, i);
          }
        }
      }

      return {
        alienFireTimer: alienFireTimer,
        saucerToggle: saucerToggle,
      };
    }

    function processCollisionsAndCleanup(state) {
      var asteroidsInPlay = state.asteroidsInPlay;

      game.checkAllCollisions(
        state.spaceship,
        asteroidsInPlay,
        state.bulletsInPlay,
        state.alienBulletsInPlay,
      );

      for (var i = 0, l = asteroidsInPlay.length; i < l; ++i) {
        if (asteroidsInPlay[i].toBeDeleted === true) {
          game.particles.push(
            particleSystem(
              {
                image: game.images["images/wizard-fire.png"],
                center: { x: asteroidsInPlay[i].x, y: asteroidsInPlay[i].y },
                speed: { mean: 1.25, stdev: 0.25 },
                lifetime: { mean: 1000, stdev: 50 },
                direction: Random.nextDouble(),
              },
              graphics,
            ),
          );

          for (var j = 0; j < 10 * asteroidsInPlay[i].asteroidClass; ++j) {
            game.particles[game.particles.length - 1].create(
              false,
              false,
              Random.nextDoubleRange(-Math.PI, Math.PI),
              Random.nextGaussian(20, 10),
            );
          }

          game.particles.push(
            particleSystem(
              {
                image: game.images["images/smoke1.png"],
                center: { x: asteroidsInPlay[i].x, y: asteroidsInPlay[i].y },
                speed: { mean: 1.25, stdev: 0.25 },
                lifetime: { mean: 1000, stdev: 50 },
                direction: Random.nextDouble(),
              },
              graphics,
            ),
          );

          for (var k = 0; k < 5 * asteroidsInPlay[i].asteroidClass; ++k) {
            game.particles[game.particles.length - 1].create(
              false,
              false,
              Random.nextDoubleRange(-Math.PI, Math.PI),
              Random.nextGaussian(30, 10),
            );
          }
        }
      }

      game.deleteDeadObjects(
        state.spaceship,
        asteroidsInPlay,
        state.bulletsInPlay,
        state.alienBulletsInPlay,
        state.canvasName,
      );

      if (typeof state.afterCleanup === "function") {
        state.afterCleanup();
      }
    }

    function updateDynamicObjects(state) {
      var elapsedTime = state.elapsedTime;
      var asteroidsInPlay = state.asteroidsInPlay;
      var bulletsInPlay = state.bulletsInPlay;
      var alienBulletsInPlay = state.alienBulletsInPlay;

      for (var i = 0, l = asteroidsInPlay.length; i < l; i++) {
        asteroidsInPlay[i].update(elapsedTime);
      }

      for (var j = 0, k = bulletsInPlay.length; j < k; j++) {
        bulletsInPlay[j].update(elapsedTime);
      }

      for (var p = 0, q = game.particles.length; p < q; ++p) {
        game.particles[p].update(elapsedTime);
      }

      for (var b = 0, m = alienBulletsInPlay.length; b < m; b++) {
        alienBulletsInPlay[b].update(elapsedTime);
      }
    }

    function drawDynamicObjects(state) {
      var asteroidsInPlay = state.asteroidsInPlay;
      var bulletsInPlay = state.bulletsInPlay;
      var alienBulletsInPlay = state.alienBulletsInPlay;
      var saucerBig = state.saucerBig;
      var saucerSmall = state.saucerSmall;

      for (var i = 0, l = game.particles.length; i < l; ++i) {
        game.particles[i].render();
      }

      for (var a = 0, b = asteroidsInPlay.length; a < b; a++) {
        asteroidsInPlay[a].draw();
      }

      for (var j = 0, k = bulletsInPlay.length; j < k; j++) {
        bulletsInPlay[j].draw();
      }

      if (saucerBig.active) {
        saucerBig.draw();
      }

      if (saucerSmall.active) {
        saucerSmall.draw();
      }

      for (var x = 0, y = alienBulletsInPlay.length; x < y; x++) {
        alienBulletsInPlay[x].draw();
      }
    }

    return {
      handleSaucerLifecycle: handleSaucerLifecycle,
      processCollisionsAndCleanup: processCollisionsAndCleanup,
      updateDynamicObjects: updateDynamicObjects,
      drawDynamicObjects: drawDynamicObjects,
    };
  };
})();
