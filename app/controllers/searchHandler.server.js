'use strict';



function searchHandler () {

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
            //var test = body.businesses;
            //console.log(test);
            var bodyObj = JSON.parse(body);

            console.log(bodyObj.businesses[0].name);
            res.render('index'/*, { businesses: body.businesses }*/);
        });
    }

}

module.exports = searchHandler;