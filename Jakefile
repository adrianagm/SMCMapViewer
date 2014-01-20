desc('Create docs using jsdoc');
task('docs', function() {
	console.log("hello, I'm gonna create the SMC Viewer documentation!");


	jake.rmRf('docs');
	var cmd = './node_modules/.bin/jsdoc ./src -d docs -r';
	jake.exec(cmd, {
		printStdout: true,
		printStderr: true
	}, function() {
		console.log("Docs created in ./docs!");
		complete();
	});
});


jake.addListener('complete', function() {
	process.exit();
});