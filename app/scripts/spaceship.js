game.spaceship = (function () {
    var spaceship = null,
        particles = [],
        coordinates = {x : 960, y: 540, radius : 63.5, toBeDeleted : false},
        teleportTimer = 1500;

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

    // Fires a missle from the front of the ship
    function fireMissile() {
        // Prevent a missile from firing if one has just been fired.
        if (game.bulletIntervalCountdown < 0) {
            // Reset the countdown
            game.bulletIntervalCountdown = game.BULLET_INTERVAL;
            // Add the missile to the objects in the game
            game.bulletsInPlay.push( game.Graphics.Texture({
                image: game.images['images/missile.png'],
                center: { x: spaceship.x + spaceship.directionVector.x * 50, y: spaceship.y + spaceship.directionVector.y * 50 },
                width: 40, height: 25,
                rotation: 0,
                moveRate: 500,         // pixels per second
                rotateRate: Math.PI,   // Radians per second
                startVector: { x: spaceship.directionVector.x, y: spaceship.directionVector.y },
                initialRotation: spaceship.rotation,
                lifetime: 3000
            }));
        } 
    }
    function teleport() {
        if (teleportTimer < 0) {
            spaceship.teleport(game.findSafeLocation(false));
            teleportTimer = 2000;
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

    // Renders the ship to the canvas
    function draw() {
        for (var i = particles.length - 1; i >= 0; --i) {
            particles[i].render();
        }
        spaceship.draw();
    }

    // Create the ship and the particle systems
    function init(ship) {
        // Create the ship image
        spaceship = game.Graphics.Texture(ship);

        particles.push(particleSystem({
            image: game.images['images/smoke.png'],
            center: { x: spaceship.x - spaceship.directionVector.x * 79, y: spaceship.y },
            speed: { mean: 0.5, stdev: 0.25 },
            lifetime: { mean: 100, stdev: 50 },
            direction: Random.nextGaussian(spaceship.rotation + Math.PI, 2 * Math.PI)
        }, game.Graphics));
        particles.push(particleSystem({
            image: game.images['images/fire.png'],
            center: { x: spaceship.x - spaceship.directionVector.x * 71, y: spaceship.y - spaceship.directionVector.y * 18 },
            speed: { mean: 0.5, stdev: 0.25 },
            lifetime: { mean: 75, stdev: 25 },
            direction: Random.nextGaussian(spaceship.rotation + Math.PI, 2 * Math.PI)
        }, game.Graphics));
        particles.push(particleSystem({
            image: game.images['images/fire.png'],
            center: { x: spaceship.x - spaceship.directionVector.x * 71, y: spaceship.y + spaceship.directionVector.y * 18 },
            speed: { mean: 0.5, stdev: 0.25 },
            lifetime: { mean: 75, stdev: 25 },
            direction: Random.nextGaussian(spaceship.rotation + Math.PI, 2 * Math.PI)
        }, game.Graphics));
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
        coordinates : coordinates,
        teleport : teleport
    };
}());