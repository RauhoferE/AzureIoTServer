const express = require('express');
const path = require('path');
const fs = require('fs');

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

    // configure nonFeature
    //app.use(ignoreFavicon);

    // root route - serve static file
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/client.html'));
    });

    app.post('/PostHTTPData', (req,res) =>{
        var Data = {"Date": Date.now(), "Payloadsize": req.body.length, "Number": req.headers['Count']};
        fs.appendFile(path.join(baseDir, "HTTPDATA.txt"), Data, (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
          });
          res.sendStatus(200);
    });

    app.post('/PostLoRaWANData', (req,res) =>{

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