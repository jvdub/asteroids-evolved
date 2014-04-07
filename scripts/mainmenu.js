game.screens['main-menu'] = (function() {
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
        graphics = game.Graphics('menu-canvas'),
        isAttractMode = false,
        asteroidsInPlay = [],
        bulletsInPlay = [],
        canvas = null;

    function gameLoop(time) {
        var i = 0,
            l = 0;

        // Update timers
        elapsedTime = time - lastTime;
        lastTime = time;
        totalTime = time - start;

        if (totalTime > 10000) {
            game.game.showScreen('attract-mode');
            cancelNextRequest = true;
            game.attractMode = true;
        }

        // Drawing section
        graphics.clear();
        background.draw();

        if (cancelNextRequest === false) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        canvas = document.getElementById('menu-canvas');

        background = graphics.Background({
            image: game.images['images/background1.jpg'],
            center: {
                x: Math.floor(canvas.width / 2),
                y: Math.floor(canvas.height / 2)
            },
            width: canvas.width,
            height: canvas.height
        });

        // Setup each of menu events for the screens
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() { cancelNextRequest = true; game.game.showScreen('game-play'); },
            false);

        document.getElementById('id-instructions').addEventListener(
            'click',
            function() { cancelNextRequest = true; game.game.showScreen('instructions'); },
            false);

        document.getElementById('id-high-scores').addEventListener(
            'click',
            function() { cancelNextRequest = true; game.game.showScreen('high-scores'); },
            false);
        
        document.getElementById('id-options').addEventListener(
            'click',
            function() { cancelNextRequest = true; game.game.showScreen('options'); },
            false);
        
        document.getElementById('id-about').addEventListener(
            'click',
            function() { cancelNextRequest = true; game.game.showScreen('about'); },
            false);
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