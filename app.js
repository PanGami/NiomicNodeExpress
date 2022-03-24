var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

const expressLayout = require("express-ejs-layouts");

const database = require("./config/database");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");

var app = express();

//config passport
require("./config/passport")(passport);

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

// Connection mongoDB
database.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

// view engine setup
app.use(expressLayout);
// app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// Express body-parser
app.use(express.urlencoded({ extended: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//global variable
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});
app.use("/", indexRouter);
app.use("/auth", usersRouter);
app.use("/movies", moviesRouter);

module.exports = app;
