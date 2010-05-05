var sys = require('sys'),
  fs = require('fs'),
  path = require('path'),
  app = process.argv[2];
  
// Add potentially missing extension
app = app? app + (app.match(/\.js$/)? '' : '.js') : 'app.js';

// Recursively find dependencies
dependencies(app, function(err, watchList) {
  if(err) throw err;
  if(!watchList.length) return sys.log("No files to watch.");
  watchList.forEach(function(file) {
    fs.watchFile(file, function(curr, prev) {
      sys.puts("the current mtime is: " + curr.mtime);
      sys.puts("the previous mtime was: " + prev.mtime);
    });
  });
});

function playlist(file, callback) {
  var directory = path.dirname(file),
    // We are using hashs to collect lists of unique files
    list = {}, deps = {};
    // Add potentially missing extension
  if(!file.match(/\.js$/)) { file+= '.js'; }
  fs.readFile(file, function(err, data) {
    var deps, depsNb, i, read = 0;
    if(err) {
      sys.log("File '"+ file +"' not found.");
      return callback.apply(global, [null, []]);
    }
    // Add the current file
    list[file];
  
    // Search dependencies of that file
    while(match = /(?:^|[^\w-])require *\(\s*['"](\.\/|\.\.|\/)(.*?)['"]\s*\)/g.exec(data)) {
      deps[path.join(match[1] == '/'? '' : directory , (match[1] != "./"? match[1] : '') + match[2] + '.js')] = true;
    }
    deps = Object.keys(deps);
    i = depsNb = deps.length;
    // Make sure that the dependency exists and recursively search its dependencies;
    while(i--) {
      playlist(deps[i], function(err, _list) {
        if(err) throw err;
        // Add dependencies to the list
        _list.forEach(function(value) {
          list[value] = true;
        });
        // Return list is when the last file has been inspected
        if(++read == depsNb) {
          callback.apply(global, [null, Object.keys(list)]);
        }
      });
    }
  });
}

function dependencies(files, callback) {
  sys.log(files)
  var filesNb, i, read = 0,
    watchList = {}, file, base;
  if(typeof files === "string") {
    files = [files];
  }
  i = filesNb = files.length;
  while(i--) {
    file = files[i];
    directory = path.dirname(file);
    fs.readFile(file, function(err, data) {
      if(err) {
        return sys.log("File '"+ file +"' not found.");
      }
      watchList[file] = true;
      
      sys.log("Initial watchList: "+JSON.stringify(watchList))
    
      var deps = {}, match;
      
      sys.log("DATA: "+data)
      // Parse dependencies
      while(match = /(?:^|[^\w-])require *\(\s*['"](\.\/|\.\.|\/)(.*?)['"]\s*\)/g.exec(data)) {
        deps[path.join(match[1] == '/'? '' : directory , (match[1] != "./"? match[1] : '') + match[2] + '.js')] = true;
      }
      
      deps = Object.keys(deps);
      
      sys.log("Dependencies found in file '"+ file +"': "+JSON.stringify(deps))
      
      if(deps.length) {
        // Search dependencies's dependencies
        dependencies(deps, function(err, _watchList) {
          if(err) throw err;
          _watchList.forEach(function(_file) {
            watchList[_file] = true;
          });
          
          // Last file has been read
          if(++read == filesNb) {
            callback.apply([null, Object.keys(watchList)]);
          }
        });
      // This is not really dry!
      } else if(++read == filesNb) {
        callback.apply(global, [null, Object.keys(watchList)]);
      }
    });
  }
};

exports.playlist = playlist;