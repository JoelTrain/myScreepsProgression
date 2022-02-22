// eslint-disable-next-line quotes
"use strict";
var https = require('https');
var fs = require('fs');
const { version } = require('os');
var uglify = false; // Set to true to uglify files before upload. ES6 is *not* supported-- https://github.com/mishoo/UglifyJS2/issues/448

// Watch git
function parseBranch(HEAD) {
	return HEAD === 'ref: refs/heads/experimental\n' ? 'experimental' : 'develop';
}
var branch = parseBranch(fs.readFileSync('.git/HEAD', 'utf8'));
fs.watch('.git', function(ev, file) {
	if (file === 'HEAD') {
		var tmp = parseBranch(fs.readFileSync('.git/HEAD', 'utf8'));
		console.log(tmp);
		if (tmp !== branch) {
			branch = tmp;
			console.log('Switching to: '+ branch);
		}
	}
});

// Crush code if master
function crush(branch, file, code) {
	if (!uglify) {
		return code;
	}
	var ujs = require('uglify-js');
	console.log('Parsing', file);
	var ast = ujs.parse(code);
	ast.figure_out_scope();
	var compressor = ujs.Compressor();
	var compressed = ast.transform(compressor);
	compressed.figure_out_scope();
	compressed.compute_char_frequency();
	compressed.mangle_names({ toplevel: true, sort: true });
	return compressed.print_to_string();
}

// Read local code from disk
var modules = {};
function refreshLocalBranch() {
	modules = {};
	fs.readdirSync('./scripts/screeps.com/experimental/').forEach(function(file) {
		if (file !== 'sync.js' && file !== version.js && /\.js$/.test(file)) {
			modules[file.replace( /\.js$/, '')] = crush(branch, file, fs.readFileSync(`./scripts/screeps.com/experimental/${file}`, 'utf8'));
		}
	});
}
refreshLocalBranch();
schedulePush();

// Watch for local changes
var pushTimeout;
fs.watch('./scripts/screeps.com/experimental/', function(ev, file) {
	if (file !== 'sync.js' && file !== version.js && /\.js$/.test(file)) {
		try {
			modules[file.replace(/\.js$/, '')] = crush(branch, file, fs.readFileSync(`./scripts/screeps.com/experimental/${file}`, 'utf8'));
		} catch (err) {
			delete modules[file.replace(/\.js$/, '')];
		}
		schedulePush();
	}
});

// Push changes to screeps.com
function schedulePush() {
	const timeString = new Date().toLocaleString();
	modules['version'] = `global.SCRIPT_VERSION = '${timeString}';`;

	if (pushTimeout) {
		clearTimeout(pushTimeout);
	}
	pushTimeout = setTimeout(function() {
		pushTimeout = undefined;
		var req = https.request({
			hostname: 'screeps.com',
			port: 443,
			path: '/api/user/code',
			method: 'POST',
			auth: process.env.screepsEmail + ':' + process.env.screepsPassword,
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
		});
		req.end(JSON.stringify({ branch: branch, modules: modules }));
		req.on('response', function(res) {
			// console.log('HTTP Status '+ res.statusCode);
			if(res.statusCode === 200) {
				console.log(`Committed to Screeps account "${process.env.screepsEmail}" branch "${branch}" at ${timeString}.`);
			}
		});
	}, 50);
}