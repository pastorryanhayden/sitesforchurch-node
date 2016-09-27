/**
 * Created by John Muteti on 9/26/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var json = bodyParser.json();

app.get('/', function (req, res) {
    var basic = 'Server running';
    res.send(basic);
    console.log(basic);
});

app.post('/air', json, function (req, res) {
    var Airtable = require('airtable');
    var base = new Airtable({apiKey: 'keyRTLlrVS02vC3Vx'}).base('appRsxMDmiHHQ5ziK');
    base('Client entries').create({
        "church_name": req.body['churchName'],
        "Notes" : 'Created through Registration page + API',
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
    res.send(req.body['theme']);
});

app.listen(1993);