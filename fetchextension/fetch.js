async function send() {
  const textInput = document.querySelector('#textInput');
  const textOutput = document.querySelector('#textOutput');
  textOutput.value += `\nfetch('${textInput.value}')...\n`;
  try {
    const response = await fetch(textInput.value);
    textOutput.value += 'Response.url: ' + response.url + '\n';
    textOutput.value += 'Response.text(): ' + await response.text() + '\n';
  } catch (err) {
    textOutput.value += 'fetch() threw error:\n' + err;
  }
}

window.onload = function() {
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
  //button.setAttribute('onclick', 'send()');
  main.appendChild(button);

  const outputDiv = document.createElement('div');
  main.appendChild(outputDiv);

  textOutput = document.createElement('textarea');
  textOutput.setAttribute('id', 'textOutput');
  textOutput.setAttribute('rows', '30');
  textOutput.setAttribute('cols', '80');
  textOutput.value = 'output text field\n';
  outputDiv.appendChild(textOutput);
}
