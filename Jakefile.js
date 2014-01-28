desc('Create docs using jsdoc');
task('docs', {async:true}, function() {
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

desc("Creates a bundle with the project's source files");
task("build", {async:true}, function(){
	console.log("hello, I'm gonna create the SMC Viewer JavaScript bundle!");


	jake.rmRf('dist');
	jake.mkdir("dist");
	var cmd =  "./node_modules/.bin/browserify build/api-deps.js -o ./dist/smc.viewer-bundle.js";
	jake.exec(cmd, {}, function() {
		console.log("Bundle created in ./bundle!");
		complete();
	});
});

task("default",["docs","build"]);


jake.addListener('complete', function() {
	process.exit();
});