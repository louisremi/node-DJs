node-DJs
========

Tired of restarting a script every time you modify it or its dependencies? Drop a DJ in da place!

    > node d.js myNodeServer.js
    DJs: "Party time!"
    6 May 11:27:48 - Server listening on port 8000

Now modify myNodeServer.js or __any of the require()ed files__ and hit Ctrl-S.

    DJs: playlist updated
    6 May 11:29:22 - Server listening on port 8000
    
Continuous-Testing
------------------

DJs will soon be able to run tests in the background while restarting your scripts.

Package manager compatibility
-----------------------------

DJs intend to be compatible with main node package managers, one way or another.