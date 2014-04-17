var game = {
    images: {},
    screens: {},
    status: {
        preloadRequest: 0,
        preloadComplete: 0
    },
    // asteroidsInPlay: [],
    // bulletsInPlay: [],
    particles: [],
    objectNames: 0,
    BULLET_INTERVAL: 200,
    bulletIntervalCountdown: 200,
    score: 0,
    displayDistances: false, //toggled when p is pressed.  Remove later
    level: 1,
    lives: 3,
    teleports: 3,
    lifeBonusCounter: 10000,
    LIFE_BONUS_COUNTER_RESET: 10000,
    hasExploded: 1,
    controls: {},
    attractMode: false,
    saucerAppearCounter: 4000,
    SAUCER_APPEAR_COUNTER_RESET: 4000,
    putSaucerIntoPlay: false,
    saucerInPlay: false,
    shipWidth: 84,
    shipHeight: 67,
    shield: {
        count: 2, // Set to 2 when 'S' is pressed.
        time: 0 // Set to the time when 'S' is pressed.
    }
};

window.addEventListener('load', function () {
    window.Modernizr.load([
		{
            load: [
                'preload!scripts/saucer.js',
                'preload!scripts/random.js',
                'preload!scripts/graphics.js',
                'preload!scripts/input.js',
                'preload!scripts/particles.js',
                'preload!scripts/spaceship.js',
                'preload!scripts/mainmenu.js',
                'preload!scripts/game.js',
                'preload!scripts/screens.js',
                'preload!scripts/gameplay.js',
                'preload!scripts/attract.js',
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
                'preload!images/energyBallYellow.png',
                'preload!images/explosion.png',
                'preload!sounds/laserGun.mp3',
                'preload!sounds/blast.mp3',
                'preload!sounds/shipExplosion.mp3',
                'preload!images/spinning-asteroid-3.png',
                'preload!images/spinning-asteroid-6.png',
                'preload!images/spinning-asteroid-9.png',
                'preload!images/spinning-asteroid-8.png',
                'preload!images/saucersquare.png',
                'preload!images/shield_field.png'
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