/*jslint browser: true, white: true, plusplus: true */
/*global MYGAME */
game.screens['main-menu'] = (function() {
    'use strict';
    
    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() { game.game.showScreen('game-play'); },
            false);

        document.getElementById('id-instructions').addEventListener(
            'click',
            function() { game.game.showScreen('instructions'); },
            false);

        document.getElementById('id-high-scores').addEventListener(
            'click',
            function() { game.game.showScreen('high-scores'); },
            false);
        
        document.getElementById('id-options').addEventListener(
            'click',
            function() { game.game.showScreen('options'); },
            false);
        
        document.getElementById('id-about').addEventListener(
            'click',
            function() { game.game.showScreen('about'); },
            false);
    }
    
    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }
    
    return {
        initialize : initialize,
        run : run
    };
}());