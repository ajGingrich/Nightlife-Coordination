var express = require('express');
var passport = require('passport');
var router = express.Router();
var SearchHandler = require('../app/controllers/searchHandler.server');
var searchHandler = new SearchHandler();
global.businesses = null;


//home page
router.get('/', function(req, res, next) {
    res.render('index');
});

//profile
router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', { user: req.user });
});

//clear
router.get('/clear', function(req, res) {
   global.businesses = null;
   res.render('index');
});



//search
router.post('/search', searchHandler.search);

//logout
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//attend
router.get('/attend/:id/:subId', searchHandler.attend);

//remove Attendee
router.get('/remove/:id/:subId', searchHandler.doNotAttend);


//authentications for facebook, twitter and google.
// Facebook routes
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));

// Twitter routes
router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));

// Google routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

