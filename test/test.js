var sys = require('sys'),
  assert = require('assert'),
  dev = require('../d');
  
dev.dependencies('file0.js', function(err, files) {
  sys.log(JSON.stringify(files));
  assert.deepEqual(files, ['file0.js'], "Watching only 'file0.js'");
});

dev.dependencies('file1.js', function(err, files) {
  sys.log(JSON.stringify(files));
  assert.equal(files, ['file1.js', 'empty0.js'], "Watching 'file1.js' and one dependency");
});

/*dev.dependencies('file2.js', function(err, files) {
  sys.log(JSON.stringify(files));
  assert.equal(files, ['file2.js', 'empty0.js', 'empty1.js'], "Watching 'file2.js' and two dependencies");
});*/

/*setInterval(function() {
  sys.log(1);
}, 1000);*/

//sys.log(JSON.stringify(Object.keys({})))
