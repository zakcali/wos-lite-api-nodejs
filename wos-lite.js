const soap = require ('soap');
const fs = require('fs');
const auth_url = 'http://search.webofknowledge.com/esti/wokmws/ws/WOKMWSAuthenticate?wsdl';
const search_url = 'http://search.webofknowledge.com/esti/wokmws/ws/WokSearchLite?wsdl';
const preArticle= 'https://gateway.webofknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=Publons&SrcAuth=Publons_CEL&KeyUT=';
const postArticle = '&DestLinkType=FullRecord&DestApp=WOS_CPL';
const preCitation = 'https://gateway.webofknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=Publons&SrcAuth=Publons_CEL&KeyUT=';
const postCitation = '&DestLinkType=CitingArticles&DestApp=WOS_CPL';
const preDoi='https://doi.org/';
var eissnq1List = eissnq2List = eissnq3List = eissnq4List = eissnahList = []; 
var issnq1List = issnq2List = issnq3List = issnq4List = issnahList = []; 
let wSID = '';
var countLimit=0;  // 0=> there is no limit
var printQuartile=true;
var printLinks=true;
var printOrder=true;
var printToScreen=true;
const retrieveDelay=800; //call retrieve function every .... ms between 800-2000 enough
var pubArray= new Array ([]);
var arrayLength=0;

//let advText = 'AI=U-7339-2017';
//let advText = 'OG=(Baskent University)'
let advText= 'AD=(harvard univ SAME Med*) '
let editions = [];
editions.push({'collection':'WOS', 'edition':'SCI'});
editions.push({'collection':'WOS', 'edition':'SSCI'});
editions.push({'collection':'WOS', 'edition':'AHCI'});
//editions.push({'collection':'WOS', 'edition':'ISTP'});
//editions.push({'collection':'WOS', 'edition':'ISSHP'});
//editions.push({'collection':'WOS', 'edition':'IC'});
//editions.push({'collection':'WOS', 'edition':'CCR'});
//editions.push({'collection':'WOS', 'edition':'BSCI'});
//editions.push({'collection':'WOS', 'edition':'BHCI'});
let sortField = 'PY'; // AU= author, PY=Publication year, TC=Times cited, SO=Source, CW=Source, LD=Load date
let sortOrder = 'D'; // A=ascending, D=descending
let timespanBegin='2020-01-01';
let timespanEnd='2030-12-31';
let timeSpan = [{'begin': timespanBegin, 'end':timespanEnd}];

let retrieveParameters = [ {'count':'2', 'firstRecord':'1'}];

let search_object = {
  'queryParameters' : [{
	'databaseId' : 'WOS',
    'userQuery' : advText,
    'editions' : editions,
	'timeSpan': timeSpan,
	'queryLanguage': 'en'}],
	'retrieveParameters': retrieveParameters
}

getqListRetrieve();

function printToConsole () {

for (k=0; k<arrayLength; k++) {
let publicationLine='';
	if (printOrder == true) {
			publicationLine=(k+1)+'- ' }
publicationLine = publicationLine
+pubArray[k][0]+pubArray[k][1]+'. '+pubArray[k][2]+' '+pubArray[k][3]+';'+pubArray[k][4]+pubArray[k][5]+pubArray[k][6]
+' '+pubArray[k][7]+', '+pubArray[k][8]+', '+pubArray[k][9]+', '+' doi='+pubArray[k][10]+', '+'Number of authors='+pubArray[k][11]

if (printQuartile==true) {
	publicationLine=publicationLine+', '+pubArray[k][12];}
if (printLinks==true) {
	publicationLine=publicationLine+', '+pubArray[k][13]+', '+pubArray[k][14]+', '+pubArray[k][15];}
if (printToScreen==true){
	console.log (publicationLine); }
	}
}

function getqListRetrieve () {
if ((!eissnq1List.length)) {
	eq1();
	} // start callback ladder to be able to finish reading all Q files befor WOS search
else {
	retrieve();
	} // call the function because all text files already}
function eq1 () {fs.readFile ('eissnq1.txt', 'utf8', (err,data) => {
	if(err) {console.log('quartile file reading error'); return; }
	eissnq1List = data.toString().replace(/[^\x00-\x7F]/g,'').replace(/\r/g, '').split("\n"); // remove BOM. Remove '\r', because on windows, newline = '\r\n'
	eq2() //callback hell - ladder 
	}) } 
eq2 = () => {fs.readFile ('eissnq2.txt', 'utf8', (err,data) => {
	if(err) {console.log('quartile file reading error'); return; }
	eissnq2List = data.toString().replace(/[^\x00-\x7F]/g,'').replace(/\r/g, '').split("\n"); // remove BOM. Remove '\r', because on windows, newline = '\r\n'
	eq3() }) }
eq3 = () => {fs.readFile ('eissnq3.txt', 'utf8', (err,data) => {
	if(err) {console.log('quartile file reading error'); return; }
	eissnq3List = data.toString().replace(/[^\x00-\x7F]/g,'').replace(/\r/g, '').split("\n"); // remove BOM. Remove '\r', because on windows, newline = '\r\n'
	eq4() }) }
eq4 = () => {fs.readFile ('eissnq4.txt', 'utf8', (err,data) => {
	if(err) {console.log('quartile file reading error'); return; }
	eissnq4List = data.toString().replace(/[^\x00-\x7F]/g,'').replace(/\r/g, '').split("\n"); // remove BOM. Remove '\r', because on windows, newline = '\r\n'
	eah() }) }
eah = () => {fs.readFile ('eissnahci.txt', 'utf8', (err,data) => {
	if(err) {console.log('quartile file reading error'); return; }
	eissnahList = data.toString().replace(/[^\x00-\x7F]/g,'').replace(/\r/g, '').split("\n"); // remove BOM. Remove '\r', because on windows, newline = '\r\n'
	iq1() }) }
iq1 = () => {fs.readFile ('issnq1.txt', 'utf8', (err,data) => {
	if(err) {console.log('quartile file reading error'); return; }
	issnq1List = data.toString().replace(/[^\x00-\x7F]/g,'').replace(/\r/g, '').split("\n"); // remove BOM. Remove '\r', because on windows, newline = '\r\n'
	iq2() }) }
iq2 = () => {fs.readFile ('issnq2.txt', 'utf8', (err,data) => {
	if(err) {console.log('quartile file reading error'); return; }
	issnq2List = data.toString().replace(/[^\x00-\x7F]/g,'').replace(/\r/g, '').split("\n"); // remove BOM. Remove '\r', because on windows, newline = '\r\n'
	iq3() }) }
iq3 = () => {fs.readFile ('issnq3.txt', 'utf8', (err,data) => {
	if(err) {console.log('quartile file reading error'); return; }
	issnq3List = data.toString().replace(/[^\x00-\x7F]/g,'').replace(/\r/g, '').split("\n"); // remove BOM. Remove '\r', because on windows, newline = '\r\n'
	iq4() }) }
iq4 = () => {fs.readFile ('issnq4.txt', 'utf8', (err,data) => {
	if(err) {console.log('quartile file reading error'); return; }
	issnq4List = data.toString().replace(/[^\x00-\x7F]/g,'').replace(/\r/g, '').split("\n"); // remove BOM. Remove '\r', because on windows, newline = '\r\n'
	iah() }) }
iah = () => {fs.readFile ('issnahci.txt', 'utf8', (err,data) => {
	if(err) {console.log('quartile file reading error'); return; }
	issnahList = data.toString().replace(/[^\x00-\x7F]/g,'').replace(/\r/g, '').split("\n"); // remove BOM. Remove '\r', because on windows, newline = '\r\n'
	retrieve() }) } // all quartile files are red, free to call retrieve()
} // end of function getqList ()


function retrieve () {

getSidReadFirstPrintAll()


function getSidReadFirstPrintAll (){
if (wSID === '') { 	// get SID if already not obtained
	soap.createClient(auth_url, (err,auth_client) => {
		if (err) {
			console.log ('cannot connect to Web of Science');
			return;
				}
getSID (auth_client)		
		})
	}
else readFirst();	
}

function getSID (a_Client) {
a_Client.authenticate ((err, result) => {
	if (err) {
		console.log ('authenticate error:', err.message)
		if (err.message.includes('No matches returned for IP')) {
			console.log ('sorry, yor ip is not authenticated')
			}
		return;
		}
wSID=result.return;
readFirst();
	})
}

function readFirst() {

soap.createClient(search_url, function (err,search_client) {
	if (err) {
		console.log ('createClient error:', err.message);
		return;
		}
search_client.addHttpHeader('Cookie', 'SID=' + wSID)
search_client.search(search_object , (err, result) =>{
	if (err) {
		console.log ('search error:', err.message);
		return;
		}
retrieveArticles (result.return, search_client)
		})
	}) 

}
function retrieveArticles (firstResult, s_client) {
	arrayLength=firstResult.recordsFound;
	currentWindow=0;
	windowCount= ( (arrayLength/100) | 0)+1 // convert to integer, then compare if currentWindow = windowCount, then print array
	for (kk=0; kk<arrayLength; kk++) {
		pubArray.push([0]); // create empty elements on publication array
	}
	queryId = firstResult.queryId;
	console.log ('sessionID =', wSID, ',queryID =', queryId) 
	console.log ('Between '+timespanBegin, ' and ', timespanEnd, ', number of articles indexed in Web of Science Q1,Q2,Q3,Q4/AHCI are:', arrayLength)
	if (arrayLength===0) {
		return
	}
	retCount = arrayLength;
	if (countLimit > 0 && countLimit < arrayLength) { // for faster debugging
		retCount=countLimit; } 			// limit number of articles retrieved
	retBase = 1; //first record to be retrieved
	recNumber=0; // record number to be printed on the beginnig of lines
	timer=setInterval (retrieveHundred,retrieveDelay); // call every ...... ms, to prevent  Web of Science giving throttle error 

function retrieveHundred () {
if (retCount < 0) {return;}
if (retCount <100)
	{pageSize = retCount;}
	else pageSize = 100;
let retrieve_object = {
	'queryId' : queryId,
	'retrieveParameters': [ 
		{'firstRecord': retBase, 'count': pageSize,
		'sortField' : [ {'name':sortField, 'sort':sortOrder }],
		'viewField': [{'fieldName': ['name', 'title']}]
		}]
}
console.log ('number of articles to be retrieved=', pageSize, ' starting with',retBase)
retBase=retBase+100;
retCount=retCount-100;
clientRetrieve(retBase-100, pageSize)

function clientRetrieve (start, size) {
if (pageSize<0) {return;} 
	s_client.retrieve(retrieve_object , (err, result) => {
	if (err) {
		console.log ("couldn't retrieve 100", err.message);
		return;
		}
	else {
		currentWindow++;
	console.log (result.return.records[0].uid, start, 'current Window:', currentWindow) // WOS of first article
	handleHundred (result.return, start, size); }
	if (retCount < 0) {
		clearInterval (timer);
		if (currentWindow==windowCount) {printToConsole();} // all pages retrieved and handled asynchronously
		}
	
}) }

function handleHundred (articles, firstArray) {
var j=i = 0;
	for (i=0; i<articles.records.length; i++) {

		let authors = title=journal=year=pubdate=issue=volume=pages=articleNo=doi=doiLink=issn=eissn=quartile=docType=docSubtype='';
		let wos= articles.records[i].uid;
		let wosLink = preArticle+wos+postArticle
		let wosCitationLink= preCitation+wos+postCitation

		let authorArray=articles.records[i].authors[0].value.slice(0) // replicate authors
		let nAuthors=authorArray.length;

		for (j=0; j<articles.records[i].authors[0].value.length; j++) {
			authors = authors+authorArray[j]
			 if (j==nAuthors-1) { // this is the last author
				 if (authors.endsWith('.')) {
					 authors=authors+' '; }
				 else {authors=authors+'. '; } // print . after last author
			 }
			 else  {
				 authors=authors+';'; // print ; after each author
			 }
			}
		let titleObj= articles.records[i].title.find (tt =>tt.label==='Title');
		if (titleObj) {title=titleObj.value[0];}
		
		let journalObj= articles.records[i].source.find (j =>j.label==='SourceTitle');
		if (journalObj) {journal=journalObj.value[0];}

		let yearObj=articles.records[i].source.find (y=>y.label==='Published.BiblioYear');
		if (yearObj) {year=yearObj.value[0];}

		let dateObj=articles.records[i].source.find (pd=>pd.label==='Published.BiblioDate'); // just didn't print it
		if (dateObj) {pubdate=dateObj.value[0];} 

		let issueObj= articles.records[i].source.find (is =>is.label==='Issue');
		if (issueObj) {issue=issueObj.value[0];}

		let volumeObj= articles.records[i].source.find (v =>v.label==='Volume');
		if (volumeObj) {volume='('+volumeObj.value[0]+')';}

		let pagesObj= articles.records[i].source.find (p =>p.label==='Pages');
		if (pagesObj) {pages=pagesObj.value[0];}

		let artObj= articles.records[i].other.find (ar =>ar.label==='Identifier.article_no');
		if (artObj) {articleNo=artObj.value[0];}

		let doi1Obj= articles.records[i].other.find (d1 =>d1.label==='Identifier.Doi');
		if (doi1Obj) {doi=doi1Obj.value[0];}
		else {
			let doi2Obj= articles.records[i].other.find (d2 =>d2.label==='Identifier.Xref_Doi');	
			if (doi2Obj) {doi=doi2Obj.value[0];}
		}
		if (doi !== '') {doiLink=preDoi+doi}
		
		docType=articles.records[i].doctype[0].value[0];
		docSubtype=articles.records[i].doctype[0].value[1];
		docTypePrint = docType;
		if (docSubtype !== undefined ) {
			docTypePrint=docType+';'+docSubtype;}

		let issnObj= articles.records[i].other.find (is =>is.label==='Identifier.Issn');
		if (issnObj) {issn=issnObj.value[0];}

		let eissnObj= articles.records[i].other.find (es =>es.label==='Identifier.Eissn');
		if (eissnObj) {eissn=eissnObj.value[0];}

	if (issn=='') {issn ='ignore'} 
	if (eissn=='') {eissn ='ignore'} // danger!! empty eissn causes quartile to be Q1
	quartile = 'Q?'; // unknown, not in the list
	
	if (issnq1List.indexOf(issn) > -1 || eissnq1List.indexOf(eissn) > -1)
			{ quartile = 'Q1';}
	else if (issnq2List.indexOf(issn) > -1 || eissnq2List.indexOf(eissn) > -1)
			{ quartile = 'Q2';}
	else if (issnq3List.indexOf(issn) > -1 || eissnq3List.indexOf(eissn) > -1)
			{ quartile = 'Q3';}
	else if (issnq4List.indexOf(issn) > -1 || eissnq4List.indexOf(eissn) > -1)
			{ quartile = 'Q4';}
	else if (issnahList.indexOf(issn) > -1 || eissnahList.indexOf(eissn) > -1)
			{ quartile = 'AH';}

	pubArray[firstArray-1+i][0]=authors;
	pubArray[firstArray-1+i][1]=title;
	pubArray[firstArray-1+i][2]=journal;
	pubArray[firstArray-1+i][3]=year;
	pubArray[firstArray-1+i][4]=issue;
	pubArray[firstArray-1+i][5]=volume;
	pubArray[firstArray-1+i][6]=pages;
	pubArray[firstArray-1+i][7]=articleNo;
	pubArray[firstArray-1+i][8]=docTypePrint;
	pubArray[firstArray-1+i][9]=wos;
	pubArray[firstArray-1+i][10]=doi;
	pubArray[firstArray-1+i][11]=nAuthors;
	pubArray[firstArray-1+i][12]=quartile;
	pubArray[firstArray-1+i][13]=doiLink;
	pubArray[firstArray-1+i][14]=wosLink;
	pubArray[firstArray-1+i][15]=wosCitationLink;
	pubArray[firstArray-1+i][16]=issn;
	pubArray[firstArray-1+i][17]=eissn;
	pubArray[firstArray-1+i][18]=docType;
	pubArray[firstArray-1+i][19]=docSubtype;
	}

			} // end of handleHundred			
		} //end of retrieveHundred ()
	} // end of retrieveArticles ()
} // end of retrieve ()


