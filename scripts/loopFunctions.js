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

game.deleteDeadObjects = function (spaceship, asteroidsInPlay, bulletsInPlay, alienBulletsInPlay, isAttractMode) {
    var k = 0;
    // shift array down over dead asteroids
    for (var i = 0; i < asteroidsInPlay.length; i++) {
        if (!asteroidsInPlay[i].toBeDeleted) {
            asteroidsInPlay[k] = asteroidsInPlay[i];
            k++;
        }
        else {
            //delete an asteroid, get its point value, play a sound
            game.asteroidsLeftToKill-= 1000;
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
            asteroidsInPlay[i].dyingFunction(asteroidsInPlay, isAttractMode);
        }
    }
    asteroidsInPlay.length = k;      

    //create more asteroids if they have all been cleared
    if (asteroidsInPlay.length == 0) {
        game.level++;
        for (var i = 0; i < 3 + game.level ; i++) {
            game.generateAnAsteroid(3, game.generateRandomAsteroidLocation(spaceship), isAttractMode, asteroidsInPlay);
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

game.findNearestTarget = function (asteroidsInPlay, saucerBig, saucerSmall, spaceship) {
    var minDistance = 2300,
        currentDistance,
        currentTarget,
        vectorToTarget;

    for (var i = 0, l = asteroidsInPlay.length; i < l; i++) { //scan over the bullets

        currentDistance = Math.sqrt(    (asteroidsInPlay[i].x - spaceship.coordinates.x) * (asteroidsInPlay[i].x - spaceship.coordinates.x) + 
                                        (asteroidsInPlay[i].y - spaceship.coordinates.y) * (asteroidsInPlay[i].y - spaceship.coordinates.y)         );
        if (currentDistance < minDistance) {
            minDistance = currentDistance;
            currentTarget = asteroidsInPlay[i];
            // console.log("Dist: " + minDistance);
            // console.log("currentTarget: " + currentTarget);
            // console.log("asteroidsInPlay[i]: " + i ": " asteroidsInPlay[i]);
        }

    }

    //saucers
    if (saucerSmall.active) {
        currentDistance = Math.sqrt(    (saucerSmall.coordinates.x - spaceship.coordinates.x) * (saucerSmall.coordinates.x - spaceship.coordinates.x) + 
                                        (saucerSmall.coordinates.y - spaceship.coordinates.y) * (saucerSmall.coordinates.y - spaceship.coordinates.y)         );
        if (currentDistance < minDistance) {
            minDistance = currentDistance;
            currentTarget = saucerSmall;
        }
    }
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
        // console.log(currentTarget);
        vectorToTarget = game.createUnitVector(currentTarget, spaceship.coordinates);
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

    // console.log(targetCoordinates.x);
    // console.log(shipCoordinates.x);
    return {
        x : x/magnitude,
        y : y/magnitude
    };
};