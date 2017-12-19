const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const mongoDb = require('mongodb');
const path = require('path');
const app = express();

// App Config
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/RESTful_lotr_app', { useMongoClient: true });

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));


// Model making
const kingSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  created: { type: Date, default: Date.now },
});
// Making model available
const King = mongoose.model('King', kingSchema);
// CREATE TEMPLATE PAGES TO SHOW THINGS I CAN ACTUALLY WORK ON. INDEX FIRST, THEN SHOW AND POST
// King.create({
//   name: "Spock",
//   image: "http://digitalspyuk.cdnds.net/16/44/768x512/gallery-movies-star-trek-spock-4.jpg",
//   description: "Logial dude."
// });

app.get('/', (req, res) => {
  res.redirect('/kings');
});

app.get('/kings', (req, res) => {
  King.find({}, (err, kings) => {
    res.render('index', { kings });
  });
});

app.get('/kings/new', (req, res) => {
  res.render('new');
});

app.post('/kings', (req, res) => {
  req.body.king.body = res.sanitize(req.body.king.body);
  const { name, image, description } = req.body.king;
  King.create(req.body.king, (err) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.redirect('/kings');
    }
  });
});

app.get('/kings/:id', (req, res) => {
  const kingId = req.params.id;
  King.findById(kingId, (err, fetchedKing) => {
    res.render('show', { king: fetchedKing });
  });
});

app.get('/kings/:id/edit', (req, res) => {
  const kingId = req.params.id;
  King.findById(kingId, (err, fetchedKing) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('edit', { king: fetchedKing });
    }
  });
});

app.put('/kings/:id', (req, res) => {
  const kingId = req.params.id;
  const newData = req.body.king;
  req.body.king.body = req.sanitize(req.body.king.body);
  King.findByIdAndUpdate(kingId, newData, (err) => {
    if (err) {
      console.log('Error: ', err);
    } else res.redirect('/kings/:id');
  });
});

app.delete

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
