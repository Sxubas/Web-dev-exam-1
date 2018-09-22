'use strict';
require('dotenv').config(); //Set environment variables from .env file
const Users = require('./services/Users');
const Collections = require('./services/Collections');
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
/* app.use(bodyParser.raw({
  type: 'multipart/form-data',
  limit: '20mb'
})); */
app.use(cors());

const mongoSetup = (callback) => {

  const uri = process.env.MONGODB_URI ||`mongodb://localhost:27017`;

  //Connect to mongo cloud
  MongoClient.connect(uri, {useNewUrlParser: true}, function (err, client) {
    if (err) throw err;
    else console.log('Successfully connected to mongoDB');
    //Afterwards instruction, client stands for a mongoClient connected to mongoAtlas instance
    callback(client);
  });
};

//Setting up endpoints
const expressSetup = (mongoClient) => {

  const db = mongoClient.db('heroku_kr26nnxp'); //Todo bien

  //CRUD Users
  app.get('/users', (req, res) => {
    Users.login(req, res, db);
  });

  app.post('/users', (req, res) => {
    Users.signup(req, res, db);
  });

  app.put('/users', (req, res) => {
    Users.update(req, res, db);
  });

  app.delete('/users', (req, res) => {
    Users.delete(req, res, db);
  });

  //CRUD Collections
  app.get('/visualizations', (req, res) => {
    Collections.getAllwords(req, res, db);
  });

  app.post('/visualizations', (req, res) => {
    Collections.addWord(req, res, db);
  });

  app.put('/visualizations', (req, res) => {
    Collections.modifyWord(req, res, db);
  });

  app.delete('/collections', (req, res) => {
    Collections.deleteWord(req, res, db);
  });

  //Serving react resources
  app.use(express.static(path.join(__dirname, 'frontend/build')));

  //For any request that does not match any other endpoint, return app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
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
