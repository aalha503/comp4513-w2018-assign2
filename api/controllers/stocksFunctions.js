'use strict';

//var mongoose = require('mongoose'),
//Stock = mongoose.model('Stock');


exports.get_all_stocks = function(req, res) {
  Stock.find({}, function(err, data) {
    if (err)
      res.send(err);
    res.json(data);
  });
};


exports.get_by_symbol = function(req, resp){
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
    });
};

