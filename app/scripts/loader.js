var game = {
    images: {},
    screens: {},
    status: {
        preloadRequest: 0,
        preloadComplete: 0
    },
    score: 0
};

window.addEventListener('load', function () {
    window.Modernizr.load([
		{
            load: [
                'preload!Scripts/random.js',
                'preload!Scripts/graphics.js',
                'preload!Scripts/mainmenu.js'
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
        }
    };

    return resource;
});

yepnope.addPrefix('preload-noexec', function (resource) {
    console.log('preloading-noexec: ' + resource.url);
    resource.noexec = true;
    return resource;
});