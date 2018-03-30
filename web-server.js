var mongoose = require("mongoose");
var express = require("express");
var parser = require("body-parser");

//connecting to mongo. Source: https://devcenter.heroku.com/articles/nodejs-mongoose
var upstring = 
process.env.MONGODB_URI ||
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/HelloMongoose';

//server will listen to appropriate port or default to port 5000
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.
    mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
    });

/*
						FROM NODE LAB 2
mongoose.connect('mongodb://Abdul:Comp4513@ds125469.mlab.com:25469/heroku_ghq7zd4j');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: ')); 
db.once('open', function callback (){
    console.log("connected to mlab mongo");
})
*/
var stockSchema = new mongoose.Schema(
    {
    symbol: String,
    name: String,
    sector: String,
    subindustry: String,
    address: String,
    date_added: Date,
    CIK: Number,
    frequency: Number
  }
);

var Stock = mongoose.model('Stock', stockSchema);

//wiring for express
var app = express();
app.use(parser.json);
app.use(parser.urlencoded({extended:true}));

//returns a single stock
app.route('api/companies/:symbol')
.get(function(req, res){
    Stock.find({symbol: req.params.symbol}, function(error, data){
        if (error){
            res.json({message: 'Stock not found'})
        }
        else {
            res.json(data);
        }
    });
});

