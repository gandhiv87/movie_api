const express = require('express');
  morgan = require('morgan');
  fs = require('fs'), // import built in node modules fs and path
  path = require('path');

const app = express();

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),
  {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

let topMovies = [
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola'
  },
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont'
  },
  {
    title: 'The Godfather Part 2',
    director: 'Francis Ford Coppola'
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan'
  },
  {
    title: 'Fight Club',
    director: 'David Fincher'
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan'
  },
  {
    title: '12 Angry Men',
    director: 'Sidney Lumet'
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    director: 'Peter Jackson'
  },
  {
    title: 'The Matrix',
    director: 'Lana Wachowski and Lilly Wachowski'
  },
  {
    title: 'Se7en',
    director: 'David Fincher'
  }
];

// Get requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Error handeling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});

// Serving static files
app.use(express.static('public'));

// Listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
