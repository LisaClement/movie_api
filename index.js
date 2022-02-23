const express = require ('express'),
   morgan = require ('morgan');

const app = express();

app.use(morgan('common'));

//express.static() function to render the documentation file
app.use(express.static('public'));
 
// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// My top movies list
let topMovies = [
    {
     title: 'The Notebook', 
     director: 'Nick Cassavetes'
    },
    {
     title: 'Deadpool',
     director: 'Tim Miller'
    },
    {
     title: 'Free Guy',
     author: 'Shawn Levy'
    },
    {
     title: 'A Star Is Born', 
     director: 'Bradley Cooper'
    },
    {
    title: 'Inception',
    director: 'Christopher Nolan'
    },
    {
     title: 'King Richard',
     author: 'Reinaldo Marcus Green'
    }
];


app.use((err, req, res, next) => {
  // logic
});
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });