game.saucer = function () {
    var saucer = null,
        particles = [],
        coordinates = {x : 0, y: 0, radius : 63.5, toBeDeleted : false},
        graphics = null,
        active = false;

    function moveUp(time) {
        saucer.moveUp(time);
    }

    function rotateLeft(time) {
        saucer.rotateLeft(time);
    }

    function rotateRight(time) {
        saucer.rotateRight(time);
    }

    // Fires a missle from the front of the ship
    function fireMissile(alienBulletsInPlay, shootingVector) {
        alienBulletsInPlay.push( graphics.Texture({
            image: game.images['images/energyBallYellow.png'],
            center: { x: saucer.x, y: saucer.y},
            width:25, height: 25,
            rotation: 100,
            moveRate: 600,         // pixels per second
            rotateRate: Math.PI,   // Radians per second
            startVector: { x: shootingVector.x, y: shootingVector.y },
            initialRotation: saucer.rotation,
            lifetime: 2000, 
            asteroidClass : null
        }));
    }

    // Updates the ship's position and angle
    function update(time) {
        saucer.update(time);
        coordinates.x = saucer.x;
        coordinates.y = saucer.y;
        coordinates.radius = saucer.radius;
    }

    function reset() {
        active = true;
        coordinates.toBeDeleted = false;
        var side = Math.floor(Math.random()*2);  //pick a side for the saucer to appear on
        var x, y, dirVector;
        if (side == 0) {  //     left/right
            x = 0 - saucer.width/2;
            y = Math.floor(Math.random()*1080);
        }
        else {             //    top/bottom
            y = 0 - saucer.height/2;
            x = Math.floor(Math.random()*1920);
        }
        dirVector = Random.nextCircleVector();
        // console.log("active: " + active + " side: " + side + " x: " + x + " y: " + y + " dir: " + dirVector);
        saucer.reset(x, y, dirVector);
    }

    function dyingFunction () {

    }

    // Renders the ship to the canvas
    function draw() {
        saucer.draw();
    }

    // Create the ship and the particle systems
    function init(ship, isAttractMode) {
        active = false;
        graphics = isAttractMode === true ? game.Graphics('attract-asteroids') : game.Graphics('asteroids');

        // Create the ship image
        saucer = graphics.Texture(ship);
    }

    return {
        init: init,
        update: update,
        draw: draw,
        fireMissile: fireMissile,
        moveUp: moveUp,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        coordinates : coordinates,
        reset : reset,
        active : active,
        dyingFunction : dyingFunction
    };
};