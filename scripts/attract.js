game.screens['attract-mode'] = (function () {
    'use strict';

    var self = this,
        lastTime = 0,
        canvas = null,
        background = null,
        elapsedTime = 0,
        start = 0,
        totalTime = 0,
        cancelNextRequest = false,
        someTestAsteroids = {},
        numAsteroids = 5,
        graphics = game.Graphics('attract-asteroids'),
        spaceship = game.spaceship(),
        asteroidsInPlay = [],
        bulletsInPlay = [],
        hasRespawned = true;

    function gameLoop(time) {
        var i = 0,
            l = 0;

        // Update timers
        elapsedTime = time - lastTime;
        lastTime = time;
        totalTime = time - start;

        // Update universal variables
        spaceship.update(elapsedTime);
        game.bulletIntervalCountdown -= elapsedTime;

        // collisions
        game.checkAllCollisions(spaceship, asteroidsInPlay, bulletsInPlay);

        for (i = 0, l = asteroidsInPlay.length; i < l; ++i) {
            if (asteroidsInPlay[i].toBeDeleted === true) {
                game.particles.push(
                    particleSystem({
                        image: game.images['images/wizard-fire.png'],
                        center: { x: asteroidsInPlay[i].x, y: asteroidsInPlay[i].y },
                        speed: { mean: 1.25, stdev: 0.25 },
                        lifetime: { mean: 1000, stdev: 50 },
                        direction: Random.nextDouble()
                    }, graphics));
                for (var j = 0; j < (10 * asteroidsInPlay[i].asteroidClass); ++j) {
                    game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(20, 10));
                }
                game.particles.push(
                    particleSystem({
                        image: game.images['images/smoke1.png'],
                        center: { x: asteroidsInPlay[i].x, y: asteroidsInPlay[i].y },
                        speed: { mean: 1.25, stdev: 0.25 },
                        lifetime: { mean: 1000, stdev: 50 },
                        direction: Random.nextDouble()
                    }, graphics)
                );
                for (var j = 0; j < (5 * asteroidsInPlay[i].asteroidClass); ++j) {
                    game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(30, 10));
                }
            }
        }

        // deleting items from arrays
        game.deleteDeadObjects(spaceship, asteroidsInPlay, bulletsInPlay, false);

        // updating objects
        for (i = 0, l = asteroidsInPlay.length; i < l; i++) {
            asteroidsInPlay[i].update(elapsedTime);
        }

        for (i = 0, l = bulletsInPlay.length; i < l; i++) {
            bulletsInPlay[i].update(elapsedTime);
        }

        for (i = 0, l = game.particles.length; i < l; ++i) {
            game.particles[i].update(elapsedTime);
        }

        graphics.clear();
        background.draw();

        for (i = 0, l = game.particles.length; i < l; ++i) {
            game.particles[i].render();
        }

        //drawing asteroids
        for (i = 0, l = asteroidsInPlay.length; i < l; i++) {
            asteroidsInPlay[i].draw();
        }
        //drawing missiles
        for (i = 0, l = bulletsInPlay.length; i < l; i++) {
            bulletsInPlay[i].draw();
        }
        //draw spaceship
        if (!spaceship.coordinates.toBeDeleted) {
            spaceship.draw();
            hasRespawned = true;
        }
        else {
            spaceship.respawn(elapsedTime, asteroidsInPlay, hasRespawned);
            game.particles.push(
                    particleSystem({
                        image: game.images['images/explosion.png'],
                        center: { x: spaceship.coordinates.x, y: spaceship.coordinates.y },
                        speed: { mean: 1.25, stdev: 0.25 },
                        lifetime: { mean: 1000, stdev: 50 },
                        direction: Random.nextDouble()
                    }, graphics)
                );

            if (hasRespawned) {
                hasRespawned = false;

                for (i = 0; i < 100; ++i) {
                    game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(30, 15));
                }
            }
        }

        graphics.renderStats();

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

    function goToMenu() {
    	document.getElementById('game').removeEventListener('keydown', goToMenu);
        	document.getElementById('game').removeEventListener('mousedown', goToMenu);
        //	document.getElementById('game').removeEventListener('mousemove', goToMenu);
        	cancelNextRequest = true;
        	game.game.showScreen('main-menu');
    }

    function attachHandlers() {
        document.getElementById('game').addEventListener('keydown', goToMenu, false);
        document.getElementById('game').addEventListener('mousedown', goToMenu, false);
        // document.getElementById('game').addEventListener('mousemove', goToMenu, false);
    }

    function initialize() {
        canvas = document.getElementById('asteroids');

        spaceship.init({
            image: game.images['images/battlecruiser2.png'],
            center: { x: 960, y: 540 },
            width: 127, height: 100,
            rotation: 0,
            moveRate: 23,          // pixels per second
            rotateRate: Math.PI,   // Radians per second
            startVector: { x: 0, y: 0 },
            initialRotation: 0,
            lifetime: null,
            asteroidClass: null
        }, true);

        for (var i = 0; i < numAsteroids; i++) {
            game.generateAnAsteroid(3, game.generateRandomAsteroidLocation(spaceship), true, asteroidsInPlay);
        }

        background = graphics.Background({
            image: game.images['images/background1.jpg'],
            center: {
                x: Math.floor(canvas.width / 2),
                y: Math.floor(canvas.height / 2)
            },
            width: canvas.width,
            height: canvas.height
        });
    }

    function run() {
        attachHandlers();
        start = performance.now();
        lastTime = start;
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };
}());