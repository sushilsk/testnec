
//console.log(process.env);
//if (process.env.NODE_ENV !== 'production') {
//  require('dotenv').load();
//}

var express = require('express'),
app = express(),
port = process.env.PORT || 3000;
const CONCURRENCY = process.env.WEB_CONCURRENCY || 1;
bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/TestRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('NEC Test Redis API server started on: ' + port);