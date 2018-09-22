'use strict';
require('dotenv').config(); //Set environment variables from .env file
const Visualizations = require('./services/Visualizations');
const MongoClient = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

//
//Main entry point. Responsible of setting express app, mongoDB connections 
//and serving frontend app. Exposes all services to the client (Users, Collections and Tools)
//

const app = express();

app.use(bodyParser.json({
  type: 'application/json',
  limit: '500KB'
}));

app.use(cors());

const mongoSetup = (callback) => {

  const uri = process.env.MONGODB_URI || `mongodb://localhost:27017`;

  //Connect to mongo cloud
  MongoClient.connect(uri, { useNewUrlParser: true }, function (err, client) {
    if (err) throw err;
    else console.log('Successfully connected to mongoDB');
    //Afterwards instruction, client stands for a mongoClient connected to mongoAtlas instance
    callback(client);
  });
};

//Setting up endpoints
const expressSetup = (mongoClient) => {

  const db = mongoClient.db('heroku_kr26nnxp'); //Todo bien

  //CRUD Collections
  app.get('/visualizations', (req, res) => {
    Visualizations.getVisualizations(req, res, db);
  });

  app.post('/visualizations', (req, res) => {
    Visualizations.addVisualization(req, res, db);
  });

  app.put('/visualizations', (req, res) => {
    Visualizations.rateVisualization(req, res, db);
  });

  //Serving react resources
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  //For any request that does not match any other endpoint, return app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
  });

  startServer();
};

//Begin listening to requests
const startServer = () => {
  app.listen(process.env.PORT || 8080, () => {
    console.log('Server successfully run');
  });
};

mongoSetup(expressSetup);
