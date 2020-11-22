# wos-lite-api-nodejs
Web of Science soap API access with nodejs (javascript)

Proof of concept: get Web of Science articles; page by page with SOAP api, from: http://search.webofknowledge.com/esti/wokmws/ws/WokSearchLite?wsdl, find Quartiles of articles, and print them.
It was difficult then php, because nodejs is async. You need to handle asyncronus dat got feom WOS, process pages un-sequentially, wait for all pages to be retrieved, then print.
You can chang retrieveDelay value according to throttle messages got from WOS
I need to prevent callback hell.
Read quartile values of journals according to their issn/essin numbers from a list created on 2020.
AHCI publications don't have quartile values, so marked with AH

Quartile values change every year, so don't trust quartile values for articles published outside of 2019-2020 period

There weren't examples for nodejs, but for php, python, and ruby:

https://gist.github.com/pol/1321660 

https://gist.github.com/domoritz/2012629

To prevent throttle messages during debugging, after getting SID value, note it, and then paste to 13th line as: let wSID = 'xxxaaabbbtttuuuqyyy';

You can use same SID value for hours



