/*jslint browser: true, white: true, plusplus: true */
/*global game */
game.screens['main-menu'] = (function() {
    'use strict';
    
    var self = this,
        lastTime = 0,
        canvas = null,
        background = null,
        elapsedTime = 0,
        start = 0,
        totalTime = 0,
        cancelNextRequest = false;

    function gameLoop(time) {
        var i = 0,
            l = 0;

        // Update timers
        elapsedTime = time - lastTime;
        lastTime = time;
        totalTime = time - start;

        if (totalTime > 1000) {
            game.game.showScreen('attract-mode');
            cancelNextRequest = true;
            game.attractMode = true;
        }

        if (cancelNextRequest === false) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
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