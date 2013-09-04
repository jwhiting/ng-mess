ng-mess
=======

sandbox for messing around with angular.js. public, but not useful to anyone else really

## running the app via HTTP

because of the usage of XmlHTTPRequest, the app needs to be actually hosted via
an HTTP webserver and can't just be loaded as files off the local disk. so, to
accomplish this i just use Python's SimpleHTTPServer module:

    $ cd ~/ng-mess/app1
    $ python -m SimpleHTTPServer

now visit http://localhost:8000/index.html


