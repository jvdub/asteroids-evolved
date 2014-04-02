game.screens['game-play'] = (function () {
    'use strict';

    var self = this,
        lastTime = 0,
        canvas = null,
        background = null,
        mouseCapture = false,
        myMouse = null,
        elapsedTime = 0,
        start = 0,
        totalTime = 0,
        cancelNextRequest = false,
        myKeyboard = game.input.Keyboard(),
        someTestAsteroids = {},
        numAsteroids = 5,
        graphics = game.Graphics('asteroids'),
        spaceship = game.spaceship(),
        asteroidsInPlay = [],
        bulletsInPlay = [];

    function gameLoop(time) {
        var i = 0,
            l = 0;

        // Update timers
        elapsedTime = time - lastTime;
        lastTime = time;
        totalTime = time - start;

        // Update universal variables
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
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
        game.deleteDeadObjects(spaceship, asteroidsInPlay, bulletsInPlay);

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
        }
        else {
            if (game.lives > 0) {
                spaceship.respawn(elapsedTime);
                game.particles.push(
                        particleSystem({
                            image: game.images['images/explosion.png'],
                            center: { x: spaceship.coordinates.x, y: spaceship.coordinates.y },
                            speed: { mean: 1.25, stdev: 0.25 },
                            lifetime: { mean: 1000, stdev: 50 },
                            direction: Random.nextDouble()
                        }, graphics)
                    );

                for (i = 0; i < 20; ++i) {
                    game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(30, 15));
                }
            }
            else {// Clear the board (reset game)
                bulletsInPlay.length = 0;
                asteroidsInPlay.length = 0;
                game.particles.length = 0;
                spaceship.coordinates.toBeDeleted = false;
                myKeyboard.clearQueue();

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
                });

                for (i = 0; i < numAsteroids; i++) {
                    game.generateAnAsteroid(3, game.generateRandomAsteroidLocation(spaceship));
                }

                var name = prompt('GAME OVER!!!\nScore: ' + game.score + '\nPlease enter your name:');

                game.screens['high-scores'].run();

                $.ajax({
                    url: '/v1/high-scores',
                    type: 'POST',
                    data: {
                        name: name,
                        score: +game.score
                    },
                    dataType: 'json'
                });

                game.score = 0;
                game.level = 1;
                game.teleports = 3;
                game.lives = 3;

                game.game.showScreen('high-scores');

                // Stop the game loop
                cancelNextRequest = true;
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
        myKeyboard.registerCommand(game.controls.fire, spaceship.fireMissile);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;

            // Then, return to the main menu
            game.game.showScreen('main-menu');
        });
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
        });

        for (var i = 0; i < numAsteroids; i++) {
            game.generateAnAsteroid(3, game.generateRandomAsteroidLocation(spaceship), false, asteroidsInPlay);
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

        myMouse = game.input.Mouse();
        myMouse.registerCommand('mousedown', function (e, elapsedTime) {
            mouseCapture = true;
        });
        myMouse.registerCommand('mouseup', function (e, elapsedTime) {
            mouseCapture = false;
        });
        myMouse.registerCommand('mousemove', function (e, elapsedTime) {

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