game.Graphics = function (id) {
    'use strict';

    var canvas = document.getElementById(id),
        context = canvas.getContext('2d');

    // Place a 'clear' function on the Canvas prototype, this makes it a part
    // of the canvas, rather than making a function that calls and does it.
    CanvasRenderingContext2D.prototype.clear = function () {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function clear() {
        context.clear();
    }

    function renderStats () {
        context.font = "50px Arial Bold";
        context.fillStyle = "white";
        context.fillText(game.score, 10, 1060);
        context.font = "40px Arial Bold";
        context.fillText("Level: " + game.level, 10, 30);


        var startX = 1920 - game.lives * 50;
        for (var i = 0; i < game.lives; i++) {
            context.drawImage(game.images['images/livesDisplay.png'], startX + i*50, 1025, 42, 49);
        }
    }

    function Texture(spec) {
        var that = {},
            i = 0, j = 0, renderSlowdown = 0,
            slowDownFactor = Math.floor(Math.random()*2+3),
            maxSpeed;
            // blast = new Audio('sounds/blast.mp3');

        that.x = spec.center.x;
        that.y = spec.center.y;
        that.width = spec.width;
        that.height = spec.height;
        that.radius = spec.width > spec.height ? spec.width / 2 : spec.height / 2;
        that.rotation = spec.rotation;
        that.drawn = false;
        that.velocityVector = {x : spec.startVector.x, y : spec.startVector.y};
        that.directionVector = {x : 1, y : 0};
        that.thrustPerSecond = spec.moveRate;
        that.continuousRotate = spec.rotation;
        that.toBeDeleted = false;
        that.lifetime = spec.lifetime;
        that.rotation = spec.initialRotation;
        that.pointValue = spec.pointValue;
        that.asteroidClass = spec.asteroidClass;

        that.drawTeleportRechargeBar = function (rechargeRatio) {
            context.beginPath();
            context.rect(1800, 10, 100, 20);
            context.fillStyle = 'blue';
            context.fill();
            context.lineWidth = 3;
            context.strokeStyle = 'black';
            context.stroke();

            context.beginPath();
            context.rect(1800, 10, 100 * rechargeRatio, 20);
            context.fillStyle = 'red';
            context.fill();
            context.lineWidth = 3;
            context.strokeStyle = 'black';
            context.stroke();
        }

        that.dyingFunction = function (asteroidsInPlay, canvas) {
            var blast = new Audio('sounds/blast.mp3');
            blast.play();
            if (that.asteroidClass == 3) {
                game.generateAnAsteroid(2, {x: that.x, y: that.y}, canvas, asteroidsInPlay);
                game.generateAnAsteroid(2, {x: that.x, y: that.y}, canvas, asteroidsInPlay);
                game.generateAnAsteroid(2, {x: that.x, y: that.y}, canvas, asteroidsInPlay);
            }
            else if (that.asteroidClass == 2) {
                game.generateAnAsteroid(1, {x: that.x, y: that.y}, canvas, asteroidsInPlay);
                game.generateAnAsteroid(1, {x: that.x, y: that.y}, canvas, asteroidsInPlay);
                game.generateAnAsteroid(1, {x: that.x, y: that.y}, canvas, asteroidsInPlay);
                game.generateAnAsteroid(1, {x: that.x, y: that.y}, canvas, asteroidsInPlay);
            }
        }

        if (spec.type) {
            that.type = spec.type;
        }

        function updateDirection() {
            that.directionVector.x = Math.cos(that.rotation);
            that.directionVector.y = Math.sin(that.rotation);
            // console.log("Dx: " + that.directionVector.x + " Dy: " + that.directionVector.y);
        }

        that.update = function (elapsedTime) {
            if (spec.lifetime != null) { //check if this is an object with a lifetime
                spec.lifetime -= elapsedTime; //decrement it's lifetime
                if (spec.lifetime < 0)
                    that.toBeDeleted = true;
            }
            spec.center.x += that.velocityVector.x * (that.thrustPerSecond * (elapsedTime/1000));
            spec.center.y += that.velocityVector.y * (that.thrustPerSecond * (elapsedTime/1000));
            that.x = spec.center.x;
            that.y = spec.center.y;
            that.rotation -= that.continuousRotate * (elapsedTime / 1000);
            // that.x = spec.center.x - spec.width / 2;
            // that.y = spec.center.y - spec.height / 2;
            // console.log("X: " + spec.center.x + " Y: " + spec.center.y);
            checkBorders();
        }

        function checkBorders () {
            if (spec.center.x - spec.width/2 > 1920) {
                spec.center.x = 0 - spec.width/2;
                that.x = spec.center.x;
            }
            else if (spec.center.x + spec.width/2 < 0) {
                spec.center.x = 1920 + spec.width/2;
                that.x = spec.center.x;
            }

            if (spec.center.y - spec.height/2 > 1080) {
                spec.center.y = 0 - spec.height/2;
                that.y = spec.center.y;
            }
            else if (spec.center.y + spec.height/2 < 0) {
                spec.center.y = 1080 + spec.height/2;
                that.y = spec.center.y;
            }
        };

        that.reset = function (x, y, dirVector) {
            spec.center.x = x;
            spec.center.y = y;
            that.x = x;
            that.y = y;
            that.velocityVector = dirVector;
        };

        that.teleport = function (coordinates) {
            that.x = coordinates.x;
            that.y = coordinates.y;
            spec.center.x = coordinates.x;
            spec.center.y = coordinates.y;
        };

        that.rotateRight = function (elapsedTime) {
            that.rotation += spec.rotateRate * (elapsedTime / 1000);
            updateDirection();
            // console.log ("Rotation: " + that.rotation);
        };

        that.rotateLeft = function (elapsedTime) {
            that.rotation -= spec.rotateRate * (elapsedTime / 1000);
            updateDirection();
            // console.log("Rotation: " + that.rotation);
        };

        that.moveUp = function (elapsedTime) {   
            that.velocityVector.x += that.directionVector.x * (that.thrustPerSecond * (elapsedTime/1000));
            that.velocityVector.y += that.directionVector.y * (that.thrustPerSecond * (elapsedTime/1000));

            if(id == 'asteroids')
                maxSpeed = 40;
            else
                maxSpeed = 20;

            that.velocityVector.x = that.velocityVector.x > maxSpeed ? maxSpeed : that.velocityVector.x;
            that.velocityVector.y = that.velocityVector.y > maxSpeed ? maxSpeed : that.velocityVector.y;
            that.velocityVector.x = that.velocityVector.x < -maxSpeed ? -maxSpeed : that.velocityVector.x;
            that.velocityVector.y = that.velocityVector.y < -maxSpeed ? -maxSpeed : that.velocityVector.y;
        };

        that.setCoordinates = function (x, y) {
            spec.center.x = x;
            spec.center.y = y;
        };

        that.setRotation = function (rad) {
            that.rotation = rad;
        }

        that.draw = function () {
            context.save();

            context.translate(spec.center.x, spec.center.y);
            context.rotate(that.rotation);
            context.translate(-spec.center.x, -spec.center.y);

            if (that.asteroidClass != null) {
                context.drawImage(
    				spec.image,
                    j*245,
                    i*245,
                    245,
                    245,
    				spec.center.x - spec.width / 2,
    				spec.center.y - spec.height / 2,
    				spec.width, spec.height);

                if (renderSlowdown % slowDownFactor == 0) {
                    j++;
                    if(j == 5) {
                        j = 0;
                        i++;
                        if(i == spec.spriteDepth) {
                            i = 0;
                        }
                    }
                }
                renderSlowdown++;
            }
            else {
                context.drawImage(
                    spec.image,
                    spec.center.x - spec.width / 2,
                    spec.center.y - spec.height / 2,
                    spec.width, spec.height);
            }

            context.restore();

            that.drawn = true;
        };

        return that;
    }

    function Background(spec) {
        var that = {};

        that.draw = function () {
            context.save();

            context.translate(spec.center.x, spec.center.y);
            context.rotate(spec.rotation);
            context.translate(-spec.center.x, -spec.center.y);

            context.drawImage(
				spec.image,
				spec.center.x - spec.width / 2,
				spec.center.y - spec.height / 2,
				spec.width, spec.height);

            context.restore();
        };

        return that;
    }

    function Text(spec) {
        var that = {};

        that.text = spec.text;

        that.draw = function () {
            context.save();

            context.translate(spec.center.x, spec.center.y);
            context.rotate(spec.rotation);
            context.translate(-spec.center.x, -spec.center.y);

            context.fillStyle = spec.color;
            context.font = spec.font;
            context.fillText(that.text, spec.center.x - spec.width / 2, spec.center.y - spec.height / 2);

            context.restore();
        };

        that.stroke = function () {
            context.save();

            context.translate(spec.center.x, spec.center.y);
            context.rotate(spec.rotation);
            context.translate(-spec.center.x, -spec.center.y);

            context.strokeStyle = spec.strokeColor;
            context.lineWidth = 2;
            context.font = spec.font;
            context.strokeText(that.text, spec.center.x - spec.width / 2, spec.center.y - spec.height / 2);

            context.restore();
        };

        return that;
    }

    function drawImage(spec) {
        context.save();

        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);

        context.drawImage(
			spec.image,
			spec.center.x - spec.size / 2,
			spec.center.y - spec.size / 2,
			spec.size, spec.size);

        context.restore();
    }

    function drawStuff(distance) {
        context.font = "50px Arial Bold";
        context.fillStyle = "white";
        context.fillText(distance, 960, 1040);
    }

    return {
        clear: clear,
        Texture: Texture,
        Background: Background,
        Text: Text,
        drawImage: drawImage,
        renderStats : renderStats,
        drawStuff : drawStuff
    };
};