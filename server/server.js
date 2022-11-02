/*
|--------------------------------------------------------------------------
| server.js -- The core of your server
|--------------------------------------------------------------------------
|
| This file defines how your server starts up. Think of it as the main() of your server.
| At a high level, this file does the following things:
| - Connect to the database
| - Sets up server middleware (i.e. addons that enable things like json parsing, user login)
| - Hooks up all the backend routes specified in api.js
| - Fowards frontend routes that should be handled by the React router
| - Sets up error handling in case something goes wrong when handling a request
| - Actually starts the webserver
*/

// validator runs some basic checks to make sure you've set everything up correctly
// this is a tool provided by staff, so you don't need to worry about it
import validator from "./validator.js";
validator.checkSetup();
import dotenv from "dotenv";
dotenv.config();

//import libraries needed for the webserver to work!
import http from "http";
import bodyParser from "body-parser"; // allow node to automatically parse POST body requests as JSON
import express from "express"; // backend framework for our node server.
import session from "express-session"; // library that stores info about each connected user
import mongoose from "mongoose"; // library to connect to MongoDB
import path from "path"; // provide utilities for working with file and directory paths
import { fileURLToPath } from "url";

import api from "./api.js";
import auth from "./auth.js";

// Server configuration below
const isMongoSetupComplete = true;
if (isMongoSetupComplete) {
  const mongoConnectionURL = process.env.ATLAS_SRV;
  const databaseName = "bartschi-budget";

  // connect to mongodb
  mongoose
    .connect(mongoConnectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: databaseName,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));
}

// create a new express server
const app = express();
app.use(validator.checkRoutes);

// set up bodyParser, which allows us to process POST requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set up a session, which will persist login data across requests
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// this checks if the user is logged in, and populates "req.user"
app.use(auth.populateCurrentUser);

// connect user-defined routes
app.use("/api", api);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// load the compiled react files, which will serve /index.html and /bundle.js
const reactPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(reactPath));

// for all other routes, render index.html and let react router handle it
app.get("*", (req, res) => {
  res.sendFile(path.join(reactPath, "index.html"));
});

// any server errors cause this function to run
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    // 500 means Internal Server Error
    console.log("The server errored when processing a request!");
    console.log(err);
  }

  res.status(status);
  res.send({
    status: status,
    message: err.message,
  });
});

// hardcode port to 3000 for now
const port = process.env.PORT || 3000;
const server = http.Server(app);

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
