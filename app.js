var fs = require('fs');


var dive = function dive(dir, action) {
  if (typeof action !== 'function')
    action = function (error, file) { };

  fs.readdir(dir, function (err, list) {
    if (err) {
      return action(err);
    }

    list.forEach(function (file) {
      if (file === 'node_modules' || file[0] === '.') {
        return;
      }
      var path = dir + '/' + file;
      fs.stat(path, function (err, stat) {
        if (stat && stat.isDirectory()) {
          dive(path, action);
        } else {
          if (path.indexOf('js') > 0 ) {
            console.log('JS file found: ', path);
            action(null, path);
          }
        }
      });
    });
  });
};

var targetDir = '/some/dir/mytest';

dive(targetDir, function(error, path) {
  if (!error) {
    var content = fs.readFileSync(path, {
      encoding: 'utf8'
    });
    var noTabs = content.replace(/\t/g, '  ');
    fs.writeFile(path, noTabs);
  }
});
