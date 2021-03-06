﻿function particleSystem(spec, graphics) {
    'use strict';
    var that = {},
		nextName = 1,	// unique identifier for the next particle
		particles = {};	// Set of all active particles

    that.plength = function () {
        var sum = 0;
        for (var i in particles) {
            if (particles.hasOwnProperty(i)) {
                sum += 1;
            }
        }
        return sum;
    };

    // This creates one new particle
    that.create = function (x, y, direction, size) {
        var p = {
            image: spec.image,
            size: size ? size : Random.nextGaussian(50, 25),
            center: { x: x ? x : spec.center.x, y: y ? y : spec.center.y },
            direction: direction ? direction : spec.direction,
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
            alive: 0	// How long the particle has been alive, in seconds
        };

        // Assign a unique name to each particle
        particles[nextName++] = p;
    };

    // Update the state of all particles.  This includes remove any that 
    // have exceeded their lifetime.
    that.update = function (elapsedTime) {
        var removeMe = [],
			value,
			particle;

        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                // Update how long it has been alive
                particle.alive += elapsedTime;

                // Update its position
                particle.center.x += (elapsedTime * particle.speed * Math.cos(particle.direction));
                particle.center.y += (elapsedTime * particle.speed * Math.sin(particle.direction));

                // Rotate proportional to its speed
                particle.rotation += particle.speed / 500;

                // If the lifetime has expired, identify it for removal
                if (particle.alive > particle.lifetime) {
                    removeMe.push(value);
                }
            }
        }

        // Remove all of the expired particles
        for (particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;
    };

    // Render all particles
    that.render = function () {
        var value,
			particle;

        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                graphics.drawImage(particle);
            }
        }
    };

    return that;
}