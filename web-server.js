var mongoose = require('mongoose');
var express = require("express");
var parser = require("body-parser");

mongoose.connect('mongodb://aalha503:+eg89Jle@ds135983.mlab.com:35983/funwebdev');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: ')); 
db.once('open', function callback (){
    console.log("connected to mlab mongo");
})

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

//returns all companies
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

