desc('Create docs using jsdoc');
task('docs', function() {
	console.log("hello, I'm gonna create the SMC Viewer documentation!");



	var cmd = 'jsdoc -d=docs -a ./src';
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