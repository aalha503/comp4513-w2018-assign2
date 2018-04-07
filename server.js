var express = require('express'),
  app = express(),
  port = process.env.PORT || 5000,
  mongoose = require('mongoose'),
  //serverStockSchema = require('./api/models/todoListModel'), //created model loading here
  bodyParser = require('body-parser');
 var moment = require('moment');

  
// mongoose instance connection url connection
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://Abdul:Comp4513@ds125469.mlab.com:25469/heroku_ghq7zd4j');


//module.exports = function(app) {
  
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Schemas are defined here
var companiesSchema = new mongoose.Schema(
    {
    _id: Number,
    symbol: String,
    name: String,
    sector: String,
    subindustry: String,
    address: String,
    date_added: String,
    CIK: Number,
    frequency: Number
  }
);
var Company = mongoose.model('Company', companiesSchema);


var pricesSchema = new mongoose.Schema(
{
	date: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
    name: String
	}
);
var Price = mongoose.model('Price', pricesSchema);


// Routes are defined here
	//returns all companies
  app.route('/api/companies')
    .get(function(req, res) {
  	Company.find({}, function(err, data) {
    if (err)
      res.send(err);
    res.json(data);
  });
});

	//returns company based on symbol
  app.route('/api/company/:symbol')
    .get(function(req, resp){
     var symbol = req.params.symbol.toUpperCase();
    Company.find({symbol: symbol}, function(err, data){
        if(err){
            resp.json({message: 'Unable to connect to stocks'});
        }
       	 else{
       	 console.log(symbol);
       	 resp.json(data)
       	 }
        })
	});
	
	//returns the price info for each day in the specified month
	  app.route('/api/price/:name/:month')
    .get(function(req, resp){
     var name = req.params.name.toUpperCase();
     var month = req.params.month
     let startDate = new Date(2017,month-1,1).toISOString();//.substring(0,10);
     let endDate = new Date(2017,month,0).toISOString();//.substring(0,10);
     //let fDayStr = firstDay.substring(0,10);
   //  let lDayStr = lastDay.substring(0,10);

    Price.find({name: name, date: {$gte: startDate, $lte: endDate}},function(err, data){
        if(err){
            resp.json({message: 'Unable to connect to find price'});
        }
       	 else{
       	     //return JSON retrieved by Mongo as response
       	     console.log(month);
       	     console.log(startDate);
       	     //console.log(lastDay);
       	     console.log(endDate);
       	 resp.json(data)
       	 }
        })
	});

//returns company based on symbol
  app.route('/api/price/:name')
    .get(function(req, resp){
     var name = req.params.name.toUpperCase();
	var allMonths;
   	 Price.find({name: name}, function(err, data){
        if(err){
            resp.json({message: 'Unable to connect to stocks'});
        }
       	 else{
       	 console.log(name);
       	 allMonths = function(data){
       	 
       	 var a = moment('2017-01-01');
		 var b = moment('2017-12-31');
		 for (var m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
 		 console.log(m.format('YYYY-MM-DD'));
		}
		 };
       	 //all
       	 resp.json(data)
    	 console.log(allMonths);
       	 }
        })
	});
	
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//var routes = require('./api/routes/todoListRoutes'); //importing route
//routes(app); //register the route


app.listen(port);


console.log('server running on port ' + port);



