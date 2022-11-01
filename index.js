const express = require('express');
  bodyParser = require('body-parser'),
  uuid = require('uuid');
  morgan = require('morgan');
  fs = require('fs'), // import built in node modules fs and path
  path = require('path');

const app = express();

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'),
  {flags: 'a'})

let users = [
  {
    id: 1,
    name: "Ash",
    favoriteMovies: []
  },
  {
    id: 2,
    name: "Leon",
    favoriteMovies: ["The Godfather"]
  },
];

let movies = [
  {
    "Title": "xxx",
    "Description": "",
    "Genre": {
      "Name": "Drama",
      "Description":"."
    },
    "Director":{
      "Name":"",
      "Bio":"",
      "Birth":1939,
    },
    "ImageURL":"",
    "Featured": false
  },

  {
    "Title": "yyy",
    "Description": "",
    "Genre": {
      "Name": "",
      "Description":""
    },
    "Director":{
      "Name":"",
      "Bio":"",
      "Birth":1939,
    },
    "ImageURL":"",
    "Featured": false
  },

  {
    "Title": "The Godfather",
    "Description": "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.",
    "Genre": {
      "Name": "Crime",
      "Description":"Crime film is a film genre inspired by and analogous to the crime fiction literary genre. Films of this genre generally involve various aspects of crime and its detection."
    },
    "Director":{
      "Name":"Francis Ford Coppola",
      "Bio":"One of America's most erratic, energetic and controversial filmmakers, Francis Ford Coppola enjoyed stunning triumphs and endured monumental setbacks before resurrecting himself, Phoenix-like, to begin the process all over again.",
      "Birth":1939,
    },
    "ImageURL":"https://m.media-amazon.com/images/M/MV5BMTM5NDU3OTgyNV5BMl5BanBnXkFtZTcwMzQxODA0NA@@._V1_UX214_CR0,0,214,317_AL_.jpg",
    "Featured": false
  },
];

// setup the logger
app.use(morgan('common', {stream: accessLogStream}));

// Serving static files
app.use(express.static('public'));

app.use(bodyParser.json());

// Get requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix app');
});

// Get all movies
app.get('/movies', (req, res) => {
   res.status(200).json(movies);
});

// Get movies by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie')
  }
});

// Get Genre
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
});

// Get data about director
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director')
  }
});

// Create User
app.post('/users', (req, res) =>
{
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
});

// Update User Info
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }
});

// Allow user to Create Movie Title
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such user')
  }
});


// Allow user to Delete Movie Title
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such user')
  }
});

// Delete User
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send('no such user')
  }
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

// Error handeling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});

// Listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
