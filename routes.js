var html2text = require('html-to-text');

module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index', {
			title : 'Ashutosh'
		});
	});

	app.get('/tags', function(req, res) {
		res.render('tags', {
			title : 'Tags * Ashutosh'
		});
	});

	app.get('/categories', function(req, res) {
		res.render('categories', {
			title : 'Categories * Ashutosh'
		});
	});
	app.get('/env', function(req, res) {
		var content = 'Version: ' + process.version + '\n<br/>\n'
				+ 'Env: {<br/>\n<pre>';
		//  Add env entries.
		for ( var k in process.env) {
			content += '   ' + k + ': ' + process.env[k] + '\n';
		}
		content += '}\n</pre><br/>\n'
		res.send(content);
		res.send('<html>\n'
				+ '  <head><title>Node.js Process Env</title></head>\n'
				+ '  <body>\n<br/>\n' + content + '</body>\n</html>');
	});

};