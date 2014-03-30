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
        // Update timers
        elapsedTime = time - lastTime;
        lastTime = time;
        totalTime = time - start;

        // Update universal variables
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
        game.spaceship.update(elapsedTime);
        game.bulletIntervalCountdown -= elapsedTime;
        //collisions
        for (var i=0; i<game.asteroidsInPlay.length; i++) {
            for (var j=0; j<game.bulletsInPlay.length; j++) {
                if (game.detectCollision(game.asteroidsInPlay[i], game.bulletsInPlay[j])) {
                    game.asteroidsInPlay[i].toBeDeleted = true;
                    game.bulletsInPlay[j].toBeDeleted = true;
                }
            }
            //check if ship collided with any asteroid
            if (game.detectCollision(game.spaceship.coordinates, game.asteroidsInPlay[i])) {
                game.spaceship.coordinates.toBeDeleted = true;
            }
        }

        //deleting items from arrays
        var k = 0;
        for (var i=0; i<game.asteroidsInPlay.length; i++) {
            if (!game.asteroidsInPlay[i].toBeDeleted) {
                game.asteroidsInPlay[k] = game.asteroidsInPlay[i];
                k++;
            }
        }
        game.asteroidsInPlay.length = k;
        k = 0;
        for (var i=0; i<game.bulletsInPlay.length; i++) {
            if (!game.bulletsInPlay[i].toBeDeleted) {
                game.bulletsInPlay[k] = game.bulletsInPlay[i];
                k++;
            }
        }
        game.bulletsInPlay.length = k;

        game.findSafeLocation();
        //updating objects
        for (var i=0; i<game.asteroidsInPlay.length; i++) {
            game.asteroidsInPlay[i].update(elapsedTime);
        }
        
        for (var i=0; i<game.bulletsInPlay.length; i++) {
            game.bulletsInPlay[i].update(elapsedTime);
        }

        


        game.Graphics.clear();
        background.draw();
        game.findSafeLocation();
        for (var i=0; i<game.asteroidsInPlay.length; i++) {
            game.asteroidsInPlay[i].draw();
        }
        for (var i=0; i<game.bulletsInPlay.length; i++) {
            game.bulletsInPlay[i].draw();
        }
        if(!game.spaceship.coordinates.toBeDeleted)
            game.spaceship.draw();

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

        for (var i = 0; i < numAsteroids; i++) {
            game.asteroidsInPlay.push( game.Graphics.Texture({
                image: game.images['images/asteroid1.png'],
                // center: { x: Math.random() * 1920, y: Math.random() * 1080 },
                center: game.generateAsteroidLocation(),
                width: 50, height: 50,
                rotation: Random.nextGaussian(3, 2),
                moveRate: Random.nextGaussian(100, 5),         // pixels per second
                rotateRate: Math.PI,   // Radians per second
                startVector: Random.nextCircleVector(),
                initialRotation: 0,
                lifetime: null
            }));
        }

        //
        // Create the keyboard input handler and register the keyboard commands
        myKeyboard.registerCommand(KeyEvent.DOM_VK_W, function (time) {
            game.spaceship.moveUp(time);
            game.spaceship.generateParticles();
        });
        myKeyboard.registerCommand(KeyEvent.DOM_VK_A, game.spaceship.rotateLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_D, game.spaceship.rotateRight);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, game.spaceship.fireMissile);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
            //
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
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