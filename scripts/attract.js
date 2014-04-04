game.screens['attract-mode'] = (function () {
    'use strict';

    var self = this,
        lastTime = 0,
        canvas = null,
        background = null,
        elapsedTime = 0,
        start = 0,
        totalTime = 0,
        cancelNextRequest = false,
        someTestAsteroids = {},
        numAsteroids = 3,
        graphics = game.Graphics('attract-asteroids'),
        isAttractMode = true,
        spaceship = game.spaceship(),
        saucerBig = game.saucer(),
        saucerSmall = game.saucer(),
        asteroidsInPlay = [],
        bulletsInPlay = [],
        alienBulletsInPlay = [],
        alienFireTimer = 4000,
        saucerToggle = 'big',
        hasRespawned = true,
        lastMove = 0,
        shipExplosion = new Audio('sounds/shipExplosion.mp3'),
        asteroidsLeftToKill = 48000,
        timeToClearAsteroids = 60000;

    function findNearestAsteroid() {

    }

    function gameLoop(time) {
        var i = 0,
            l = 0;

        // Update timers
        elapsedTime = time - lastTime;
        lastTime = time;
        totalTime = time - start;

        /*
        timeToClearAsteroids-= elapsedTime;
        if (timeToClearAsteroids/asteroidsLeftToKill > 1.25) { //evade mode

        }
        else { //hunt mode
            if (game.findNearestTarget(bulletsInPlay, saucerBig, saucerSmall, spaceship) < 500) {
                //
                //rotate to with a certain degree of closest asteroid
                //shoot at closest asteroid
            }
            else {
                //
                //rotate to within a certain degree of closest asteroid
                //move towards asteroid until within 500 of it
            }
        }
        */
        

        

        if (time - lastMove >= 500) {
            spaceship.rotateLeft(elapsedTime);
            spaceship.moveUp(elapsedTime);
            spaceship.generateParticles();
            fire();
            lastMove = time;
            console.log(game.findNearestTarget(asteroidsInPlay, saucerBig, saucerSmall, spaceship));
        }

        // Update universal variables
        spaceship.update(elapsedTime);
        game.bulletIntervalCountdown -= elapsedTime;

        if (game.putSaucerIntoPlay) {
            game.saucerInPlay = true;
            game.putSaucerIntoPlay = false;

            if (saucerToggle == 'small' || game.score >= 20000) {
                saucerSmall.active = true;
                saucerSmall.reset();
                saucerToggle = 'big';
            }
            else {
                saucerBig.active = true;
                saucerBig.reset();
                saucerToggle = 'small';
            }
        }

        //Big Saucer
        if (saucerBig.active) {
            alienFireTimer -= elapsedTime;
            saucerBig.update(elapsedTime);
            if ( alienFireTimer < 0 && saucerBig.active) {
                alienFireTimer = 3000;
                saucerBig.fireMissile(alienBulletsInPlay, Random.nextCircleVector());
            }
            //check if any bullets collided with the alienship.
            for (var i = 0, l = bulletsInPlay.length; i < l; i++) {
                if (game.detectCollision(saucerBig.coordinates, bulletsInPlay[i])) {
                    saucerBig.coordinates.toBeDeleted = true;
                    saucerBig.active  = false;
                    bulletsInPlay[i].toBeDeleted = true;
                    game.saucerInPlay = false;
                    shipExplosion.currentTime = 0;
                    shipExplosion.play();

                    game.particles.push(
                        particleSystem({
                            image: game.images['images/explosion.png'],
                            center: { x: saucerBig.coordinates.x, y: saucerBig.coordinates.y },
                            speed: { mean: 1.25, stdev: 0.25 },
                            lifetime: { mean: 1000, stdev: 50 },
                            direction: Random.nextDouble()
                        }, graphics)
                    );
                    for (i = 0; i < 50; ++i) {
                        game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(30, 15));
                    }
                }
            }
        }

        //small saucer
        if (saucerSmall.active) {
            alienFireTimer -= elapsedTime;
            saucerSmall.update(elapsedTime);
            if ( alienFireTimer < 0 && saucerSmall.active) {
                alienFireTimer = 3000;
                saucerSmall.fireMissile(alienBulletsInPlay, game.getFiringVector(saucerSmall.coordinates, spaceship.coordinates));
            }
            //check if any bullets collided with the alienship.
            for (var i = 0, l = bulletsInPlay.length; i < l; i++) {
                if (game.detectCollision(saucerSmall.coordinates, bulletsInPlay[i])) {
                    saucerSmall.coordinates.toBeDeleted = true;
                    saucerSmall.active  = false;
                    bulletsInPlay[i].toBeDeleted = true;
                    game.saucerInPlay = false;
                    shipExplosion.currentTime = 0;
                    shipExplosion.play();

                    game.particles.push(
                        particleSystem({
                            image: game.images['images/explosion.png'],
                            center: { x: saucerSmall.coordinates.x, y: saucerSmall.coordinates.y },
                            speed: { mean: 1.25, stdev: 0.25 },
                            lifetime: { mean: 1000, stdev: 50 },
                            direction: Random.nextDouble()
                        }, graphics)
                    );
                    for (i = 0; i < 50; ++i) {
                        game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(30, 15));
                    }
                }
            }
        }

        // collisions
        game.checkAllCollisions(spaceship, asteroidsInPlay, bulletsInPlay, alienBulletsInPlay);

        for (i = 0, l = asteroidsInPlay.length; i < l; ++i) {
            if (asteroidsInPlay[i].toBeDeleted === true) {
                game.particles.push(
                    particleSystem({
                        image: game.images['images/wizard-fire.png'],
                        center: { x: asteroidsInPlay[i].x, y: asteroidsInPlay[i].y },
                        speed: { mean: 1.25, stdev: 0.25 },
                        lifetime: { mean: 1000, stdev: 50 },
                        direction: Random.nextDouble()
                    }, graphics));
                for (var j = 0; j < (10 * asteroidsInPlay[i].asteroidClass); ++j) {
                    game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(20, 10));
                }
                game.particles.push(
                    particleSystem({
                        image: game.images['images/smoke1.png'],
                        center: { x: asteroidsInPlay[i].x, y: asteroidsInPlay[i].y },
                        speed: { mean: 1.25, stdev: 0.25 },
                        lifetime: { mean: 1000, stdev: 50 },
                        direction: Random.nextDouble()
                    }, graphics)
                );
                for (var j = 0; j < (5 * asteroidsInPlay[i].asteroidClass); ++j) {
                    game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(30, 10));
                }
            }
        }

        // deleting items from arrays
        game.deleteDeadObjects(spaceship, asteroidsInPlay, bulletsInPlay, alienBulletsInPlay, isAttractMode, asteroidsLeftToKill);

        // updating objects
        //asteroids
        for (i = 0, l = asteroidsInPlay.length; i < l; i++) {
            asteroidsInPlay[i].update(elapsedTime);
        }

        //bullets
        for (i = 0, l = bulletsInPlay.length; i < l; i++) {
            bulletsInPlay[i].update(elapsedTime);
        }

        //particles
        for (i = 0, l = game.particles.length; i < l; ++i) {
            game.particles[i].update(elapsedTime);
        }

        //alien bullets
        for (i = 0, l = alienBulletsInPlay.length; i < l; i++) {
            alienBulletsInPlay[i].update(elapsedTime);
        }

        graphics.clear();
        background.draw();

        //particles
        for (i = 0, l = game.particles.length; i < l; ++i) {
            game.particles[i].render();
        }

        //drawing asteroids
        for (i = 0, l = asteroidsInPlay.length; i < l; i++) {
            asteroidsInPlay[i].draw();
        }
        //drawing missiles
        for (i = 0, l = bulletsInPlay.length; i < l; i++) {
            bulletsInPlay[i].draw();
        }

        //drawing saucer
        if (saucerBig.active) {
            saucerBig.draw();    
        }
        if (saucerSmall.active) {
            saucerSmall.draw();    
        }

        //drawing saucer bullets
        for(i = 0, l = alienBulletsInPlay.length; i < l; i++) {
            alienBulletsInPlay[i].draw();
        }

        //draw spaceship
        if (!spaceship.coordinates.toBeDeleted) {
            spaceship.draw();
            hasRespawned = true;
        }
        else {
            shipExplosion.play();
            spaceship.respawn(elapsedTime, asteroidsInPlay, hasRespawned);
            game.particles.push(
                    particleSystem({
                        image: game.images['images/explosion.png'],
                        center: { x: spaceship.coordinates.x, y: spaceship.coordinates.y },
                        speed: { mean: 1.25, stdev: 0.25 },
                        lifetime: { mean: 1000, stdev: 50 },
                        direction: Random.nextDouble()
                    }, graphics)
                );

            if (hasRespawned) {
                hasRespawned = false;

                for (i = 0; i < 100; ++i) {
                    game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(30, 15));
                }
            }
        }

        graphics.renderStats();

        if (game.displayDistances) {
            game.findSafeLocation(true, spaceship, asteroidsInPlay);
        }

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function rotate() {

    }

    function teleport() {
        spaceship.teleport(asteroidsInPlay);
    }

    function fire() {
        spaceship.fireMissile(bulletsInPlay);
    }

    function goToMenu() {
        document.getElementById('game').removeEventListener('keydown', goToMenu);
        document.getElementById('game').removeEventListener('mousedown', goToMenu);
        // document.getElementById('game').removeEventListener('mousemove', goToMenu);
        cancelNextRequest = true;
        game.game.showScreen('main-menu');
    }

    function attachHandlers() {
        document.getElementById('game').addEventListener('keydown', goToMenu, false);
        document.getElementById('game').addEventListener('mousedown', goToMenu, false);
        // document.getElementById('game').addEventListener('mousemove', goToMenu, false);
    }

    function initialize() {
        canvas = document.getElementById('attract-asteroids');

        spaceship.init({
            image: game.images['images/battlecruiser2.png'],
            center: { x: 960, y: 540 },
            width: 127, height: 100,
            rotation: 0,
            moveRate: 23,          // pixels per second
            rotateRate: Math.PI,   // Radians per second
            startVector: { x: 0, y: 0 },
            initialRotation: 0,
            lifetime: null,
            asteroidClass: null
        }, isAttractMode);

        saucerBig.init({
            image: game.images['images/saucersquare.png'],
            center: {x: 0, y: 0},
            width: 111, height: 95,
            rotation: 0,
            moveRate: Random.nextGaussian(40, 10),         // pixels per second
            rotateRate: Math.PI,   // Radians per second
            startVector: {x: 0, y: 0},
            initialRotation: 0,
            lifetime: null,
            pointValue: 100,
            asteroidClass: null
        }, isAttractMode);

        saucerSmall.init({
            image: game.images['images/saucersquare.png'],
            center: {x: 0, y: 0},
            width: 55, height: 47,
            rotation: 0,
            moveRate: Random.nextGaussian(40, 10),         // pixels per second
            rotateRate: Math.PI,   // Radians per second
            startVector: {x: 0, y: 0},
            initialRotation: 0,
            lifetime: null,
            pointValue: 100,
            asteroidClass: null
        }, isAttractMode);

        for (var i = 0; i < numAsteroids; i++) {
            game.generateAnAsteroid(3, game.generateRandomAsteroidLocation(spaceship), isAttractMode, asteroidsInPlay);
        }

        background = graphics.Background({
            image: game.images['images/background1.jpg'],
            center: {
                x: Math.floor(canvas.width / 2),
                y: Math.floor(canvas.height / 2)
            },
            width: canvas.width,
            height: canvas.height
        });
    }

    function run() {
        attachHandlers();
        start = performance.now();
        lastMove = start;
        lastTime = start;
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };
}());