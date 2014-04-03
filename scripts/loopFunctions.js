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