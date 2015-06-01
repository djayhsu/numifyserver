var pg = require('pg')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// ******************************
// ****** INITIALIZATION ********
// ******************************

// Allows us to parse the incoming request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connects to postgres once, on server start
var conString = process.env.DATABASE_URL || "postgres://localhost/action";
var db;
pg.connect(conString, function(err, client) {
	if (err) {
		console.log(err);
	} else {
		db = client;
	}
});

// Homepage
app.get('/', function (req, res) {
  res.send('Numify API');
});

// ************************************************************
// ******************* DATA LAYER *****************************
// ************************************************************

// Save user rating numbers and dictations
app.post('/users/:id', function(req, res) {
  db.query("INSERT INTO users (name, dictation, rating, created) VALUES ($1, $2, $3, NOW())", [req.params.name, req.body.dictation, req.body.rating], function(err, result) {
    if (err) {
      	res.status(500).send(err);
    } else {
    	console.log(result)
      	res.send(result);
    }
  });
});

// Get users out of database
app.get('/users/:id', function (req, res) {
  console.log(db);
  db.query("SELECT name FROM users ORDER BY created", [req.body.name], function(err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result.rows);
    }
  })
});

//

//Start the actual server
var server = app.listen(process.env.PORT, function () {
	// server is actually running!
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
})
 