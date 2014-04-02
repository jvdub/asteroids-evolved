var fs = require('fs'),
	controls = {};

// Report all controls back to the requester.
exports.all = function (request, response) {
    controls = JSON.parse(fs.readFileSync('./game/controls.json', 'utf-8'));

    console.log('find all controls called');
    console.log(controls);
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(controls));
};

// Save controls to server
exports.add = function (request, response) {
    console.log('save controls called');
    console.log(request.body);

    controls.accel = +request.body.accel;
    controls.right = +request.body.right;
	controls.left = +request.body.left;
	controls.tele = +request.body.tele;
	controls.safe = +request.body.safe;
	controls.fire = +request.body.fire;

    console.log(controls);

    fs.writeFileSync('./game/controls.json', JSON.stringify(controls), { encoding: 'utf-8' });

    response.writeHead(200);
    response.end();
};