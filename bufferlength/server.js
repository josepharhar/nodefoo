const fs = require('fs');
const stream = require('stream');

class CustomTransformer extends stream.Transform {
  constructor(totalLength) {
    super();
    this._totalLength = totalLength;
    this._elapsedLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this._elapsedLength += chunk.length;

    console.log('_transform');
    console.log('  chunk: ' + chunk);
    console.log('  encoding: ' + encoding);
    //console.log('  chunk.constructor.name: ' + chunk.constructor.name);
    console.log('  this._elapsedLength: ' + this._elapsedLength);
    console.log('    this._totalLength: ' + this._totalLength);

    // optionally push data
    this.push(chunk);

    // requiredly call callback
    callback();
  }

  _flush() {
    // input stream has ended
  }
}

(async () => {
  
  const filename = 'hello.txt';

  const filesize = fs.statSync(filename).size;
  console.log('filesize: ' + filesize);
  const readstream = fs.createReadStream(filename, {
    //encoding: 'binary'
  });

  readstream
    .pipe(new CustomTransformer(filesize))
    .pipe(fs.createWriteStream('output.txt'));
})();
