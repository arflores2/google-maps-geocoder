var express = require('express'),
    http = require("http"),
    app = express(),
    port = process.env.PORT || 8080,
    host = process.env.IP || 'localhost';

//configure environment
app.configure(function() {
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.limit('1mb'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
});

app.get('/?', function(req, res) {
	res.render('index');
});

app.post('/proxy', function(req, res) {
	var url = req.param('url', null).replace('http://', ''),
			slashIndex = url.search(/\//),
			host = url.slice(0, slashIndex),
			path = url.slice(slashIndex);

	var options = {
		host: host,
		path: path,
		port: 80,
		method: 'GET'
	};

	var clientRequestCallback = function(cres) {
		console.log('client request - callback');
		var str = '';
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});

		cres.on('data', function(chunk) {
			str += chunk.toString().replace(/=['"]\//, host + chunk);
			res.write(chunk);
		});

		cres.on('end', function() {
			console.log('client request - end');
			res.end();
		});
	};

	console.log('client request - init');
	var creq = http.request(options, clientRequestCallback).end();
	console.log('client request - end');
});


app.listen(port, host);
console.log('Listening on host:port', port, ':', host);

