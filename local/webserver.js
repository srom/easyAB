/**
 * Simple local web dev server using nodejs and connect.
 */

var connect = require('connect'),
    http = require('http');

var app = connect()
  .use(connect.static('/Users/srom/workspace/easyAB/gh-pages'));

http.createServer(app).listen(3000);

console.log('Server running at http://127.0.0.1:3000/');
