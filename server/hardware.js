const { exec } = require('child_process');

function listMice() {
  return new Promise((resolve, reject) => {
    exec('evtest --list-devices', (error, stdout) => {
      if (error) return reject(error);
      
      const devices = stdout.split('\n')
        .filter(line => line.includes('Mouse'))
        .map(line => ({
          name: line.split('"')[1],
          path: line.match(/\/dev\/input\/event\d+/)[0]
        }));
      
      resolve(devices);
    });
  });
}

module.exports = { listMice };