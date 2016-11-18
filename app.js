var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
var strava = require('strava-v3');

// if(process.env.NODE_ENV !== 'production'){
//   require('dotenv').load();
// }

var findRide = require('./routes/find-ride');
var login = require('./routes/login');
var logout = require('./routes/logout');
var favorites = require('./routes/favorites');
var rides = require('./routes/rides');
var auth = require('./routes/auth');
var users = require('./routes/users');
var athlete = require('./routes/athlete');
var dashboard = require('./routes/dashboard');
var createAccount = require('./routes/create-account');
var socketsBackend = require('./routes/sockets-backend');
var routeOptions = require('./routes/route-options');
var encode = require('./routes/sockets-backend');
var showride = require('./routes/showride');


var app = express();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
  require('dotenv').config();
}

// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use('/', express.static(path.join(__dirname, 'public')))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//takes a folder to look inside of
app.use('/public', express.static(path.join(__dirname, 'public')));


app.use('/find-ride', findRide);
app.use('/rides', rides);
app.use('/login', login);
app.use('/logout', logout);
app.use('/favorites', favorites);
app.use('/auth', auth);
app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/athlete', athlete);
app.use('/create-account', createAccount);
app.use('/sockets-backend', socketsBackend);
app.use('/route-options', routeOptions);
app.use('/encode', encode);
app.use('/showride', showride);

//Update the cookie session secret to use the secret key in the JWT_SECRET environment variable.
app.use(cookieSession({
  name: 'session',
  keys: process.env.JWT_SECRET
}));

app.get('/', function(req, res, next){
  res.redirect('login')
})




// app.use(passport.initialize());
// app.use(passport.session());
//
// passport.serializeUser(function(user, done) {
//   //later this will be where you selectively send to the browser an identifier for your user, like their primary key from the database, or their ID from linkedin
//   done(null, user);
// });
//
// passport.deserializeUser(function(obj, done) {
//   //here is where you will go to the database and get the user each time from it's id, after you set up your db
//
//   done(null, obj);
// });
//
//
// passport.use(new LocalStrategy({
//      "access_token":"b25135f8e0baad45ddb1ba7aff6d55c87ee0b730",
//      "client_id":"14704",
//      "client_secret" :"ceefef311a0817a60158711516becd3648f66941",
//      "redirect_uri"  :"localhost:8000/dashboard"
//
// },
// function(request, accessToken, refreshToken, profile, done) {
//  knex('users').where({'email':profile.emails[0].value}).first()
//  .then(function(user) {
//    if(!user) {
//      knex('users').insert({email: profile.emails[0].value, hashed_password:profile.password })
//      .returning('*')
//      .then(function(user) {
//        delete user[0].hashed_password;
//        delete user[0].created_at;
//        delete user[0].updated_at;
//
//        console.log('Thank you for registering with Routekeeper!  New profile: ', user, "has been created.");
//        return done(null, user[0]);
//      }).catch(function(error){
//        done(error, null);
//      });
//    }
//    else {
//      console.log('Thank you for attempting to register with RouteKeeper', user, "It looks like you have set up a profile already.");
//      return done(null, user);
//    }
//  })
//  .catch(function(error) {
//    return done(error, null);
//  });
//
// }));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('No route matches the page');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.send(err);
  throw err;
});

module.exports = app;
