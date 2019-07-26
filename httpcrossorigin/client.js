//fetch('http://127.0.0.1:8000/asdf', {credentials: 'include'});
document.rofl = () => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://127.0.0.1:8000/asdf');
  xhr.send();
};

const main = document.getElementById('main');
document.asdf = () => {
  const image = document.createElement('img');
  main.appendChild(image);
  image.src = '/delay';
};
