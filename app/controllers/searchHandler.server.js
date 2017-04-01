'use strict';

var Queries = require('../models/queries.js');

function searchHandler () {

    var numResults = 10;

    var request = require("request");

    this.search = function(req, res) {

        var location = req.body.location;

        var options = { method: 'GET',
            url: 'https://api.yelp.com/v3/businesses/search',
            qs: {
                term: 'bar',
                location: location
            },
            headers: {
                'postman-token': 'e24fdf71-17eb-77a4-ffa7-065d93b360ea',
                'cache-control': 'no-cache',
                authorization: 'Bearer ' + process.env.YELP_TOKEN
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            var bodyObj = JSON.parse(body);
            var businesses = bodyObj.businesses;

            var names = [];
            var urls = [];
            var imgUrls = [];
            var attendingArray = [];

            for (var i=0; i<=numResults; i++) {
                names.push(businesses[i].name);
                urls.push(businesses[i].url);
                imgUrls.push(businesses[i].image_url);

                var somebody = {users: "somebody"};
                attendingArray.push(somebody);
            }

            var newQuery = Queries({
               name: names,
               url: urls,
               attending: attendingArray,
               img: imgUrls
            });

            //check to see if query already exists before adding it
            Queries.find({name: names}, function(err, data) {
                if (err) throw error;

                if (data.length == 0 ) {
                    //save Poll
                    newQuery.save(function(err) {
                        if (err) throw err;
                        console.log('there isnt a query');

                        global.businesses = newQuery;
                        res.render('index', {user: req.user});
                    });
                }
                else {
                    global.businesses = data[0];
                    res.render('index', {user: req.user});
                }
            });
        });
    };

    this.attend = function(req, res) {
        var queryId = req.params.id;
        var attendingId = req.params.subId;

        if (req.user) {

            console.log(req.user);

            Queries.findOneAndUpdate({ "_id": queryId, "attending._id": attendingId }, {$push: {'attending.$.users': req.user.id}}, {new :true},
                function(err, doc) {
                    if (err) throw err;
                    global.businesses = doc;
                    global.loggedOut = false;
                    res.render('index', {user: req.user});
                } );
        }
        else {
            console.log("gotta be logged in bud");
            global.loggedOut = true;
            res.render('index', {user: req.user});
        }
    };

    this.doNotAttend = function(req, res) {
        var queryId = req.params.id;
        var attendingId = req.params.subId;

        if (req.user) {
            Queries.findOneAndUpdate({ "_id": queryId, "attending._id": attendingId }, {$pull: {'attending.$.users': req.user.id}}, {new :true},
                function(err, doc) {
                    if (err) throw err;
                    global.businesses = doc;
                    global.loggedOut = false;
                    res.render('index', {user: req.user});
                });
        }
        else {
            console.log("gotta be logged in bud");
            global.loggedOut = true;
            res.render('index', {user: req.user});
        }
    }

}

module.exports = searchHandler;