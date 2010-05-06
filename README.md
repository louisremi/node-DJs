node-DJs
========

Tired of restarting a script every time you modify it or its dependencies? Drop a DJ in da place!

    > node d.js myNodeServer.js
    DJs: "Party time!"
    6 May 11:27:48 - Server listening on port 8000

Now modify myNodeServer.js or __any of the require()d files__ and hit Ctrl-S.

    DJs: playlist updated
    6 May 11:29:22 - Server listening on port 8000
    
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

DJs will soon be able to run tests in the background while restarting your scripts.
DJs could effectively be an equivalent to _watchr_ for nodejs.

Package manager compatibility
-----------------------------

DJs intend to be compatible with the mains node packages managers, one way or another.