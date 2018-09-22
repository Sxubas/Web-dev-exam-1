const ObjectID = require('mongodb').ObjectID;
//
// Set of functions responsible of managing word collections logic for each user
// In charge of CRUD operations and custom queries over mongoDB
//

const Collections = {};

//Retrieves all words from a users collection, ordered by time added to the collection
Collections.getVisualizations = (req, res, db) => {
  //Retrieve by most recent first
  db.collection('visualizations').find({}).sort({ date: -1 }).toArray((err, r) => {
    if (err) {
      res.status(500).send(err);
    }
    else if (!r) res.send([]);
    else res.send(r);
  });
};

Collections.addVisualization = (req, res, db) => {

  let vis = req.body;
  vis.date = Date.now();

  db.collection('visualizations').insertMany([req.body], { returnOriginal: false }, (err, r) => {
    if (r) {
      res.send(r);
    }
    else {
      res.status(500).send({ 'errorMessage': err.message });
    }
  });
};


Collections.rateVisualization = (req, res, db) => {

  db.collection('visualizations').findOneAndUpdate({ _id: new ObjectID(req.body.id) },
    {
      $inc: {
        rating: req.body.rating,
        votes: 1
      },
      $push: {
        voters:{
          name: req.body.name,
          rate: req.body.rating
        }
      }
    }
    , { returnOriginal: false },
    (err, r) => {
      if (err) res.status(500).send({ errorMessage: err.message });
      else {
        const rating = r.value.rating;
        const votes = r.value.votes;
        const avg = rating/votes;
        res.send({rating: avg});
      }
    });
};

module.exports = Collections;
