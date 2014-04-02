﻿game.game = (function () {
    'use strict';

    function showScreen(id) {
        var screen = 0,
            screens = null;

        // Remove the active state from all screens. There should only be one...
        screens = document.getElementsByClassName('active');

        for (screen = 0; screen < screens.length; screen++) {
            screens[screen].classList.remove('active');
        }

        // Tell the screen to start actively running
        game.screens[id].run();

        // Then, set the new screen to be active
        document.getElementById(id).classList.add('active');
    }

    function init() {
        var screen = null;

        $.ajax({
            type: 'GET',
            url: '/v1/controls',
            success: function (rslt) {
                game.controls = rslt;
            },
            error: function () {
                // There was a connection error of some sort
                console.log(this.status + this.statusText);
            }
        });

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

game.detectCollision = function (a, b) {
    // check if the two objects are within eachother's radius
    // This is not a perfect solution cause most of the objects
    // are not perfectly circular
    if (Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)) > (a.radius + b.radius)) {
        return false;
    }
    else {
        return true;
    }
};

game.findSafeLocation = function (draw) {
    // divide the gamearea into a grid and give the squares a score based
    // on how many asteroids are nearby it.

    var boxSize = 10,
        vSplit = 1920 / boxSize,
        hSplit = 1080 / boxSize,
        cellScores = [],
        safeLocation = { x: 0, y: 0 },
        max = -1000000;

    //horizontal
    for (var i = 0; i < vSplit; i++) {
        cellScores[i] = [];
        for (var j = 0; j < hSplit; j++) {
            cellScores[i].push(0);
        }
    }

    for (var i = 0; i < vSplit; i++) {
        for (var j = 0; j < hSplit; j++) {
            for (var k = 0, l = game.asteroidsInPlay.length; k < l; k++) {
                cellScores[i][j] += game.modifiedDistance(
                                        i * boxSize + boxSize / 2, j * boxSize + boxSize / 2,
                                        game.asteroidsInPlay[k].x, game.asteroidsInPlay[k].y);
            }

            //count ship as an asteroid as well
            //may weight its influence as well
            cellScores[i][j] += game.modifiedDistance(
                                        i * boxSize + boxSize / 2, j * boxSize + boxSize / 2,
                                        game.spaceship.coordinates.x, game.spaceship.coordinates.y) * 2;

            //keep track of max value as we go through the game
            if (cellScores[i][j] > max) {
                max = cellScores[i][j];
                safeLocation.x = i;
                safeLocation.y = j;
            }
        }
    }
    safeLocation.x *= boxSize;
    safeLocation.y *= boxSize;

    //draw ing safelevels
    if (draw) {
        var canvas = document.getElementById('asteroids'),
            context = canvas.getContext('2d');

        // find min score
        var min = cellScores[0][0];
        for (var i = 0; i < vSplit; i++) {
            for (var j = 0; j < hSplit; j++) {
                if (cellScores[i][j] < min) {
                    min = cellScores[i][j];
                }
            }
        }

        //shift everything up
        if (min < 0) {
            max += Math.abs(min);
            for (var i = 0; i < vSplit; i++) {
                for (var j = 0; j < hSplit; j++) {
                    cellScores[i][j] += Math.abs(min);
                }
            }
            min = 0;
        }

        //scale values from 0-255
        for (var i = 0; i < vSplit; i++) {
            for (var j = 0; j < hSplit; j++) {
                cellScores[i][j] = Math.round((cellScores[i][j] / max) * 255);
            }
        }

        context.font = "20px Arial"
        context.fillStyle = "white";
        context.beginPath();
        //Vertical Lines
        // for (var i = 0; i < vSplit; i++) {
        //     context.moveTo((i*boxSize), 0);
        //     context.lineTo((i*boxSize), 1080);
        // }
        // //horizontal
        // for (var i = 0; i < hSplit; i++) {
        //     context.moveTo(0, (i*boxSize));
        //     context.lineTo(1920, (i*boxSize));
        // }
        for (var i = 0; i < vSplit; i++) {
            for (var j = 0; j < hSplit; j++) {
                context.fillStyle = "rgb(" + cellScores[i][j] + "," + cellScores[i][j] + "," + cellScores[i][j] + ")";
                context.fillRect(i * boxSize, j * boxSize, boxSize, boxSize);
                // context.fillText( Math.round(cellScores[i][j]/100), i*boxSize, j*boxSize+20);
                // context.fillText( cellScores[i][j], i*boxSize, j*boxSize+20);
            }
        }

        context.fillStyle = "red";
        context.fillRect(safeLocation.x, safeLocation.y, boxSize, boxSize);
        context.stroke();
    }

    // game.timeDelay(100);
    return safeLocation;
};

game.generateRandomAsteroidLocation = function () {
    var coordinates = {
        x: Math.random() * 1920,
        y: Math.random() * 1080
    }

    var radius = 500;

    while (((coordinates.x - game.spaceship.coordinates.x) *
           (coordinates.x - game.spaceship.coordinates.x) +
           (coordinates.y - game.spaceship.coordinates.y) *
           (coordinates.y - game.spaceship.coordinates.y)) < (radius * radius)) {
        coordinates.x = Math.random() * 1920;
        coordinates.y = Math.random() * 1080;
    }

    return coordinates;
};

game.modifiedDistance = function (x0, y0, x1, y1) {
    var minDist = game.wrapAroundDistance(x0, y0, x1, y1);

    if (minDist < 350) {
        return -10000 * ((350 - minDist) / 350);
    }

    return minDist;
};

game.wrapAroundDistance = function (x0, y0, x1, y1) { //returns the shortest distance between two points,  accounts for wrap around at edges.
    var shiftedX, shiftedY;

    if (x1 > x0) {
        shiftedX = x1 - 1920;
    }
    else {
        shiftedX = x1 + 1920;
    }

    if (y1 > y0) {
        shiftedY = y1 - 1080;
    }
    else {
        shiftedY = y1 + 1080;
    }

    var one = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)); //normal
    var two = Math.sqrt((x0 - shiftedX) * (x0 - shiftedX) + (y0 - y1) * (y0 - y1)); //shifted x
    var three = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - shiftedY) * (y0 - shiftedY)); //shifted y
    var four = Math.sqrt((x0 - shiftedX) * (x0 - shiftedX) + (y0 - shiftedY) * (y0 - shiftedY)); //shifted x and y

    return Math.min(one, two, three, four);
};

game.timeDelay = function (milliseconds) { //A time delay that can be used to slow down the program to debug it.
    var t = new Date().getTime();
    while (new Date().getTime() < t + milliseconds);
};

game.toggleGraph = function () {
    if (game.displayDistances) {
        game.displayDistances = false;
    }
    else {
        game.displayDistances = true;
    }
};

game.generateAnAsteroid = function (asteroidClass, coordinates) {
    var newWidth, newHeight, newPointValue, speed;

    switch (asteroidClass) {
        case 1:
            newWidth = 40;
            newHeight = 40;
            newPointValue = 100;
            speed = Random.nextGaussian(150, 25);
            break;
        case 2:
            newWidth = 75;
            newHeight = 75;
            newPointValue = 150;
            speed = Random.nextGaussian(100, 25);
            break;
        case 3:
            newWidth = 100;
            newHeight = 100;
            newPointValue = 200;
            speed = Random.nextGaussian(50, 25);
            break;
        default:
    }
    game.asteroidsInPlay.push(game.Graphics.Texture({
        image: game.images['images/spinning-asteroid-8.png'],
        center: coordinates,
        width: newWidth, height: newHeight,
        // rotation: Random.nextGaussian(.5, .25),
        rotation: .1,
        moveRate: speed,         // pixels per second
        rotateRate: Math.PI,   // Radians per second
        startVector: Random.nextCircleVector(),
        initialRotation: Math.random()*2*Math.PI,
        lifetime: null,
        pointValue: newPointValue,
        asteroidClass: asteroidClass
    }));
};