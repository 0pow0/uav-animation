const express = require('express')
const router = express.Router();
const csv=require('csvtojson')

/* GET home page. */
router.get('/',async (req, res) => {
    const jsonArray= await csv().fromFile("./localdata/end_area.csv");
    res.send(await jsonArray);
});

module.exports = router;