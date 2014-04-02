var game = {
    images: {},
    screens: {},
    status: {
        preloadRequest: 0,
        preloadComplete: 0
    },
    asteroidsInPlay: [],
    bulletsInPlay: [],
    particles: [],
    objectNames: 0,
    BULLET_INTERVAL: 200,
    bulletIntervalCountdown: 200,
    score: 0,
    displayDistances: false, //toggled when p is pressed.  Remove later
    level: 1,
    lives: 3,
    teleports : 3,
    lifeBonusCounter : 7000
};

window.addEventListener('load', function () {
    window.Modernizr.load([
		{
            load: [
                'preload!scripts/random.js',
                'preload!scripts/graphics.js',
                'preload!scripts/input.js',
                'preload!scripts/particles.js',
                'preload!scripts/spaceship.js',
                'preload!scripts/mainmenu.js',
                'preload!scripts/game.js',
                'preload!scripts/screens.js',
                'preload!scripts/gameplay.js',
                'preload!scripts/loopFunctions.js',
                'preload!images/background1.jpg',
                'preload!images/battlecruiser2.png',
                'preload!images/asteroid1.png',
                'preload!images/missile.png',
                'preload!images/smoke.png',
                'preload!images/fire.png',
                'preload!images/laser.png',
                'preload!images/smoke1.png',
                'preload!images/wizard-fire.png',
                'preload!images/livesDisplay.png',
                'preload!images/fireball.png',
                'preload!images/hyperspace.png',
                'preload!images/energyBallBlue.png',
                'preload!images/energyBallYellowFlash.png',
                'preload!sounds/laserGun.mp3',
                'preload!sounds/blast.mp3'
            ], 
            complete: function () {
            }
		}
    ]);
}, false);

yepnope.addPrefix('preload', function (resource) {
    console.log('preloading: ' + resource.url);

    game.status.preloadRequest += 1;
    var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
    resource.noexec = isImage;
    resource.autoCallback = function (e) {
        if (isImage) {
            var image = new Image();
            image.src = resource.url;
            game.images[resource.url] = image;
        }
        game.status.preloadComplete += 1;

        // When everything has finished preloading, go ahead and start the game
        if (game.status.preloadComplete === game.status.preloadRequest) {
            console.log('Preloading complete!');
            game.game.init();
        }
    };

    return resource;
});

yepnope.addPrefix('preload-noexec', function (resource) {
    console.log('preloading-noexec: ' + resource.url);
    resource.noexec = true;
    return resource;
});