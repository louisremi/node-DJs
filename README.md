node-DJs
========

Tired of restarting a script every time you modify it or its dependencies? Drop a DJ in da place!

    > node d.js myNodeServer.js
    DJs: "Party time!" Press [enter] anytime to restart
		24 May 18:50:07 - Server listening on port 8000

Now modify myNodeServer.js or __any of the require()d files__ and hit Ctrl-S.

    DJs: playlist updated
    6 May 11:29:22 - Server listening on port 8000
    
If your main script is named _app.js_ you can use the short syntax:

		> node d.js
    
How it Works/Limitations
------------------------

DJs recursively parses your scripts to find require()d files, looking for lines such as

    var CSV = require(./csv);
    
It adds them to its *playlist* and watch all of these files for changes, using the fs.watchFile function.
It is currently unable to watch dynamically loaded dependencies:

    var dep = './csv';
    require(dep);
   
In the above case, changes occuring on 'csv.js' will not cause your script to restart.
    
Continuous-Testing
------------------

DJs can run a test file for you after every modifications:

    > node d.js app.js --test test.js
    
If your test file is _test.js_ or _test/test.js_ you can use the short syntax:

    > node d.js app.js -t
    
DJs can now be effectively used as an equivalent to _watchr_ for nodejs!

Package manager compatibility
-----------------------------

DJs intend to be compatible with the mains node packages managers, one way or another.