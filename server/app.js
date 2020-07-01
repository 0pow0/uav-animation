const createError = require('http-errors');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')

const app = express()
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(cors())


const log = require('./routes/log/log');
app.use('/log/log', log);
const endArea = require('./routes/uav/endArea')
app.use('/uav/endArea', endArea)
const startArea = require('./routes/uav/startArea')
app.use('/uav/startArea', startArea)

const uav = require('./routes/uav/uav')
app.use('/uav/uav', uav)
const uav1 = require('./routes/uav/uav1');
app.use('/uav/uav1', uav1);
const uav2 = require('./routes/uav/uav2');
app.use('/uav/uav2', uav2);
const uav3 = require('./routes/uav/uav3');
app.use('/uav/uav1', uav3);
const uav4 = require('./routes/uav/uav4');
app.use('/uav/uav4', uav4);

const mav = require('./routes/uav/mav');
app.use('/uav/mav', mav);
const mav1 = require('./routes/uav/mav1');
app.use('/uav/mav1', mav1);
const mav2 = require('./routes/uav/mav2');
app.use('/uav/mav2', mav2);
const mav3 = require('./routes/uav/mav3');
app.use('/uav/mav3', mav3);
const mav4 = require('./routes/uav/mav4');
app.use('/uav/mav4', mav4);
////////////////////base_station///////////
const baseStation = require('./routes/uav/baseStation')
app.use('/uav/baseStation', baseStation)
////////other uav version/////////////

const uavReactive = require('./routes/uav/uav_reactive');
app.use('/uav/uav_reactive', uavReactive);
const uavReactive1 = require('./routes/uav/uav_reactive1');
app.use('/uav/uav_reactive1', uavReactive1);
const uavReactive2 = require('./routes/uav/uav_reactive2');
app.use('/uav/uav_reactive2', uavReactive2);
const uavReactive3 = require('./routes/uav/uav_reactive3');
app.use('/uav/uav_reactive3', uavReactive3);
const uavReactive4 = require('./routes/uav/uav_reactive4');
app.use('/uav/uav_reactive4', uavReactive4);

const uavTP = require('./routes/uav/uav_tp');
app.use('/uav/uav_tp', uavTP);
const uavTP1 = require('./routes/uav/uav_tp1');
app.use('/uav/uav_tp1', uavTP1);
const uavTP2 = require('./routes/uav/uav_tp2');
app.use('/uav/uav_tp2', uavTP2);
const uavTP3 = require('./routes/uav/uav_tp3');
app.use('/uav/uav_tp3', uavTP3);
const uavTP4 = require('./routes/uav/uav_tp4');
app.use('/uav/uav_tp4', uavTP4);

const uavNOCheck = require('./routes/uav/uav_nocheck');
app.use('/uav/uav_nocheck', uavNOCheck);
const uavNOCheck1 = require('./routes/uav/uav_nocheck1');
app.use('/uav/uav_nocheck1', uavNOCheck1);
const uavNOCheck2 = require('./routes/uav/uav_nocheck2');
app.use('/uav/uav_nocheck2', uavNOCheck2);
const uavNOCheck3 = require('./routes/uav/uav_nocheck3');
app.use('/uav/uav_nocheck3', uavNOCheck3);
const uavNOCheck4 = require('./routes/uav/uav_nocheck4');
app.use('/uav/uav_nocheck4', uavNOCheck4);




// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(__dirname + '/public/'));
//     app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
// }
if (process.env.NODE_ENV === 'start') {
    console.log('start mode');
} else {
    console.log('production mode');
    app.use(express.static(__dirname + '/public/'));
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

module.exports = app;


// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//     console.log(`Sever started on port http://localhost:${port}`)
// })
