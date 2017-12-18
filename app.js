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

app.get('/kings/:id', (req, res) => {
  const kingId = req.params.id;
  King.findById(kingId, (err, fetchedKing) => {
    res.render('show', { king: fetchedKing })
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
