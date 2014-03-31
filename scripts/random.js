Random = (function () {
    'use strict';

    function nextDouble() {
        return Math.random();
    }

    function nextRange(min, max) {
        var range = max - min;
        return Math.floor((Math.random() * range) + min);
    }

    function nextCircleVector() {
        var angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    // This is used to give a small performance optimization in generating gaussian random numbers.
    var usePrevious = false,
		y2;

    // Generate a normally distributed random number.
    //
    // NOTE: This code is adapted from a wiki reference I found a long time ago.  I originally
    // wrote the code in C# and am now converting it over to JavaScript.
    function nextGaussian(mean, stdDev) {
        var u = Math.random()*2 - 1;
        var v = Math.random()*2 - 1;
        var s = u*u + v*v

        while ( s >= 1) {
            u = Math.random()*2 - 1;
            v = Math.random()*2 - 1;
            s = u*u + v*v
        }
        var result = mean + u * Math.sqrt( (-2*Math.log(s))/s) * stdDev;
        //Make sure the value returned isn't negative
        if (result < 0)
            return nextGaussian(mean, stdDev);
        else
            return result;
    }

    return {
        nextDouble: nextDouble,
        nextRange: nextRange,
        nextCircleVector: nextCircleVector,
        nextGaussian: nextGaussian
    };

}());