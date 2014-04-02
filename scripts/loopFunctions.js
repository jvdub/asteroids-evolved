game.checkAllCollisions = function () {
    for (var i = 0; i < game.asteroidsInPlay.length; i++) {
        for (var j = 0; j < game.bulletsInPlay.length; j++) {
            if (game.detectCollision(game.asteroidsInPlay[i], game.bulletsInPlay[j])) {
                game.asteroidsInPlay[i].toBeDeleted = true;
                game.bulletsInPlay[j].toBeDeleted = true;
            }
        }

        //check if ship collided with any asteroid
        if (game.detectCollision(game.spaceship.coordinates, game.asteroidsInPlay[i])) {
            game.spaceship.coordinates.toBeDeleted = true;
        }
    }
};

game.deleteDeadObjects = function () {
    var k = 0;
    // shift array down over dead asteroids
    for (var i = 0; i < game.asteroidsInPlay.length; i++) {
        if (!game.asteroidsInPlay[i].toBeDeleted) {
            game.asteroidsInPlay[k] = game.asteroidsInPlay[i];
            k++;
        }
        else {
            //delete an asteroid, get its point value, play a sound
            game.score += game.asteroidsInPlay[i].pointValue;
            game.lifeBonusCounter -= game.asteroidsInPlay[i].pointValue;
            if (game.lifeBonusCounter < 0) {
                game.lives++;
                game.lifeBonusCounter = 7000;
            }
            game.asteroidsInPlay[i].dyingFunction();
        }
    }
    game.asteroidsInPlay.length = k;

    if (game.asteroidsInPlay.length == 0) {
        game.level++;
        for (var i = 0; i < 5 + game.level*2 ; i++) {
            game.generateAnAsteroid(3, game.generateRandomAsteroidLocation());
            // game.generateAnAsteroid(Math.floor(Math.random() * 3 + 1), game.generateRandomAsteroidLocation());
        }
    }

    k = 0;
    for (var i = 0; i < game.bulletsInPlay.length; i++) {
        if (!game.bulletsInPlay[i].toBeDeleted) {
            game.bulletsInPlay[k] = game.bulletsInPlay[i];
            k++;
        }
    }

    game.bulletsInPlay.length = k;
};