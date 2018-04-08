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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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


var usersSchema = new mongoose.Schema(
{
	id:String,
	first_name: String,
	last_name: String,
	email: String,
	salt: String,
	password: String
	}  
);
var User = mongoose.model('User', usersSchema);


var portfoliosSchema = new mongoose.Schema(
{
	id: Number,
    symbol: String,
    user: Number,
    owned: Number
	}
);
var Portfolio = mongoose.model('Portfolio', portfoliosSchema);



// Routes are defined here
	//returns all companies
  app.route('/api/companies')
    .get(function(req, res) {
  	Company.find({}).sort({name:1}).exec(function(err, data) {
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
	
	//returns the price info for each day in a specified month
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
       	     //console.log(month);
       	     //console.log(startDate);
       	     //console.log(lastDay);
       	     //console.log(endDate);
       	 resp.json(data)
       	 }
        })
	});

//returns the average close value for each month in the year
  app.route('/api/avg/price/:name')
    .get(function(req, resp){
     var theName = req.params.name.toUpperCase();
   	 Price.aggregate([
   	 				  {$match : {name: theName}},
   	 				  {$group: { 
   	 				  	_id : {
   	 				  		$substr: [ "$date", 5, 2]}, 
   	 				  	    Avg : {$avg :"$close"}}},
   	 				  { $sort : { "_id": 1, "Avg" : 1 }}],function(err, data){
        if(err){
            resp.json({message: 'Unable to connect to find average price for each month'});
        }
       	 else{
       	 resp.json(data)
       	 }
    	})
    });

//returns the price information for a specific date
    app.route('/api/price/info/:name/:cDate')
    .get(function(req, resp){
     var theName = req.params.name.toUpperCase();
     var theDate = req.params.cDate;
     var year = theDate.substring(0,4);
     var month = theDate.substring(4,6);
     var day = theDate.substring(6,8)
     var fullDate = year + "-" + month + "-" + day; 
     console.log(theDate);
     console.log("year " + year);
     console.log("month " + month);
     console.log("day: " + day);
     console.log("full date " + fullDate);
   	 Price.aggregate([
   	 				  {$match : {name: theName, date: fullDate}}],function(err, data){
        if(err){
            resp.json({message: 'Unable to connect to find average price for each month'});
        }
       	 else{
       	 resp.json(data)
       	 }
    	})
    });
	
//returns the latest price information for the newest date
app.route('/api/final/price/:name')
    .get(function (req,resp) {
    	var name = req.params.name.toUpperCase();
        Price.find({name: name}).
            select('date open high low close volume').sort({"date": -1}).limit(1).exec(
         function(err,data){
        if(err){
            resp.json({ message: 'Unable to connect to users' });
        }
        else
        {
        	//console.log("here yo");
            resp.json(data);
        }
    }); 
  });
  
  
//returns portfolio info for a specific user
app.route('/api/portfolio/:id')
    .get(function(req, resp) {
    var id = req.params.id
  	Portfolio.find({user : id}, function(err, data) {
    if (err){
    resp.json({ message: 'Unable to find portfolio for user' });
    }
    else{
    console.log(id);
    res.json(data);
    }
  });
});
	

//checks for logins
app.route('api/user/:email/:password')
	.get(function(req, resp){
	var email = req.params.email;
	var password = req.params.password;
	var theUser;
	User.find({email: email},function(err,data){
		console.log(email);
		if(err){
		resp.json({ message: 'User does not exist' });
		console.log('User does not exist');
		}
		else{
		theUser = data;
		console.log(email)
		}
		})})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//var routes = require('./api/routes/todoListRoutes'); //importing route
//routes(app); //register the route


app.listen(port);


console.log('server running on port ' + port);



