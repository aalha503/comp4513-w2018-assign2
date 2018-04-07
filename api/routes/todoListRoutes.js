'use strict';
module.exports = function(app) {
 
 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
var stockSchema = new mongoose.Schema(
    {
    _id: Number,
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
*/


  // Routes are defined here
  app.route('/api/companies')
    .get(function(req, res) {
  	Stock.find({}, function(err, data) {
    if (err)
      res.send(err);
    res.json(data);
  });
});


  app.route('/api/company/:symbol')
    .get(function(req, resp){
   var symbol = req.params.symbol.toUpperCase();
    Stock.find({symbol: symbol}, function(err, data){
        if(err){
            resp.json({message: 'Unable to connect to stocks'});
        }
       	 else{
       	 console.log(symbol);
       	     //return JSON retrieved by Mongo as response
       	 resp.json(data)
       	 }
        }
    });
});

