var sys = require('sys'),
  assert = require('assert'),
  djs = require('../d');
  
djs.playlist('file.js', function(err, files) {
  assert.deepEqual(files, [], "No files in the playlist");
});

djs.playlist('file0.js', function(err, files) {
  assert.deepEqual(files, ['file0.js'], "Only 'file0.js' in the playlist");
});

djs.playlist('file1.js', function(err, files) {
  assert.deepEqual(toHash(files), toHash(['file1.js', 'empty0.js']), "'file1.js' and one dependency (same folder) in the playlist");
});

djs.playlist('file2.js', function(err, files) {
  assert.deepEqual(toHash(files), toHash(['file2.js', 'empty0.js', 'empty1.js']), "'file2.js' and two dependencies (same folder) in the playlist");
});

// Since we are not sure about the playlist's order (shuffle mode, FTW), turn everything into a hash
function toHash(array) {
  var hash = {};
  array.forEach(function(value) {
    hash[value] = true;
  });
  return hash;
}
