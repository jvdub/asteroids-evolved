game.spaceship = (function () {
    var spaceship = null,
        particles = [];

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
        for (var i = 0; i < 10; ++i) {
            for (var j = 0, l = particles.length; j < l; ++j) {
                particles[j].create();
            }
        }
    }

    // Fires a missle from the front of the ship
    function fireMissile() {
        // Prevent a missile from firing if one has just been fired.
        if (game.bulletIntervalCountdown < 0) {
            console.log("missle fired");
            console.log("spaceshipRotation: " + spaceship.rotation);
            // Reset the countdown
            game.bulletIntervalCountdown = game.BULLET_INTERVAL;
            // Add the missile to the objects in the game
            game.objectsInPlay[game.objectNames++] = game.Graphics.Texture({
                image: game.images['images/missile.png'],
                center: { x: spaceship.x + spaceship.directionVector.x * 50, y: spaceship.y + spaceship.directionVector.y * 50 },
                width: 40, height: 25,
                rotation: 0,
                moveRate: 500,         // pixels per second
                rotateRate: Math.PI,   // Radians per second
                startVector: { x: spaceship.directionVector.x, y: spaceship.directionVector.y },
                initialRotation: spaceship.rotation,
                lifetime: 3000
            });
        }
    }

    // Updates the ship's position and angle
    function update(time) {
        spaceship.update(time);
        for (var i = 0, l = particles.length; i < l; ++i) {
            particles[i].update(time);
        }
    }

    // Renders the ship to the canvas
    function draw() {
        for (var i = 0, l = particles.length; i < l; ++i) {
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
            speed: { mean: 50, stdev: 25 },
            lifetime: { mean: 10000, stdev: 1 },
            direction: Random.nextGaussian(spaceship.rotation + Math.PI, Math.PI / 36)
        }, game.Graphics));
        particles.push(particleSystem({
            image: game.images['images/smoke.png'],
            center: { x: spaceship.x - spaceship.directionVector.x * 71, y: spaceship.y - spaceship.directionVector.y * 18 },
            speed: { mean: 50, stdev: 25 },
            lifetime: { mean: 10000, stdev: 1 },
            direction: Random.nextGaussian(spaceship.rotation + Math.PI, Math.PI / 36)
        }, game.Graphics));
        particles.push(particleSystem({
            image: game.images['images/smoke.png'],
            center: { x: spaceship.x - spaceship.directionVector.x * 71, y: spaceship.y + spaceship.directionVector.y * 18 },
            speed: { mean: 50, stdev: 25 },
            lifetime: { mean: 10000, stdev: 1 },
            direction: Random.nextGaussian(spaceship.rotation + Math.PI, Math.PI / 36)
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
        generateParticles: generateParticles
    };
}());