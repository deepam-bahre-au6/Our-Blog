// =================================================
//  IMPORTING MODULES
// =================================================
const express = require("express"),
  app = express(),
  path = require("path"),
  exphbs = require("express-handlebars"),
  flash = require("connect-flash"),
  session = require("express-session"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local").Strategy,
  methodOverride = require("method-override"),
  dotenv = require("dotenv");
  dotenv.config();

// =================================================
//  IMPORTING ROUTES
// =================================================
const userRoutes = require("./routes/user"),
  blogRoutes = require("./routes/blog"),
  indexRoutes = require("./routes/index");

// Requiring User Model
const User = require("./models/user");

// =================================================
//  ADDED DATABASE
// =================================================
require("./config/database"),
  // =================================================
  //  MIDDLEWARES
  // =================================================
app.use(methodOverride("_method"));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

// Session Middlewares for user authentication
app.use(
  session({
    secret: "A Secret Monkey With A Secret Hat",
    resave: false,
    saveUninitialized: false,
  })
);

// Initializing Flash for Flash Messages
app.use(flash());

// Initializing passport for user authentication || login/logout
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting up local variables
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user;

  next();
});

// =================================================
//  ROUTES
// =================================================
// Basic Index Route
app.use("/", indexRoutes);
// Post Routes
app.use("/blogs", blogRoutes);
// User Routes
app.use("/users", userRoutes);

// =================================================
//  SERVER SETUP
// =================================================
app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started at localhost:3000");
});
