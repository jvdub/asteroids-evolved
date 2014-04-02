game.checkAllCollisions = function (spaceship, asteroidsInPlay, bulletsInPlay) {
    for (var i = 0; i < asteroidsInPlay.length; i++) {
        for (var j = 0; j < bulletsInPlay.length; j++) {
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
};

game.deleteDeadObjects = function (spaceship, asteroidsInPlay, bulletsInPlay, isAttractMode) {
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
            if (game.lifeBonusCounter < 0) {
                game.lives++;
                game.lifeBonusCounter = 7000;
            }
            asteroidsInPlay[i].dyingFunction(asteroidsInPlay, isAttractMode);
        }
    }
    asteroidsInPlay.length = k;

    if (asteroidsInPlay.length == 0) {
        game.level++;
        for (var i = 0; i < 5 + game.level*2 ; i++) {
            game.generateAnAsteroid(3, game.generateRandomAsteroidLocation(spaceship), false, asteroidsInPlay);
            // game.generateAnAsteroid(Math.floor(Math.random() * 3 + 1), game.generateRandomAsteroidLocation());
        }
    }

    k = 0;
    for (var i = 0; i < bulletsInPlay.length; i++) {
        if (!bulletsInPlay[i].toBeDeleted) {
            bulletsInPlay[k] = bulletsInPlay[i];
            k++;
        }
    }

    bulletsInPlay.length = k;
};