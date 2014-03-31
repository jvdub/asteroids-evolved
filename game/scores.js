var fs = require('fs'),
    scores = [],
    nextId = 0;

// Report all scores back to the requester.
exports.all = function (request, response) {
    var temp = JSON.parse(fs.readFileSync('./game/scores.json', 'utf-8'));
    scores = temp.scores;
    nextId = temp.nextId;

    console.log('find all scores called');
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(scores));
};

// Add a new score to the server data.
exports.add = function (request, response) {
    console.log('add new score called');
    console.log(request.query.name);
    console.log(request.query.score);

    var now = new Date();
    scores.push({
        id: nextId,
        name: request.query.name,
        score: request.query.score,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString()
    });
    nextId++;

    response.writeHead(200);
    response.end();
};