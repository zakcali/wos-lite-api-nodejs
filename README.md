# wos-lite-api-nodejs
Web of Science soap API access with nodejs (javascript)

Proof of concept: get Web of Science articles; page by page with SOAP api, from: http://search.webofknowledge.com/esti/wokmws/ws/WokSearchLite?wsdl, 
find Quartiles of articles, and print them.
It was difficult than php/python, because nodejs is async. You need to handle asyncronus data (page by page size=100) obtained from WOS, process pages un-sequentially, wait for all pages to be retrieved, then print.
You can change retrieveDelay value according to throttle messages got from WOS
I need to prevent callback hell. I'm new to nodejs. You could fork and produce better code than me by using async/await.
Reads quartile values of journals according to their issn/essin numbers from a list created on 2020.
AHCI publications don't have quartile values, so marked with AH

Quartile values change every year, so don't trust quartile values for articles published outside of 2019-2020 period

There weren't examples for nodejs, but for php, python, and ruby:

https://gist.github.com/pol/1321660 

https://gist.github.com/domoritz/2012629

To prevent throttle messages during debugging, after getting SID value, note it, and then paste to 12nd line as: 

let wSID = 'xxxaaabbbtttuuuqyyy';

You can use same SID value for hours

It was difficult for me to learn async/await/.then commands. I tried but couln't use promises. I couldn't believe the code works now even without using setTimeout command !! I don't use retrieveDelay variable anymore.

I suggest you to read 25.9.2 on https://exploringjs.com/es6/ch_promises.html
```
 getqList()
 .then(result1 => {return getSid();})
 .then(result2 => {return retrieveArticles();})
 .then(result3 => {printToConsole ();})	
```
  you could do whatever you want with pubArray[] in place of {printToConsole ();} above code
 ``` 
  while(pubArray.length > 0) {
    pubArray.pop();
}
```
  I suggest you to empty pubArray [], before retrieving for second and subsequent queries with above code
