# wos-lite-api-nodejs
Web of Science soap api, articles retrived by nodejs

Proof of concept: get Web of Science articles; page by page with SOAP api, from: http://search.webofknowledge.com/esti/wokmws/ws/WokSearchLite?wsdl, find Quartiles of articles, and print them.
It was difficult then php, because nodejs is async. You need to handle asyncronus dat got feom WOS, process pages un-sequentially, wait for all pages to be retrieved, then print.
You can chang retrieveDelay value according to throttle messages got from WOS
I need to prevent callback hell.
Read quartile values of journals according to their issn/essin numbers from a list created on 2020.
AHCI publications don't have quartile values, so marked with AH
Quartile values changes every year, so don't trust quartile values for articles published outside of 2019-2020 period

there weren't examples for nodejs, but for php, python, and ruby:

https://gist.github.com/pol/1321660 

https://gist.github.com/domoritz/2012629


