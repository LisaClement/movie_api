
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true} );

const express = require ('express'),
      morgan = require ('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// logging middleware
app.use(morgan('common'));

//make all files in /public available
app.use(express.static('public'));
 
<<<<<<< HEAD

// GET request for home page
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});
=======


let users = [
  {
    id: 1,
    name: 'Pierre', 
    email: 'pierre@gmail.com'
   },
]

let movies = [
  {
   title: 'The Notebook', 
   director: 'Nick Cassavetes',
   genre: 'Romance',
   description: 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.',
   year: 2004,
   imdb_rating: 7.8
  },
  {
   title: 'Deadpool',
   director: 'Tim Miller',
   genre: 'Super heroes',
   description: 'A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.',
   year: 2016,
   imdb_rating: 8.0
  },
  {
   title: 'Free Guy',
   director: 'Shawn Levy',
   genre:'Comedy',
   description: 'A bank teller discovers that he is actually an NPC inside a brutal, open world video game.',
   year: 2021,
   imdb_rating: 7.2
  },
  {
   title: 'A Star Is Born', 
   director: 'Bradley Cooper',
   genre:'Romance',
   description:'A musician helps a young singer find fame as age and alcoholism send his own career into a downward spiral.',
   year: 2018,
   imdb_rating: 7.6
  },
>>>>>>> c667f1f987d372795f258fb326db893ba6b71f52


<<<<<<< HEAD
// Get all users
app.get('/users', (req,res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

=======
// GET request for home page
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});


// Get all users
app.get('/users', (req,res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

>>>>>>> c667f1f987d372795f258fb326db893ba6b71f52

// Post request to create a new user
app.post('/users/register', (req,res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
<<<<<<< HEAD

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

=======

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

>>>>>>> c667f1f987d372795f258fb326db893ba6b71f52
// endpoint to allow users to deregister
app.delete('/users/deregister/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
    .then ((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch ((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET request to get a list of all movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Get request to return data about a single movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((title) => {
      res.json(title);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get request to return details about a specific genre
app.get('/genres/:Genre', (req, res) => {
  Movies.findOne( {'Genre.Name' : req.params.Genre})
    .then((movie) => {
      res.status(201).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Get request to return details about a specific director
app.get('/directors/:Director', (req, res) => {
  Movies.findOne({'Director.Name' : req.params.Director})
    .then((movie) => {
      res.status(201).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
<<<<<<< HEAD
});

// endpoint to allow users to add a movie to their favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate ( { Username: req.params.Username}, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true}, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
        
      } else {
        res.json(updatedUser);
      }
    });
});

=======
});

// endpoint to allow users to add a movie to their favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate ( { Username: req.params.Username}, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true}, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
        
      } else {
        res.json(updatedUser);
      }
    });
});

>>>>>>> c667f1f987d372795f258fb326db893ba6b71f52
// endpoint to allow users to remove a movie from their favorites

app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
 (err, updatedUser) => {
   if (err) {
     console.error(err);
     res.status(500).send('Error: ' + err);
   } else {
     res.json(updatedUser);
   }
 });
});





app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
