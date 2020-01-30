var fs = require('fs');
var archiver = require('archiver');
 
var output = fs.createWriteStream('chrome-extension.zip');
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});
 
output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});
 
output.on('end', function() {
  console.log('Data has been drained');
});
 
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.log(err);
  } else {
    // throw error
    throw err;
  }
});
 
archive.on('error', function(err) {
  throw err;
});
 
archive.pipe(output);
 
archive.directory('amazon without prime/', false);
 
// finalize the archive (ie we are done appending files but streams have to finish yet)
// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
archive.finalize();