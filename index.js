var parser = require('body-parser');
var express = require('express');
var app = express();
var mongoose = require('mongoose');


mongoose.connect('mongodb://Abdul:Comp4513@ds125469.mlab.com:25469/heroku_ghq7zd4j');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: ')); 
db.once('open', function callback (){
    console.log("connected to mlab mongo");
});


// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//app.get('/api/companies', function(request, response) {
//  response.render('pages/index')
//});

//app.get('/cool', function(request, response) {
//  response.send(cool());
//}

app.set('port', (process.env.PORT || 5000));
//app.use(express.static(__dirname + '/public'));


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

//tell node to use json and HTTP header features in body-parser
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
        	console.log('response should be sent now!');
            res.json(data);
        }
    });
});

app.get('/api/companies', function(req, res){
    Stock.find({}, function(error, data){
        if (error){
            res.json({message: 'Stock not found'})
        }
        else {
            res.json(data);
            console.log("yes");
        }
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });


