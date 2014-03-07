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
        spaceShip = null;

    function gameLoop(time) {
        // Update timers
        elapsedTime = time - lastTime;
        lastTime = time;
        totalTime = time - start;

        // Update universal variables
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
        spaceShip.update(elapsedTime);

        game.Graphics.clear();
        background.draw();
        spaceShip.draw();

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
            moveRate : 400,         // pixels per second
            rotateRate : Math.PI   // Radians per second
        });

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