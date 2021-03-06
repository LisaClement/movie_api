const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

const { check, validationResult } = require("express-validator");

//mongoose.connect("mongodb://localhost:27017/myFlixDB", {
// useNewUrlParser: true,
//useUnifiedTopology: true,
//});
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors()); // allows access from all origins
/* This would restrict origins */
//let allowedOrigins = ["http://localhost:8080", "http://testsite.com"];

//app.use(cors({
// origin: (origin, callback) => {
//if(!origin) return callback(null, true);
// if(allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins}
// let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//  return callback(new Error(message ), false);
// }
//  return callback(null, true);
// }
//}));

const passport = require("passport");
require("./passport");
let auth = require("./auth")(app);

const dotenv = require(`dotenv`);
dotenv.config();

// logging middleware
app.use(morgan("common"));

//make all files in /public available
app.use(express.static("public"));

// GET request for home page
app.get("/", (req, res) => {
  res.send("Welcome to my movie club!");
});

// Get all users
app.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

// Post request to create a new user
app.post(
  "/users",
  [
    // check comes from express-validator
    check("Username", "Username with at least 5 alphanumberic characters is required").isLength({ min: 5 }),
    check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
    check("Birthday", "Birthday must be in a valid date format (eg: yyyy-mm-dd)").optional().isDate(),
  ],
  (req, res) => {
    // sends back a list of errors if problems were found in inputs
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Get a user by username
app.get("/users/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
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

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    // check for valid inputs using express-validator
    check("Username", "Username with at least 5 alphanumberic characters is required").isLength({ min: 5 }),
    check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("Password", "Password may not be blank").optional().not().isEmpty(),
    check("Email", "Email does not appear to be valid").optional().isEmail(),
    check("Birthday", "Birthday must be in a valid date format (eg: yyyy-mm-dddd)").optional().isDate(),
  ],
  (req, res) => {
    // send back list of errors if present, for parameters that were entered
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword;
    if (req.body.Password) {
      hashedPassword = Users.hashPassword(req.body.Password);
    }

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// endpoint to allow users to deregister
app.delete("/users/deregister/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// GET request to get a list of all movies
app.get("/movies", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get request to return data about a single movie by title
app.get("/movies/:movieId", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ _id: req.params.movieId }) // Find the movie by title
    .then((movie) => {
      if (movie) {
        // If movie was found, return json, else throw error
        res.status(200).json(movie);
      } else {
        res.status(400).send("Movie not found");
      }
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

// Get request to return details about a specific genre
app.get("/movies/genre/:Name", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Name }) // Find one movie with the genre by genre name
    .then((movie) => {
      if (movie) {
        // If a movie with the genre was found, return json of genre info, else throw error
        res.status(200).json(movie.Genre);
      } else {
        res.status(400).send("Genre not found");
      }
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

// Get request to return details about a specific director
app.get("/movies/director/:Name", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name }) // Find one movie with the director by name
    .then((movie) => {
      if (movie) {
        // If a movie with the director was found, return json of director info, else throw error
        res.status(200).json(movie.Director);
      } else {
        res.status(400).send("Director not found");
      }
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

// endpoint to allow users to add a movie to their favorites
app.post("/users/:Username/movies/:MovieID", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// endpoint to allow users to remove a movie from their favorites

app.delete("/users/:Username/movies/:MovieID", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Your app is listening on port 8080.");
});
