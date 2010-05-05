var sys = require('sys'),
  fs = require('fs'),
  spawn = require('child_process').spawn,
  path = require('path'),
  app = process.argv[2];
  
// Add potentially missing extension
app = app? app + (app.match(/\.js$/)? '' : '.js') : 'app.js';

playlist(app, function(err, list) {
  if(err) throw err;
  if(!list.length) throw new Error("No files in the playlist.");
  say('"Let\'s party!"');
  var playing = play(app);
  
  /*playing.addListener('exit', function(code, signal) {
    playing = false;
  });*/
  
  // Kill the app when exiting DJs
  process.addListener('exit', function(code, signal) {
    say('"Party\'s over!"');
    stop(playing, app);
  });
  
  // Watch changes on any files of the playlist
  list.forEach(function(file) {
    fs.watchFile(file, function(curr, prev) {
      say("playlist updated");
      stop(playing, app);
      playing = play(app);
    });
  });
  
  function play(app) {
    say("start playing "+app);
    var playing = spawn('node', [app]);
    playing.stdout.addListener('data', function(data) {
      sys.print(data);
    });
    playing.stderr.addListener('data', function(data) {
      sys.print(data);
    });
    return playing;
  }
  function stop(playing, app) {
    if(playing) {
      playing.kill();
      say("stop playing "+app);
    }
  }
});

// Recursively find dependencies
/*dependencies(app, function(err, watchList) {
  if(err) throw err;
  if(!watchList.length) return sys.log("No files to watch.");
  watchList.forEach(function(file) {
    fs.watchFile(file, function(curr, prev) {
      sys.puts("the current mtime is: " + curr.mtime);
      sys.puts("the previous mtime was: " + prev.mtime);
    });
  });
});*/

function playlist(file, callback) {
  var directory = path.dirname(file);
    // Add potentially missing extension
  if(file && !file.match(/\.js$/)) { file+= '.js'; }
  fs.readFile(file, function(err, data) {
    if(err) {
      if(file) say('"Can\'t get my hands on '+ app +'"');
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

global.say = function(message) {
  sys.puts('DJs: '+message);
}

exports.playlist = playlist;