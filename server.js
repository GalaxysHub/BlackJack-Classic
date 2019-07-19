var express = require('express');
var serveStatic = require('serve-static');
app = express();

app.use(express.static('public'));

var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);

app.get('/', function (req, res) {
  res.redirect('/index.html');
})
