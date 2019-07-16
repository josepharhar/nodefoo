const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static(__dirname));

app.get('/asdf', (req, res) => {
  res.send('hello from /asdf');
});

app.listen(8000, 'localhost');
