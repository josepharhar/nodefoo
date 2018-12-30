// https://github.com/GoogleChrome/puppeteer/issues/795

const http = require('http');
const puppeteer = require('puppeteer');

const ORIGINAL_DATA = Buffer.from(JSON.stringify({'msg': '测试'}));


function serve() {
    http.createServer(function (req, res) {
        // The correct header should be 'application/json; charset=utf-8'
        // but I change it to 'text/plain' to  REPRODUCE THE BUG
        //res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.writeHead(200);
        res.end(ORIGINAL_DATA);
    }).listen(8001);

}

async function responseSuccess(res) {
    let dataReceived = await res.buffer();
    console.log('Received:\n', dataReceived);
    console.log('Original:\n', ORIGINAL_DATA);
    console.log('\n')
}

async function doRequest() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.on('response', responseSuccess);
    let res = await page.goto('http://localhost:8001');
}


serve();
doRequest();

