﻿game.spaceship = function () {
    var spaceship = null,
        particles = [],
        coordinates = {x : 960, y: 540, radius : 63.5, toBeDeleted : false},
        respawnTimer = 1000,
        laser = new Audio('sounds/laserGun.mp3'),
        graphics = null,
        teleportTimer = 4000,
        teleportTimerReset = 4000,
        rechargeRatio = 0;

    function moveUp(time) {
        spaceship.moveUp(time);
    }

    function rotateLeft(time) {
        spaceship.rotateLeft(time);
    }

    function rotateRight(time) {
        spaceship.rotateRight(time);
    }

    function generateParticles() {
        for (var i = 0; i < 5; ++i) {
            particles[1].create(
                (spaceship.x - spaceship.directionVector.x * 71) + (18 * -spaceship.directionVector.y) ,
                (spaceship.y - spaceship.directionVector.y * 71) + (18 * spaceship.directionVector.x) ,
                Math.PI + Math.atan2(spaceship.directionVector.y, spaceship.directionVector.x)
                );
            particles[2].create(
                (spaceship.x - spaceship.directionVector.x * 71) - (18 * -spaceship.directionVector.y) ,
                (spaceship.y - spaceship.directionVector.y * 71) - (18 * spaceship.directionVector.x) ,
                Math.PI + Math.atan2(spaceship.directionVector.y, spaceship.directionVector.x)
                );
            particles[0].create(
                (spaceship.x - spaceship.directionVector.x * 79) ,
                (spaceship.y - spaceship.directionVector.y * 79) ,
                Math.PI + Math.atan2(spaceship.directionVector.y, spaceship.directionVector.x)
                );
        }
    }

    function fireMissile(bulletsInPlay) { //incorporates speed of the shipinto speed of the projectile
        // Prevent a missile from firing if one has just been fired.
        if (game.bulletIntervalCountdown < 0 && !coordinates.toBeDeleted) {
            var directionMagnitude = Math.sqrt(Math.pow(spaceship.velocityVector.x, 2) + Math.pow(spaceship.velocityVector.y, 2));
            var directionUnitX = spaceship.velocityVector.x / directionMagnitude,
                directionUnitY = spaceship.velocityVector.y / directionMagnitude;

            var angleBetweenVectors = ( Math.acos(spaceship.directionVector.x*directionUnitX + spaceship.directionVector.y*directionUnitY));
            var momentumIncreaseFactor = (Math.PI/2 - angleBetweenVectors)/(Math.PI/2);

            if(!momentumIncreaseFactor) {
                momentumIncreaseFactor = 0;
            }
            laser.currentTime = 0;
            laser.play();
            game.bulletIntervalCountdown = game.BULLET_INTERVAL;
            // Add the missile to the objects in the game
            bulletsInPlay.push( graphics.Texture({
                image: game.images['images/fireball.png'],
                center: { x: spaceship.x + spaceship.directionVector.x * 50, y: spaceship.y + spaceship.directionVector.y * 50 },
                width: 20, height: 20,
                rotation: 100,
                // moveRate: 100,         // pixels per second
                moveRate: 750+23*directionMagnitude*momentumIncreaseFactor,         // pixels per second
                rotateRate: Math.PI,   // Radians per second
                startVector: { x: spaceship.directionVector.x, y: spaceship.directionVector.y},
                initialRotation: spaceship.rotation,
                lifetime: 1000, 
                asteroidClass : null
            }));
        } 
    }

    function teleport(asteroidsInPlay) {
        if (rechargeRatio == 1) {
            teleportTimerReset += 2000;
            teleportTimer = teleportTimerReset;

            game.particles.push(particleSystem({
                    image: game.images['images/energyBallYellowFlash.png'],
                    center: { x: spaceship.x, y: spaceship.y },
                    speed: { mean: 0.5, stdev: 0.25 },
                    lifetime: { mean: 1000, stdev: 50 },
                    direction: Random.nextDouble()
                }, graphics));

            for (var j = 0; j < 25; ++j) {
                game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(20, 10));
            }

            spaceship.teleport(game.findSafeLocation(false, { coordinates: coordinates }, asteroidsInPlay));
            spaceship.velocityVector = {x : 0, y : 0};

            game.particles.push(particleSystem({
                    image: game.images['images/energyBallBlue.png'],
                    center: { x: spaceship.x, y: spaceship.y },
                    speed: { mean: 0.5, stdev: 0.25 },
                    lifetime: { mean: 1000, stdev: 50 },
                    direction: Random.nextDouble()
                }, graphics));

            for (var j = 0; j < 50; ++j) {
                game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(20, 10));
            }
        }
    }

    // Updates the ship's position and angle
    function update(time) {
        spaceship.update(time);
        for (var i = 0, l = particles.length; i < l; ++i) {
            particles[i].update(time);
        }
        coordinates.x = spaceship.x;
        coordinates.y = spaceship.y;
        coordinates.radius = spaceship.radius;
        teleportTimer -= time;
    }

    function updateTeleportTimer (elapsedTime) {
        teleportTimer -= elapsedTime;

        if (teleportTimer < 0) {
            rechargeRatio = 1;
        }
        else {
            rechargeRatio = (teleportTimerReset - teleportTimer)/teleportTimerReset;    
        }
        //console.log("timer: " + teleportTimer + " reset: " + teleportTimerReset + " ratio: " + rechargeRatio);
    }
    function drawTeleportRecharge() {
        spaceship.drawTeleportRechargeBar(rechargeRatio);
    }

    // Renders the ship to the canvas
    function draw() {
        for (var i = particles.length - 1; i >= 0; --i) {
            particles[i].render();
        }
        spaceship.draw();
    }

    // Create the ship and the particle systems
    function init(ship, isAttractMode) {
        graphics = isAttractMode === true ? game.Graphics('attract-asteroids') : game.Graphics('asteroids');

        // Create the ship image
        spaceship = graphics.Texture(ship);

        particles.length = 0;

        particles.push(particleSystem({
            image: game.images['images/smoke.png'],
            center: { x: spaceship.x - spaceship.directionVector.x * 79, y: spaceship.y },
            speed: { mean: 0.5, stdev: 0.25 },
            lifetime: { mean: 100, stdev: 50 },
            direction: Random.nextGaussian(spaceship.rotation + Math.PI, 2 * Math.PI)
        }, graphics));
        particles.push(particleSystem({
            image: game.images['images/fire.png'],
            center: { x: spaceship.x - spaceship.directionVector.x * 71, y: spaceship.y - spaceship.directionVector.y * 18 },
            speed: { mean: 0.5, stdev: 0.25 },
            lifetime: { mean: 75, stdev: 25 },
            direction: Random.nextGaussian(spaceship.rotation + Math.PI, 2 * Math.PI)
        }, graphics));
        particles.push(particleSystem({
            image: game.images['images/fire.png'],
            center: { x: spaceship.x - spaceship.directionVector.x * 71, y: spaceship.y + spaceship.directionVector.y * 18 },
            speed: { mean: 0.5, stdev: 0.25 },
            lifetime: { mean: 75, stdev: 25 },
            direction: Random.nextGaussian(spaceship.rotation + Math.PI, 2 * Math.PI)
        }, graphics));
    }

    function respawn(elapsedTime, asteroidsInPlay, hasRespawned) {
        respawnTimer -= elapsedTime;
        spaceship.velocityVector = {x : 0, y : 0};
        if (respawnTimer <= 0) {
            coordinates.toBeDeleted = false;
            spaceship.teleport(game.findSafeLocation(false, { coordinates: coordinates }, asteroidsInPlay));
            game.lives--
            respawnTimer = 1000;
            // console.log("setting up next life");
            game.particles.push(particleSystem({
                    image: game.images['images/energyBallBlue.png'],
                    center: { x: spaceship.x, y: spaceship.y },
                    speed: { mean: 0.5, stdev: 0.25 },
                    lifetime: { mean: 1000, stdev: 50 },
                    direction: Random.nextDouble()
                }, graphics));

            for (var j = 0; j < 50; ++j) {
                game.particles[game.particles.length - 1].create(false, false, Random.nextDoubleRange(-Math.PI, Math.PI), Random.nextGaussian(20, 10));
            }
        }
    }

    function getShipAngleToTarget(target) {
        return Math.acos(spaceship.directionVector.x*target.x + spaceship.directionVector.y*target.y);
    }

    function getRotation() {
        return spaceship.rotation;
    }

    return {
        init: init,
        update: update,
        draw: draw,
        fireMissile: fireMissile,
        moveUp: moveUp,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        generateParticles: generateParticles,
        coordinates: coordinates,
        rotation: getRotation,
        teleport: teleport,
        respawn: respawn,
        getShipAngleToTarget: getShipAngleToTarget,
        updateTeleportTimer: updateTeleportTimer,
        drawTeleportRecharge: drawTeleportRecharge
    };
};