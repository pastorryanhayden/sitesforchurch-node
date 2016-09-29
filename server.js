/**
 * Created by John Muteti on 9/26/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
var port = Number(process.env.PORT || 3000);

var mode = 'test'; //Change this to 'live' to easily switch to live keys for payment
var stripe_secret_key = (mode == 'live' ? "" : "sk_test_qrdBNKvz4CzyEMgfXEDFWJ5U");
var stripe = require("stripe")(stripe_secret_key);

app.get('/', function (req, res) {
    var basic = 'I\'m Ok';
    res.send(basic);
    console.log(basic);
});

// Pay with Stripe monthly.
app.post('/pay_monthly', function (req, res) {
    var token = req.body.stripeToken;

// Create a charge: this will charge the user's card
    var charge = stripe.charges.create({
        amount: 3000, // Amount in cents
        currency: "usd",
        source: token,
        description: "Sitefor.Church Monthly Charge"
    }, function (err, charge) {
        if (err && err.type === 'StripeCardError') {
            res.redirect('http://sitesfor.church/failed.html');
        }
        res.redirect('http://sitesfor.church/thankyou.html');
    });
});

// Pay with Stripe annually
app.post('/pay_annually', function (req, res) {
    var token = req.body.stripeToken;

// Create a charge: this will charge the user's card
    var charge = stripe.charges.create({
        amount: 36000, // Amount in cents
        currency: "usd",
        source: token,
        description: "Sitefor.Church Annual Charge"
    }, function (err, charge) {
        if (err && err.type === 'StripeCardError') {
            res.redirect('http://sitesfor.church/failed.html');
        }
        res.redirect('http://sitesfor.church/thankyou.html');
    });
});

// Consume Airtable API {post data from sign up page}.
app.post('/air', function (req, res) {
    var Airtable = require('airtable');
    var base = new Airtable({apiKey: 'keyRTLlrVS02vC3Vx'}).base('appRsxMDmiHHQ5ziK');
    base('Client entries').create({
        "church_name": req.body['churchName'],
        "Notes": 'Created through Registration page + API',
        "Logo": [
            {
                "url": "https://dl.airtable.com/p5LgFEUWSHqBYWS46WKa_logo.png"
            }
        ],
        "church_location": req.body['churchCity'],
        "theme": req.body['theme'],
        "Domain": req.body['churchDomain'],
        "Domain_owned": req.body['churchDomainOwned'],
        "Service_Schedule": req.body['serviceSchedule'],
        "Church_Address": req.body['churchAddress'],
        "Pastor_Name": req.body['pastorName'],
        "Web_Lead_name": req.body['webLeadName'],
        "Web_lead_phone": req.body['webLeadPhone'],
        "Web_lead_email": req.body['webLeadEmail'],
        "Church_Phone": req.body['churchPhone'],
        "Church_email": req.body['churchEmail']
    }, function (err, record) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(record);
    });
    console.log('body: ' + JSON.stringify(req.body));
    res.send(req.body);
});

app.listen(port);