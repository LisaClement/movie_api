
const express = require ('express'),
      morgan = require ('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid');

const app = express();

// logging middleware
app.use(morgan('common'));

//make all files in /public available
app.use(express.static('public'));
 
app.use(bodyParser.json());

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
   author: 'Shawn Levy',
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

  {
    title: 'Inception', 
    director: 'Christopher Nolan',
    genre:'SciFi',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    year: 2010,
    imdb_rating: 8.8
   },
  
  {
   title: 'King Richard',
   author: 'Reinaldo Marcus Green',
   genre: 'Drama',
  description:'A look at how tennis superstars Venus and Serena Williams became who they are after the coaching from their father Richard Williams.',
  year: 2021,
  imdb_rating: 7.6
  }
];

// Post request to create a new user

app.post('/users/register', (req,res) => {
  const newUser = req.body;

  if(newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
})

// PUT request to update user info

app.put('/users/:id', (req,res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  
  let user = users.find( user => user.id == id );
  
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }
})

// endpoint to allow users to deregister
app.delete('/users/deregister/:username', (req, res) => {
  res.send(`User account has been removed`);
});

// endpoint to allow users to add a movie to their favorites
app.put('/users/:name/favorites/add/:title', (req, res) => {
  res.send(`Added ${req.params.title} to favorite's list for user: ${req.params.name}`);
});

app.put('/users/:name/favorites/remove/:title',(req,res) =>{
  res.send(`Removed ${req.params.title} from favorite's list for user: ${req.params.name}`)
}
);

// GET request for home page
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

// GET request to get a list of all movies
app.get('/movies', (req, res) => {
  res.send('Successful GET request returning data on all the movies');
});

// Get request to return data about a single movie by title
app.get('/movies/:title', (req, res) => {
  res.send('Successful GET request returning data about a single movie by title')
});

// Get request to return all movies of a specific genre
app.get('/movies/genres/:genre', (req, res) => {
  res.send('Successful GET request returning all movies that have a specific genre')
});

// Get request to return all movies directed by a specific director
app.get('/movies/directors/:director', (req, res) => {
  res.send('Successful Get request returning all movies that were directed by a specific director')
});




app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
