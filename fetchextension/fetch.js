const tabId = parseInt(window.location.search.substring(1));

async function send() {
  const textInput = document.querySelector('#textInput');
  const textOutput = document.querySelector('#textOutput');
  textOutput.value += `\nfetch('${textInput.value}')...\n`;
  console.log('sending runtime.evalute, tabId: ' + tabId + ', window.location.search: ' + window.location.search);
  chrome.debugger.sendCommand({tabId: tabId}, 'Runtime.evaluate', {expression: `fetch('${textInput.value}')`}, result => {
    console.log('Runtime.evaluate fetch result: ' + JSON.stringify(result))});
  /*try {
    const response = await fetch(textInput.value);
    textOutput.value += 'Response.url: ' + response.url + '\n';
    textOutput.value += 'Response.text(): ' + await response.text() + '\n';
  } catch (err) {
    textOutput.value += 'fetch() threw error:\n' + err;
  }*/
}

async function onEvent(debuggeeId, message, params) {
  const textOutput = document.querySelector('#textOutput');
  textOutput.value += 'onEvent()\n';
  textOutput.value += '  debuggeeId: ' + JSON.stringify(debuggeeId);
  textOutput.value += '  message: ' + JSON.stringify(message);
  textOutput.value += '  params: ' + JSON.stringify(params);
}

window.addEventListener('load', function() {
  const main = document.querySelector('#main');

  const textInput = document.createElement('input');
  textInput.setAttribute('type', 'text');
  textInput.setAttribute('id', 'textInput');
  textInput.value = '/data.txt';
  main.appendChild(textInput);

  const button = document.createElement('input');
  button.setAttribute('type', 'button');
  button.setAttribute('value', 'send!');
  button.addEventListener('click', send);
  main.appendChild(button);

  const outputDiv = document.createElement('div');
  main.appendChild(outputDiv);

  textOutput = document.createElement('textarea');
  textOutput.setAttribute('id', 'textOutput');
  textOutput.setAttribute('rows', '30');
  textOutput.setAttribute('cols', '80');
  textOutput.value = 'output text field\n';
  outputDiv.appendChild(textOutput);

  chrome.debugger.onEvent.addListener(onEvent);
});

window.addEventListener('unload', function() {
  chrome.debugger.detach({tabId: tabId});
});
