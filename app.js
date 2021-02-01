let appInsights = require('applicationinsights');
appInsights.setup('bba9b38e-a166-44ad-b790-4e228695c60f').start();
const express = require('express');
const path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser')


const baseDir = __dirname;

// ignore request for FavIcon. so there is no error in browser
const ignoreFavicon = (req, res, next) => {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end();
    }
    next();
};

// fn to create express server
const create = async () => {

    // server
    const app = express();
    const jsonParser = bodyParser.json()

    // configure nonFeature
    //app.use(ignoreFavicon);

    // root route - serve static file
    app.get('/', (req, res) => {
        res.sendStatus(200);
    });

    app.post('/PostHTTPData',jsonParser, (req,res) =>{
        var body = (req.body);
        console.log(body);
        console.log(JSON.stringify(body).length)
        console.log(req.header('Count'))
        var DataToWrite = {"Date": Date.now(), "Payloadsize": JSON.stringify(body).length, "Number": req.header('Count')};
        console.log(DataToWrite)
        fs.appendFile(path.join(baseDir, "HTTPDATA.txt"), JSON.stringify(DataToWrite) + "\n", (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
          });
          res.sendStatus(200);
    });

    app.post('/PostLoRaWANData', jsonParser, (req,res) =>{
        var body = (req.body);
        console.log(body);
        console.log(Buffer.from(body.payload_raw, 'base64').toString())
        console.log(body.counter)
        var DataToWrite = {"Date": Date.now(), "Payloadsize": Buffer.from(body.payload_raw, 'base64').toString().length, "Number": body.counter};
        console.log(DataToWrite)
        fs.appendFile(path.join(baseDir, "LORAWANDATA.txt"), JSON.stringify(DataToWrite) + "\n", (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
          });
          res.sendStatus(200);
    });

    // Error handler
    /* eslint-disable no-unused-vars */
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
    return app;
};

module.exports = {
    create
};