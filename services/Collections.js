const ObjectID = require('mongodb').ObjectID;
//
// Set of functions responsible of managing word collections logic for each user
// In charge of CRUD operations and custom queries over mongoDB
//

const Collections = {};

//Retrieves all words from a users collection, ordered by time added to the collection
Collections.getAllwords = (req, res, db) => {
  //Retrieve by most recent first
  db.collection('visualizations').find({}).sort({ date: -1 }).toArray((err, r) => {
    if (err) {
      res.status(500).send(err);
    }
    else if (!r) res.send([]);
    else res.send(r);
  });
};

Collections.addWord = (req, res, db) => {

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


Collections.modifyWord = (req, res, db) => {

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
    , {
      returnOriginal: false
    },
    (err, r) => {
      if (err) res.status(500).send({ errorMessage: err.message });
      else {
        const rating = r.value.rating;
        const votes = r.value.votes;
        const avg = rating/votes;
        res.send({rating: avg});
      }
    });

  /* db.collection('collections').findOne({ 'email': req.body.email, 'characters._id': new ObjectID(req.body._id) }, (err, r) => {
    if (err) res.status(500).send(err);
    else if (!r) {
      res.status(404);
      res.send('User or character not found.');
    }
    else {
      db.collection('collections').findOneAndUpdate({ 'email': req.body.email, 'characters._id': new ObjectID(req.body._id) }, {
        $set: {
          'characters.$.simplified': req.body.simplified === undefined ? r.characters.find(x => x._id === req.body._id).simplified : req.body.simplified,
          'characters.$.traditional': req.body.traditional === undefined ? r.characters.find(x => x._id === req.body._id).traditional : req.body.traditional,
          'characters.$.pinyins': req.body.pinyins === undefined ? r.characters.find(x => x._id === req.body._id).pinyins : req.body.pinyins,
          'characters.$.categories': req.body.categories === undefined ? r.characters.find(x => x._id === req.body._id).categories : req.body.categories,
          'characters.$.def': req.body.def === undefined ? r.characters.find(x => x._id === req.body._id).def : req.body.def
        }
      }, { returnOriginal: false }, (err2, r2) => {
        if (err2) res.status(500).send(err2);
        else res.send(r2.value);
      });
    }
  }); */
};

Collections.deleteWord = (req, res, db) => {
  db.collection('collections').findOneAndUpdate({ 'email': req.body.email }, { $pull: { characters: { '_id': new ObjectID(req.body._id) } } }, { returnOriginal: false }, (err, r) => {
    if (err) {
      res.status(500);
      res.send(err);
    }
    else if (!r.value) {
      res.status(404);
      res.send('User not found.');
    }
    else res.send('Word removed successfully.');
  });
};
module.exports = Collections;
