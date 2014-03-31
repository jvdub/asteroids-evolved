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
        numAsteroids = 10;

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
        game.spaceship.update(elapsedTime);
        game.bulletIntervalCountdown -= elapsedTime;

        // collisions
        game.checkAllCollisions();

        // deleting items from arrays
        game.deleteDeadObjects();

        // updating objects
        for (i = 0, l = game.asteroidsInPlay.length; i < l; i++) {
            game.asteroidsInPlay[i].update(elapsedTime);
        }

        for (i = 0, l = game.bulletsInPlay.length; i < l; i++) {
            game.bulletsInPlay[i].update(elapsedTime);
        }

        game.Graphics.clear();
        background.draw();

        for (i = 0, l = game.asteroidsInPlay.length; i < l; i++) {
            game.asteroidsInPlay[i].draw();
        }

        for (i = 0, l = game.bulletsInPlay.length; i < l; i++) {
            game.bulletsInPlay[i].draw();
        }

        if (!game.spaceship.coordinates.toBeDeleted) {
            game.spaceship.draw();
        } else {
            // Clear the board (reset game)
            game.bulletsInPlay.length = 0;
            game.asteroidsInPlay.length = 0;
            game.spaceship.coordinates.toBeDeleted = false;

            game.spaceship.init({
                image: game.images['images/battlecruiser2.png'],
                center: { x: 960, y: 540 },
                width: 127, height: 100,
                rotation: 0,
                moveRate: 23,         // pixels per second
                rotateRate: Math.PI,   // Radians per second
                startVector: { x: 0, y: 0 },
                initialRotation: 0,
                lifetime: null
            });

            for (i = 0; i < numAsteroids; i++) {
                game.generateAnAsteroid(Math.floor(Math.random() * 3 + 1), game.generateRandomAsteroidLocation());
            }

            game.screens['high-scores'].run();

            $.ajax({
                url: '/v1/high-scores',
                type: 'POST',
                data: {
                    name: 'test',
                    score: +game.score
                },
                dataType: 'json'
            });

            game.score = 0;

            // Show the high scores page
            // Possibly replace this with an intermediary page or something
            // to say game over and enter player name to add to high scores?
            game.game.showScreen('high-scores');

            // Stop the game loop
            cancelNextRequest = true;
        }

        game.Graphics.renderScore();

        if (game.displayDistances) {
            game.findSafeLocation(true);
        }

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        canvas = document.getElementById('asteroids');

        game.spaceship.init({
            image: game.images['images/battlecruiser2.png'],
            center: { x: 960, y: 540 },
            width: 127, height: 100,
            rotation: 0,
            moveRate: 23,         // pixels per second
            rotateRate: Math.PI,   // Radians per second
            startVector: { x: 0, y: 0 },
            initialRotation: 0,
            lifetime: null
        });

        for (var i = 0; i < 3; i++) {
            game.generateAnAsteroid(Math.floor(Math.random() * 3 + 1), game.generateRandomAsteroidLocation());
        }

        // Create the keyboard input handler and register the keyboard commands
        myKeyboard.registerCommand(KeyEvent.DOM_VK_W, function (time) {
            game.spaceship.moveUp(time);
            game.spaceship.generateParticles();
        });
        myKeyboard.registerCommand(KeyEvent.DOM_VK_P, game.toggleGraph);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_T, game.spaceship.teleport);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_A, game.spaceship.rotateLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_D, game.spaceship.rotateRight);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, game.spaceship.fireMissile);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;

            // Then, return to the main menu
            game.game.showScreen('main-menu');
        });

        background = game.Graphics.Background({
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