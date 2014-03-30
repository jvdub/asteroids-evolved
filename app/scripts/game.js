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

game.findSafeLocation = function(asteroids) {
    ///////////////////////////////////////////////////////////////////
    // divide the gamearea into a grid and give the squares a score based
    // on how many asteroids are nearby it.

    
    var boxSize = 40,
        vSplit = 1920/boxSize,
        hSplit = 1080/boxSize,
        cellScores = [],
        asteroidLocations = [],
        x, y,
        safeLocation = {x: 0, y: 0};

    
    //horizontal
    for (var i = 0; i < vSplit; i++) {
        cellScores[i] = [];
        asteroidLocations[i] = [];
        for (var j = 0; j < hSplit; j++) {
            cellScores[i].push(0);
            asteroidLocations[i].push(0);
        }
    }
    // for (var i = 0; i < game.asteroidsInPlay.length + 1; i++) {
    //     if(i == game.asteroidsInPlay.length) {
    //         x = Math.floor(game.spaceship.coordinates.x/boxSize);
    //         y = Math.floor(game.spaceship.coordinates.y/boxSize);
    //     }
    //     else {
    //         x = Math.floor(game.asteroidsInPlay[i].x/boxSize);
    //         y = Math.floor(game.asteroidsInPlay[i].y/boxSize);
    //     }

    //     if(x<0)
    //         x = vSplit + x;
    //     else if (x >vSplit-1)
    //         x = x - vSplit;
    //     if(y<0)
    //         y = hSplit + y;
    //     else if (y>hSplit-1)
    //         y = y - hSplit;

    //     // console.log("x: " + x + " y: " + y);
    //     asteroidLocations[x][y]++;
    // }

    for (var i = 0; i < vSplit; i++) {
        for (var j = 0; j < hSplit; j++) {
            for (var k = 0; k < game.asteroidsInPlay.length; k++) {
                cellScores[i][j] += game.distance(
                                        i*boxSize + boxSize/2, j*boxSize + boxSize/2,
                                        game.asteroidsInPlay[k].x, game.asteroidsInPlay[k].y );
            }
            //count ship as an asteroid as well
            //may weight its influence as well
            cellScores[i][j] += game.distance(
                                        i*boxSize + boxSize/2, j*boxSize + boxSize/2,
                                        game.spaceship.coordinates.x, game.spaceship.coordinates.y ) * 1;
        }
    }
    //find min
    var max = cellScores[0][0],
        maxCount = 0;
    for (var i = 0; i < vSplit; i++) {
        for (var j = 0; j < hSplit; j++) {
            if (cellScores[i][j]>max) {
                max = cellScores[i][j];
                safeLocation.x = i;
                safeLocation.y = j;
            }
        }
    }
    for (var i = 0; i < vSplit; i++) {
        for (var j = 0; j < hSplit; j++) {
            if (cellScores[i][j]==max) {
                maxCount++;
            }
        }
    }
    // console.log("max: " + max + " Occurances: " + maxCount);
    console.log("X: " + safeLocation.x + " Y: " + safeLocation.y);

    //draw grid
    var canvas = document.getElementById('asteroids'),
        context = canvas.getContext('2d');

    context.font = "20px Arial"
    context.fillStyle = "white";
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
    for (var i = 0; i < vSplit; i++) {
        for (var j = 0; j < hSplit; j++) {
            context.fillText( Math.floor(cellScores[i][j]/100), i*boxSize, j*boxSize+20);
        }
    }
    context.fillStyle = "white";
    context.fillRect(safeLocation.x * boxSize, safeLocation.y*boxSize, boxSize, boxSize);
    context.stroke();

    // game.timeDelay(100);
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

game.distance = function (x0, y0, x1, y1) {
    var shiftedX, shiftedY;

    if(x1 > x0)
        shiftedX = x1 - 1920;
    else
        shiftedX = x1 + 1920;
    if(y1 > y0)
        shiftedY = y1 - 1080;
    else 
        shiftedY = y1 + 1080;

    var one = Math.sqrt((x0-x1)*(x0-x1) + (y0-y1)*(y0-y1)); //normal
    var two = Math.sqrt((x0-shiftedX)*(x0-shiftedX) + (y0-y1)*(y0-y1)); //shifted x
    var three = Math.sqrt((x0-x1)*(x0-x1) + (y0-shiftedY)*(y0-shiftedY)); //shifted y
    var four = Math.sqrt((x0-shiftedX)*(x0-shiftedX) + (y0-shiftedY)*(y0-shiftedY)); //shifted x and y

    return Math.min(one, two, three, four);
};
game.simpleDistance = function (x0, y0, x1, y1) {

    return Math.sqrt((x0-x1)*(x0-x1) + (y0-y1)*(y0-y1));
};
game.timeDelay = function(milliseconds) { //A time delay that can be used to slow down the program to debug it.
    var t = new Date().getTime(); 
    while (new Date().getTime() < t + milliseconds);
}