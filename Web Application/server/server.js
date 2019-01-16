const express = require('express');
const elasticsearch = require('elasticsearch');
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

const client = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
 });

 // connexion au serveur elasticsearch

client.ping({ requestTimeout: 30000 }, function(error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});
// Requête get avec spécification du champ de recherch " tags " 
app.get('/search', function (req, res){
    
    let body = {
      size: 100,
      from: 0,
      query: {
        match: {
                tags: {
                    query: req.query['q'],
                    fuzziness: 4
                }
            }
        }
    }
   
    client.search({index:'flickrphotos', body:body, type:'metadata'})
    .then(results => {
            res.send(results.hits.hits);
        
    })
    .catch(err=>{
      console.log(err)
      res.send([]);
    });
  
  })

app.listen(app.get('port'), function() {
    console.log('Your node.js server is running on PORT: ',app.get('port'));
});