game.checkAllCollisions = function (spaceship, asteroidsInPlay, bulletsInPlay, alienBulletsInPlay) {
    //check if any missiles hit any asteroids
    for (var i = 0, l = asteroidsInPlay.length; i < l; i++) {
        for (var j = 0, k = bulletsInPlay.length; j < k; j++) {
            if (game.detectCollision(asteroidsInPlay[i], bulletsInPlay[j])) {
                asteroidsInPlay[i].toBeDeleted = true;
                bulletsInPlay[j].toBeDeleted = true;
            }
        }

        //check if ship collided with any asteroid
        if (game.detectCollision(spaceship.coordinates, asteroidsInPlay[i])) {
            spaceship.coordinates.toBeDeleted = true;
        }
    }

    

    //check if any alien bullets hit the spaceship
    for (var i = 0, l = alienBulletsInPlay.length; i < l; i++) {
        if (game.detectCollision(spaceship.coordinates, alienBulletsInPlay[i])) {
            spaceship.coordinates.toBeDeleted = true;
            alienBulletsInPlay[i].toBeDeleted = true;
        }
    }
};

game.deleteDeadObjects = function (spaceship, asteroidsInPlay, bulletsInPlay, alienBulletsInPlay, canvas) {
    var k = 0;
    // shift array down over dead asteroids
    for (var i = 0; i < asteroidsInPlay.length; i++) {
        if (!asteroidsInPlay[i].toBeDeleted) {
            asteroidsInPlay[k] = asteroidsInPlay[i];
            k++;
        }
        else {
            //delete an asteroid, get its point value, play a sound
            game.score += asteroidsInPlay[i].pointValue;
            game.lifeBonusCounter -= asteroidsInPlay[i].pointValue;
            if( !game.saucerInPlay ) {
                game.saucerAppearCounter -= asteroidsInPlay[i].pointValue;
            }
            if (game.lifeBonusCounter <= 0) {
                game.lives++;
                game.lifeBonusCounter = game.LIFE_BONUS_COUNTER_RESET;
            }
            if (game.saucerAppearCounter <= 0) {
                game.putSaucerIntoPlay = true;
                game.saucerAppearCounter = game.SAUCER_APPEAR_COUNTER_RESET;
            }
            asteroidsInPlay[i].dyingFunction(asteroidsInPlay, canvas);
        }
    }
    asteroidsInPlay.length = k;      

    //create more asteroids if they have all been cleared
    if (asteroidsInPlay.length == 0) {
        game.level++;
        for (var i = 0; i < 3 + game.level ; i++) {
            game.generateAnAsteroid(3, game.generateRandomAsteroidLocation(spaceship), canvas, asteroidsInPlay);
        }
    }

    //shift bullets down
    k = 0;
    for (var i = 0, l = bulletsInPlay.length; i < l; i++) {
        if (!bulletsInPlay[i].toBeDeleted) {
            bulletsInPlay[k] = bulletsInPlay[i];
            k++;
        }
    }
    bulletsInPlay.length = k;

    // Shift alien bullets down
    k = 0;
    for (var i = 0, l = alienBulletsInPlay.length; i < l; i++) {
        if (!alienBulletsInPlay[i].toBeDeleted) {
            alienBulletsInPlay[k] = alienBulletsInPlay[i];
            k++;
        }
    }
    alienBulletsInPlay.length = k;
};

game.findNearestTarget = function (asteroidsInPlay, saucerBig, saucerSmall, spaceship, elapsedTime) {
    var minDistance = 2300,
        currentDistance,
        currentTarget,
        vectorToTarget,
        currentTarget;

    for (var i = 0, l = asteroidsInPlay.length; i < l; i++) { //scan over the bullets

        currentDistance = Math.sqrt(    (asteroidsInPlay[i].x - spaceship.coordinates.x) * (asteroidsInPlay[i].x - spaceship.coordinates.x) + 
                                        (asteroidsInPlay[i].y - spaceship.coordinates.y) * (asteroidsInPlay[i].y - spaceship.coordinates.y)         );
        if (currentDistance < minDistance) {
            minDistance = currentDistance;
            currentTarget = asteroidsInPlay[i];
        }

    }
    //Small saucer becomes priority if in play cause it is mean
    if (saucerSmall.active) {
        currentDistance = Math.sqrt(    (saucerSmall.coordinates.x - spaceship.coordinates.x) * (saucerSmall.coordinates.x - spaceship.coordinates.x) + 
                                        (saucerSmall.coordinates.y - spaceship.coordinates.y) * (saucerSmall.coordinates.y - spaceship.coordinates.y)         );
        vectorToTarget = game.createUnitVector(saucerSmall.coordinates, spaceship.coordinates);
        return {
            directionVector : vectorToTarget,
            distance : currentDistance
        };
    }
    //check if big saucer is closest
    if (saucerBig.active) {
        currentDistance = Math.sqrt(    (saucerBig.coordinates.x - spaceship.coordinates.x) * (saucerBig.coordinates.x - spaceship.coordinates.x) + 
                                        (saucerBig.coordinates.y - spaceship.coordinates.y) * (saucerBig.coordinates.y - spaceship.coordinates.y)         );
        if (currentDistance < minDistance) {
            minDistance = currentDistance;
            currentTarget = saucerBig;
        }
    }


    if(currentTarget == saucerBig || currentTarget == saucerSmall) { //if the targest is a saucer, return the appropriately exposed coordinates
        vectorToTarget = game.createUnitVector(currentTarget.coordinates, spaceship.coordinates);
        return {
            directionVector : vectorToTarget,
            distance : minDistance
        };
    }
    else {
        //calculate some coordinates that are adjusted for the speed of the asteroid
        var newCoordinates = {  x: currentTarget.x + currentTarget.velocityVector.x*((currentTarget.thrustPerSecond)/2),
                                y: currentTarget.y + currentTarget.velocityVector.y*((currentTarget.thrustPerSecond)/2)  };
        // console.log("x: " + currentTarget.x + " y: " + currentTarget.y + " nX: " + newCoordinates.x + " nY: " + newCoordinates.y + " Speed: " + currentTarget.thrustPerSecond + " Dist: " +  minDistance);
        vectorToTarget = game.createUnitVector(newCoordinates, spaceship.coordinates);
        return {
            directionVector : vectorToTarget,
            distance : minDistance
        };
    }
};

game.createUnitVector = function(targetCoordinates, shipCoordinates) {
    var x = targetCoordinates.x - shipCoordinates.x,
        y = targetCoordinates.y - shipCoordinates.y,
        magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    return {
        x : x/magnitude,
        y : y/magnitude
    };
};

game.getMagnitudeOfVelocity = function(objectWithVector) {
    return Math.sqrt(Math.pow(objectWithVector.velocityVector.x, 2) + Math.pow(objectWithVector.velocityVector.y, 2));
};
