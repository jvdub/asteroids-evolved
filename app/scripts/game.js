game.game = (function () {
    'use strict';

    function showScreen(id) {
        var screen = 0,
            screens = null;
        //
        // Remove the active state from all screens.  There should only be one...
        screens = document.getElementsByClassName('active');
        for (screen = 0; screen < screens.length; screen ++) {
            screens[screen].classList.remove('active');
        }
        //
        // Tell the screen to start actively running
        game.screens[id].run();
        //
        // Then, set the new screen to be active
        document.getElementById(id).classList.add('active');
    }

    function init() {
        var screen = null;
        for (screen in game.screens) {
            if (game.screens.hasOwnProperty(screen)) {
                // console.log(screen);
                game.screens[screen].initialize();
            }
        }

        showScreen('main-menu');
    }

    return {
        init: init,
        showScreen: showScreen
    };
}());

// Check if the user clicked on a given object
game.collided = function (a, b) {
    if (Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y)) <= a.radius) {
        return true;
    }

    return false;
};

game.detectCollision = function(a, b) {

    //check if the two objects are within eachother's radius
    //This is not a perfect solution cause most of the objects
    //are not perfectly circular
    if ( Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y)) > (a.radius+b.radius) )
        return false;
    else
        return true;
};