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
        spaceShip = null,
        someTestAsteroids = [];

    function gameLoop(time) {
        // Update timers
        elapsedTime = time - lastTime;
        lastTime = time;
        totalTime = time - start;

        // Update universal variables
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
        spaceShip.update(elapsedTime);
        for(var i=0; i<10; i++) {
            someTestAsteroids[i].update(elapsedTime);
        }

        game.Graphics.clear();
        background.draw();
        spaceShip.draw();
        for(var i=0; i<10; i++) {
            someTestAsteroids[i].draw();
        }

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        canvas = document.getElementById('asteroids');

        spaceShip = game.Graphics.Texture( {
            image : game.images['images/battlecruiser2.png'],
            center : { x : 500, y : 500 },
            width : 200, height : 200,
            rotation : 0,
            moveRate : 10,         // pixels per second
            rotateRate : Math.PI,   // Radians per second
            startVector : {x : 0, y : 0}
        });

        for (var i=0; i<10; i++) {
            someTestAsteroids[i] = game.Graphics.Texture ( {
                image : game.images['images/asteroid1.png'],
                center : { x : Math.random()*1920, y : Math.random()*1080},
                width : 100, height : 100,
                rotation : Random.nextGaussian(3, 2),
                moveRate : Random.nextGaussian(10, 5),         // pixels per second
                rotateRate : Math.PI,   // Radians per second
                startVector : Random.nextCircleVector()
            });
        }

        //
        // Create the keyboard input handler and register the keyboard commands
        myKeyboard.registerCommand(KeyEvent.DOM_VK_W, spaceShip.moveUp);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_Q, spaceShip.rotateLeft);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_E, spaceShip.rotateRight);
        myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
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