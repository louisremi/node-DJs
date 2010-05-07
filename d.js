var sys = require('sys'),
  fs = require('fs'),
  spawn = require('child_process').spawn,
  path = require('path'),
  stdin = process.openStdin(),
  args = parse(process.argv),
  intro = args.intro,
  dir = args.dir,
  test = args.test;

  
playlist(intro, function(err, list) {
  if(err) throw err;
  if(!list.length) throw new Error("No files in the playlist.");
  say('"Party time! Press [enter] anytime to restart"');
  var playing = play(intro);
  
  // Watch changes on any files of the playlist
  list.forEach(function(file) {
    fs.watchFile(file, function(curr, prev) {
      say("playlist updated");
      stop(playing, intro);
      playing = play(intro);
    });
  });
  
  // Listen for commands
  stdin.setEncoding('utf8');
  stdin.addListener('data', function (chunk) {
    switch(chunk) {
      case '\n':
        say("restarting playlist");
        stop(playing, intro);
        playing = play(intro);
        break;
    }
  });
  
  function play(intro) {
    var playing = spawn('node', [intro]);
    playing.stdout.addListener('data', function(data) {
      sys.print(data);
    });
    playing.stderr.addListener('data', function(data) {
      sys.print(data);
    });
    return playing;
  }
  function stop(playing, intro) {
    if(playing) {
      playing.kill();
    }
  }
});

function playlist(file, callback) {
  var directory = path.dirname(file);
    // Add potentially missing extension
  if(file && !file.match(/\.js$/)) { file+= '.js'; }
  fs.readFile(file, function(err, data) {
    if(err) {
      if(file) say('"Can\'t get my hands on '+ intro +'"');
      return callback.apply(global, [null, []]);
    }

    // We are using hashs to collect lists of _unique_ files
    var list = {}, deps = {},
      depsNb, i, read = 0;

    // Add the current file
    list[file] = true;

    // Search dependencies of that file
    while(match = /(?:^|[^\w-])require *\(\s*['"](\.\/|\.\.|\/)(.*?)['"]\s*\)/g.exec(data)) {
      deps[path.join(match[1] == '/'? '' : directory , (match[1] != "./"? match[1] : '') + match[2] + '.js')] = true;
    }
    deps = Object.keys(deps);
    
    i = depsNb = deps.length;
    // Make sure that the dependency exists and recursively search its dependencies;
    do {
      playlist(deps[--i] || '', function(err, _list) {
        if(err) throw err;
        // Add dependencies to the list
        _list.forEach(function(value) {
          list[value] = true;
        });
        // Return list when the last file has been inspected
        if(++read >= depsNb) {
          callback.apply(global, [null, Object.keys(list)]);
        }
      });
    } while(i > 0);
  });
}

function parse(argv) {
  var intro, dir, test;
  intro = argv[2];
  // Add potentially missing extension
  intro = intro? intro + (intro.match(/\.js$/)? '' : '.js') : 'app.js';
  
  if(argv.indexOf('-d') != -1) {
    dir = argv[argv.indexOf('-d') +1];
  } else if(argv.indexOf('--dir') != -1) {
    dir = argv[argv.indexOf('--dir') +1];
  }
  
  if(argv.indexOf('-t') != -1) {
    test = argv[argv.indexOf('-t') +1] || true;
  } else if(argv.indexOf('--test') != -1) {
    test = argv[argv.indexOf('--test') +1] || true;
  }

  return {
    intro: intro,
    dir: dir,
    test: test
  }
}

global.say = function(message) {
  sys.puts('DJs: '+message);
}

exports.playlist = playlist;

exports.parse = parse;