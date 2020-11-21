# wos-lite-api-nodejs
Web of Science soap api, articles retrived by nodejs

Proof of concept: get Web of Science articles; page by page with SOAP api, from: http://search.webofknowledge.com/esti/wokmws/ws/WokSearchLite?wsdl, find Quartiles of articles, and print them.
It was difficult then php, because nodejs is async. You need to handle asyncronus dat got feom WOS, process pages un-sequentially, wait for all pages to be retrieved, then print.
You can chang retrieveDelay value according to throttle messages got from WOS
I need to prevent callback hell.

there weren't an example for nodejs, but for php, python, and ruby:
https://gist.github.com/pol/1321660 

https://gist.github.com/domoritz/2012629


