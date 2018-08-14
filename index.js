
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

var httpServer = http.createServer(function(req, res) {
    console.log('/***Request received***/');

    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var queryStringObject = parsedUrl.query;
    console.log('Path: '+trimmedPath);
    console.log('Query String: ',queryStringObject);

    var method = req.method.toLocaleLowerCase();
    console.log('Method: '+method);

    var headers = req.headers;
    console.log('Heasers: ',headers);

    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();
        console.log('Payload: '+buffer);
		
		var chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
		
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
		};

        chooseHandler(data, function(statusCode, payload) {
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};
			
			var payloadString = JSON.stringify(payload);
			console.log('payload: '+payloadString);
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			//res.end('End of Server\n');
		});
    }); 
});

httpServer.listen(config.httpPort, function() {
    console.log('/***Http listener***/');
    console.log('PORT: '+config.httpPort);
    console.log('ENV: '+config.envName);
}); 

var handlers = {};

handlers.hello = function(data, callback) {
    callback(202, {'message': 'hello'})
};
handlers.notFound = function(data, callback) {
    callback(404);
};

var router = {
    'hello': handlers.hello
};