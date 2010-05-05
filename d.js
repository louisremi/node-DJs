var sys = require('sys'),
  fs = require('fs'),
  path = require('path'),
  app = process.argv[2];
  
// Add potentially missing extension
app = app? app + (app.match(/\.js$/)? '' : '.js') : 'app.js';

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
      if(file) sys.log("File '"+ file +"' not found.");
      return callback.apply(global, [null, []]);
    }
    
    //sys.log("Parsing file: "+file);
    
    // We are using hashs to collect lists of _unique_ files
    var list = {}, deps = {},
      depsNb, i, read = 0;
    
    // Add the current file
    list[file] = true;
    
    //sys.log("Original playlist: "+JSON.stringify(list))
    
    // Search dependencies of that file
    while(match = /(?:^|[^\w-])require *\(\s*['"](\.\/|\.\.|\/)(.*?)['"]\s*\)/g.exec(data)) {
      deps[path.join(match[1] == '/'? '' : directory , (match[1] != "./"? match[1] : '') + match[2] + '.js')] = true;
    }
    deps = Object.keys(deps);
    
    //sys.log("Found dependencies: "+JSON.stringify(deps));
    
    i = depsNb = deps.length;
    // Make sure that the dependency exists and recursively search its dependencies;
    do {
      playlist(deps[--i] || '', function(err, _list) {
        //sys.log("Result for file: "+file);
        //sys.log("Validated sublist: "+JSON.stringify(_list))
        if(err) throw err;
        // Add dependencies to the list
        _list.forEach(function(value) {
          list[value] = true;
        });
        //sys.log("Updated playlist: "+JSON.stringify(list))
        // Return list is when the last file has been inspected
        if(++read >= depsNb) {
          //sys.log("Final playlist: "+JSON.stringify(Object.keys(list)))
          callback.apply(global, [null, Object.keys(list)]);
        }
      });
    } while(i > 0);
  });
}

exports.playlist = playlist;