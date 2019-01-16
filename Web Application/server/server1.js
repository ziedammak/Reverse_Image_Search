const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var mongodb = require('mongodb'),  
  MongoClient = mongodb.MongoClient;
var assert = require('assert'); 
var util=require('util');
const app = express();


// port de lancement du serveur express js 
app.set('port', process.env.PORT || 5000 );
app.use(cors());
app.use(bodyParser.json());

app.get('/search', function (req, res){

var spawn = require('child_process').spawn,
    py    = spawn('python', ['compute_input.py']),
  //  data = req.query['q'] ,
    dataString = '', 
    fs =require('fs') ,
    text = fs.readFileSync('../eh1.txt','utf8' ),
    textByLine = text.split("\n") ;
 // var  data=textByLine[0] ;
  
    //console.log(data) ; 
  //  var data="0.046875 0.0625 0.0078125 0 0.0117188 0 0.0703125 0 0.0117188 0 0 0.0625 0 0 0 0.0585938 0.046875 0 0.0078125 0.015625 0.0625 0.136719 0 0 0 0.0898438 0.25 0.0976563 0.0429688 0.164063 0.0820313 0.15625 0.0234375 0.0625 0.136719 0.0625 0.15625 0 0 0 0.113281 0.0625 0.0390625 0.0546875 0.0429688 0.140625 0.238281 0.167969 0.128906 0.148438 0.199219 0.0859375 0.0351563 0.179688 0.0507813 0.113281 0.0234375 0.015625 0.0195313 0.0117188 0.109375 0.183594 0.109375 0.117188 0.210938 0.0742188 0.261719 0.0976563 0.140625 0.148438 0.164063 0.195313 0.0898438 0.242188 0.0273438 0.136719 0.292969 0.0703125 0.0976563 0.128906 0.454102 0.714111 0.235596 0.345459 0.343018 0.0830078 0.111328 0.0390625 0.0429688 0.0664063 0.0761719 0.205078 0.0908203 0.0810547 0.115234 0.111328 0.125 0.0371094 0.121094 0.0537109 0.0927734 0.129883 0.0214844 0.03125 0.0390625 0.0263672 0.0605469 0.00195313 0.00488281 0.00683594 0.0742188 0.174805 0.0302734 0.0263672 0.0751953 0.141602 0.102539 0.0644531 0.0957031 0.0634766 0.121094 0.233398 0.0917969 0.149414 0.128906 0.0498047 0.129883 0.0263672 0.0136719 0.0439453 0.0507813 0.105469 0.00585938 0.0175781 0.0380859 0.109375 0.186523 0.103516 0.110352 0.137695 0.15332 0.149414 0.0527344 0.134766 0.0546875 0.12793 0.182617 0.0810547 0.103516 0.125 "
 var  index = req.query['q'].substring(0,req.query['q'].length-4);
 var data=textByLine[index].replace(/(\r\n\t|\n|\r\t)/gm, ""); 
    //console.log(data) ; 
   // console.log(data) ;


    


py.stdout.on('data', function(data){
  dataString += data.toString();
});

py.stdout.on('end', function(){
  //console.log(py);

  console.log(dataString);
  res.send(JSON.stringify(eval("(" + dataString + ")")));

});
//console.log("hihi");
//console.log(data) ; 
py.stdin.write(JSON.stringify(data));
//py.stdin.write(JSON.stringify(data).substring(0, JSON.stringify(data).length-3)) ; 
py.stdin.end()
}) ; 
app.listen(app.get('port'), function() {
  console.log('Your node.js server is running on PORT: ',app.get('port'));
});