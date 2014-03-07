game.Graphics = (function () {
    'use strict';

    var canvas = document.getElementById('asteroids'),
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

    function Texture(spec) {
        var that = {};

        that.x = spec.center.x - (spec.width / 2);
        that.y = spec.center.y - (spec.height / 2);
        that.width = spec.width;
        that.height = spec.height;
        that.radius = spec.width > spec.height ? spec.width / 2 : spec.height / 2;
        that.drawn = false;

        if (spec.type) {
            that.type = spec.type;
        }

        that.rotateRight = function (elapsedTime) {
            spec.rotation += spec.rotateRate * (elapsedTime / 1000);
        };

        that.rotateLeft = function (elapsedTime) {
            spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
        };

        that.moveLeft = function (elapsedTime) {
            spec.center.x -= spec.moveRate * (elapsedTime / 1000);
            that.x = spec.center.x - spec.width / 2;
        };

        that.moveRight = function (elapsedTime) {
            spec.center.x += spec.moveRate * (elapsedTime / 1000);
            that.x = spec.center.x - spec.width / 2;
        };

        that.moveUp = function (elapsedTime) {
            spec.center.y -= spec.moveRate * (elapsedTime / 1000);
            that.y = spec.center.y - spec.height / 2;
        };

        that.moveDown = function (elapsedTime) {
            spec.center.y += spec.moveRate * (elapsedTime / 1000);
            that.y = spec.center.y - spec.height / 2;
        };

        that.moveTo = function (center) {
            spec.center = center;
        };

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

    return {
        clear: clear,
        Texture: Texture,
        Background: Background,
        Text: Text,
        drawImage: drawImage
    };
}());