node-DJs
========

Tired of restarting a script everytime you modify it or its dependencies? Drop a DJ in da place!

    > node d.js myNodeServer.js
    DJs: "Party time!"
    6 May 11:27:48 - Server listening on port 8000

Now modify myNodeServer.js or _any of the require()ed files_ and hit Ctrl-S.

    DJs: playlist updated
    6 May 11:29:22 - Server listening on port 8000
    
Continuous-Testing
------------------

DJs will soon be able to run tests in the background while restarting your scripts.

Package manager compatibility
-----------------------------

DJs intend to be compatible with main node package manager, one way or another.