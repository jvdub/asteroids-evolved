var fs = require('fs'),
    scores = [];

// Report all scores back to the requester.
exports.all = function (request, response) {
    scores = JSON.parse(fs.readFileSync('./game/scores.json', 'utf-8'));

    // console.log('find all scores called');
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(scores));
};

// Add a new score to the server data.
exports.add = function (request, response) {
    // console.log('add new score called');
    // console.log(request.body.name);
    // console.log(request.body.score);

    var now = new Date();
    scores.push({
        name: request.body.name,
        score: request.body.score,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString()
    });

    // console.log(scores);

    fs.writeFileSync('./game/scores.json', JSON.stringify(scores), { encoding: 'utf-8' });

    response.writeHead(200);
    response.end();
};