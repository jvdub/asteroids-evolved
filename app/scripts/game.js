game.game = (function () {
    'use strict';

    function showScreen(id) {
        var screen = 0,
            screens = null;
        //
        // Remove the active state from all screens.  There should only be one...
        screens = document.getElementsByClassName('active');
        for (screen = 0; screen < screens.length; screen ++) {
            screens[screen].classList.remove('active');
        }
        //
        // Tell the screen to start actively running
        game.screens[id].run();
        //
        // Then, set the new screen to be active
        document.getElementById(id).classList.add('active');
    }

    function init() {
        var screen = null;
        for (screen in game.screens) {
            if (game.screens.hasOwnProperty(screen)) {
                // console.log(screen);
                game.screens[screen].initialize();
            }
        }

        showScreen('main-menu');
    }

    return {
        init: init,
        showScreen: showScreen
    };
}());

// Check if the user clicked on a given object
game.collided = function (a, b) {
    if (Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y)) <= a.radius) {
        return true;
    }

    return false;
};

game.detectCollision = function(a, b) {

    //check if the two objects are within eachother's radius
    //This is not a perfect solution cause most of the objects
    //are not perfectly circular
    if ( Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y)) > (a.radius+b.radius) )
        return false;
    else
        return true;
};

game.findSafeLocation = function() {
    ///////////////////////////////////////////////////////////////////
    // divide the gamearea into a grid and give the squares a score based
    // on how many asteroids are nearby it.

    
    var boxSize = 40;
    var vSplit = 1920/boxSize;
    var hSplit = 1080/boxSize;
    var cellScores = [];

    
    //horizontal
    for (var i = 0; i < hSplit; i++) {
        cellScores[i] = [];
        for (var j = 0; j < vSplit; j++) {
            cellScores[i].push(0);
        }
    }

    //draw grid
    var canvas = document.getElementById('asteroids'),
        context = canvas.getContext('2d');

    context.beginPath();
    //Vertical Lines
    for (var i = 0; i < vSplit; i++) {
        context.moveTo((i*boxSize), 0);
        context.lineTo((i*boxSize), 1080);
    }
    //horizontal
    for (var i = 0; i < hSplit; i++) {
        context.moveTo(0, (i*boxSize));
        context.lineTo(1920, (i*boxSize));
    }
    context.stroke();
};

game.generateAsteroidLocation = function() {
    var coordinates = {
        x: Math.random() * 1920,
        y: Math.random() * 1080
    }

    var radius = 500;

    while(((coordinates.x - 960)*(coordinates.x - 960) + (coordinates.y - 540)*(coordinates.y - 540)) < (radius*radius))
    {
        coordinates.x = Math.random() * 1920;
        coordinates.y = Math.random() * 1080;
    }

    return coordinates;
};