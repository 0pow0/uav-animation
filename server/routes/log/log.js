const express = require('express');
const router = express.Router();
const csv = require('csvtojson')
const fs = require('fs');

/* GET home page. */
router.get('/', async (req, res) => {
    // const readStream=fs.createReadStream("./localdata/uav_coordinate_light.csv");
    console.log('log.js');
    const readStream=fs.createReadStream("./localdata/log.csv");
    await csv().fromStream(readStream).pipe(res);
});

module.exports = router;
