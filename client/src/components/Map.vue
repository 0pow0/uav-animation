<template>
    <div id="test">{{this.$route.params.index}}</div>
</template>

<script>
import oboe from 'oboe'
import axios from 'axios';
import syrMap from '../js/syrMap'
import syrMap2 from '../js/syrMap2'
import syrMap_nocheck from '../js/syrMap_nocheck'
import syrMap_reactive from '../js/syrMap_reactive';
const urlStartArea = 'uav/startArea/'
const urlEndArea = 'uav/endArea/'
const urlBastStation = 'uav/baseStation/'

const urlUAV = 'uav/uav/';
const url_UAV_1 = 'uav/uav1/';
const url_UAV_2 = 'uav/uav2/';
const url_UAV_3 = 'uav/uav3/';
const url_UAV_4 = 'uav/uav4/';

const url_MAV = 'uav/mav/';
const url_MAV1 = 'uav/mav1/';
const url_MAV2 = 'uav/mav2/';
const url_MAV3 = 'uav/mav3/';
const url_MAV4 = 'uav/mav4/';

const urlUAV_nocheck = 'uav/uav_nocheck/';
const urlUAV_nocheck1 = 'uav/uav_nocheck1/';
const urlUAV_nocheck2 = 'uav/uav_nocheck2/';
const urlUAV_nocheck3 = 'uav/uav_nocheck3/';
const urlUAV_nocheck4 = 'uav/uav_nocheck4/';

const urlUAV_tp = 'uav/uav_tp/';
const urlUAV_tp1 = 'uav/uav_tp1/';
const urlUAV_tp2 = 'uav/uav_tp2/';
const urlUAV_tp3 = 'uav/uav_tp3/';
const urlUAV_tp4 = 'uav/uav_tp4/';

const urlUAV_reactive = 'uav/uav_reactive/';
const urlUAV_reactive1 = 'uav/uav_reactive1/';
const urlUAV_reactive2 = 'uav/uav_reactive2/';
const urlUAV_reactive3 = 'uav/uav_reactive3/';
const urlUAV_reactive4 = 'uav/uav_reactive4/';

export default {
    name: 'GoogleMap',
    props: [
        'index',
    ],
    data() {
        return {
            message: 'Here is Map.vue',
            timer: 'a',
            dr: {},
            startData: [],
            endData: [],
            uavData: [],
            mavData: [],
            baseStationData: [],
            mapGoogle: {},
            stmt: ''
        };
    },
    async created () {
        try {
            //console.log(`id: ${this.$route.query.id}`);
            console.log(`index: ${this.index}`);
            // get data
            this.startData = await this.getStartData();
            this.endData = await this.getEndData();
            this.baseStationData = await this.getBaseStationData();

            this.mavData = await this.getMAVData(url_MAV);
            // console.log('this.mavData', this.mavData);
            console.log("this mav data length",this.mavData.length);

            // init map
            let regexpress = /reactive*/;
            let flag = -1;
            this.stmt = this.index;
            this.stmt ? this.stmt : this.stmt = '';
            console.log(`stmt: ${this.stmt}`);
            if (this.stmt.match(regexpress)) {
                flag = this.stmt.substring(this.stmt.length-1, this.stmt.length);
                this.stmt = 'reactive';
            }
            switch(this.stmt) {
                case 'proactive':
                    this.uavData = await this.getUAVData(urlUAV);
                    console.log("this uav data length",this.uavData.length);
                    // this.mavData = await this.getMAVData(urlMAV);
                    // console.log("uav data length",this.uavData.length);
                    this.mapGoogle = new syrMap('map',this.uavData,this.startData,this.endData,this.baseStationData, this.mavData);
                    break;
                case 'reactive':
                    if (flag === 'e') {
                        this.uavData = await this.getUAVDataWithLevel(urlUAV_reactive);
                        console.log("this uav data length",this.uavData.length);
                        console.log(`flag: ${flag}`);
                    } else if (flag === '1') {
                        console.log(`flag: ${flag}`);
                    } else if (flag === '2') {
                        console.log(`flag: ${flag}`);
                    } else {
                        console.log(`flag: ${flag}`);
                    }
                    this.mapGoogle = new syrMap_reactive('map',this.uavData,this.startData,this.endData, this.mavData);
                    break;
                case 'reduce_turn_point':
                    this.uavData = await this.getUAVData(urlUAV_tp);
                    this.mapGoogle = new syrMap('map',this.uavData,this.startData,this.endData,this.baseStationData);
                    break;
                case 'proactive_nocheck':
                    this.uavData = await this.getUAVData(urlUAV_nocheck);
                    this.mapGoogle = new syrMap_nocheck('map',this.uavData,this.startData,this.endData,this.baseStationData);
                    break;
                default:
                    this.mapGoogle = new syrMap2('map',this.uavData,this.startData,this.endData);
            }


            this.test = 0;
            // uav event listener
            Event.listen('startFly', ()=> this.mapGoogle.fly());
            Event.listen('pauseFly', ()=> this.mapGoogle.pause());
            Event.listen('resumeFly', ()=> this.mapGoogle.resume());
            Event.listen('getCurrTime', (time)=> this.mapGoogle.getCurrTime(time));
            Event.listen('setTimeInterval', (timeInterval)=> this.mapGoogle.setTimeInterval(timeInterval));
            Event.listen('setShowTrack', ()=> this.mapGoogle.setShowTrack());
            Event.listen('setShowUAVID', ()=> this.mapGoogle.setShowUAVID());
            Event.listen('setHideUAVTrack', ()=> this.mapGoogle.setHideUAVTrack());
            Event.listen('backtrack', (flag)=> this.mapGoogle.backtrack(flag));
            Event.listen('showMAV', () => console.log("show MAV event"));
            Event.listen("level1", () => this.getLevel1());
            Event.listen("level2", () => this.getLevel2());
            Event.listen("level3", () => this.getLevel3());
            Event.listen("level4", () => this.getLevel4());

        } catch(err) {
            this.error = err.message;
        }
    },

    methods: {
        async getLevel1() {
            this.uavData = [];
            this.mavData = [];
            console.log(this.stmt);
            switch(this.stmt) {
                case 'proactive':
                    this.uavData = await this.getUAVData(url_UAV_1);
                    this.mavData = await this.getMAVData(url_MAV1);
                    break;
                case 'reactive':
                    this.new_data_flag = true;
                    this.mapGoogle.uavdata = [];
                    await this.getIndependentUAVDataWithLevel(urlUAV_reactive1,
                        this.mapGoogle.uavdata);
                    // this.mavData = await this.getMAVData(url_MAV1);
                    // this.mapGoogle.uavdata = uavData;
                    // this.mapGoogle.mavData = null;
                    // this.mapGoogle.mavData = this.mavData;
                    this.mapGoogle.mavData = [];
                    await this.getMAVDataWithLevel(url_MAV1, this.mapGoogle.mavData);
                    break;
                case 'reduce_turn_point':
                    this.uavData = await this.getUAVData(urlUAV_tp1);
                    this.mavData = await this.getMAVData(url_MAV1);
                    break;
                case 'proactive_nocheck':
                    this.uavData = await this.getUAVData(urlUAV_nocheck1);
                    this.mavData = await this.getMAVData(url_MAV1);
                    break;
                default:
                    this.mavData = await this.getMAVData(url_MAV1);
            }
        },

        async getLevel2() {
            this.uavData = [];
            this.mavData = [];
            switch(this.stmt) {
                case 'proactive':
                    this.uavData = await this.getUAVData(url_UAV_2);
                    this.mavData = await this.getMAVData(url_MAV2);
                    break;
                case 'reactive':
                    this.new_data_flag = true;
                    this.mapGoogle.uavdata = [];
                    await this.getIndependentUAVDataWithLevel(urlUAV_reactive2,
                        this.mapGoogle.uavdata);
                    this.mapGoogle.mavData = [];
                    await this.getMAVDataWithLevel(url_MAV2, this.mapGoogle.mavData);
                    break;
                case 'reduce_turn_point':
                    this.uavData = await this.getUAVData(urlUAV_tp2);
                    this.mavData = await this.getMAVData(url_MAV2);
                    break;
                case 'proactive_nocheck':
                    this.uavData = await this.getUAVData(urlUAV_nocheck2);
                    this.mavData = await this.getMAVData(url_MAV2);
                    break;
                default:
                    this.mavData = await this.getMAVData(url_MAV2);
            }
        },

        async getLevel3() {
            this.uavData = [];
            this.mavData = [];
            switch(this.stmt) {
                case 'proactive':
                    this.uavData = await this.getUAVData(url_UAV_3);
                    this.mavData = await this.getMAVData(url_MAV3);
                    break;
                case 'reactive':
                    this.new_data_flag = true;
                    this.mapGoogle.uavdata = [];
                    await this.getIndependentUAVDataWithLevel(urlUAV_reactive3,
                        this.mapGoogle.uavdata);
                    this.mapGoogle.mavData = [];
                    await this.getMAVDataWithLevel(url_MAV3, this.mapGoogle.mavData);
                    break;
                case 'reduce_turn_point':
                    this.uavData = await this.getUAVData(urlUAV_tp3);
                    this.mavData = await this.getMAVData(url_MAV3);
                    break;
                case 'proactive_nocheck':
                    this.uavData = await this.getUAVData(urlUAV_nocheck3);
                    this.mavData = await this.getMAVData(url_MAV3);
                    break;
                default:
                    this.mavData = await this.getMAVData(url_MAV3);
            }
        },

        async getLevel4() {
            this.uavData = [];
            this.mavData = [];
            switch(this.stmt) {
                case 'proactive':
                    this.uavData = await this.getUAVData(url_UAV_4);
                    this.mavData = await this.getMAVData(url_MAV4);
                    break;
                case 'reactive':
                    this.new_data_flag = true;
                    this.mapGoogle.uavdata = [];
                    await this.getIndependentUAVDataWithLevel(urlUAV_reactive4,
                        this.mapGoogle.uavdata);
                    this.mapGoogle.mavData = [];
                    await this.getMAVDataWithLevel(url_MAV4, this.mapGoogle.mavData);
                    break;
                case 'reduce_turn_point':
                    this.uavData = await this.getUAVData(urlUAV_tp4);
                    this.mavData = await this.getMAVData(url_MAV4);
                    break;
                case 'proactive_nocheck':
                    this.uavData = await this.getUAVData(urlUAV_nocheck4);
                    this.mavData = await this.getMAVData(url_MAV4);
                    break;
                default:
                    this.mavData = await this.getMAVData(url_MAV4);
            }
        },

        getBaseStationData() {
            return new Promise(async (resolve, reject) => {
                try {
                    const res = await axios.get(urlBastStation);
                    const data = res.data;
                    resolve(
                        data.map(post => ({
                            ...post,
                        }))
                    )
                } catch(err) {
                    reject(err);
                }
            })
        },

        getStartData() {
            return new Promise(async (resolve, reject) => {
                try {
                    const res = await axios.get(urlStartArea);
                    const data = res.data;
                    resolve(
                        data.map(post => ({
                            ...post,
                        }))
                    )
                } catch(err) {
                    reject(err);
                }
            })
        },


        getEndData() {
            return new Promise(async (resolve, reject) => {
                try {
                    const res = await axios.get(urlEndArea);

                    const data = res.data;
                    resolve(
                        data.map(post => ({
                            ...post,
                        }))
                    )
                } catch(err) {
                    reject(err);
                }
            })
        },

        getMAVData(urlMAV){
            return new Promise(async (resolve, reject) => {
                try {
                    var _this = this;
                    console.log("get data from", urlMAV);
                    oboe(urlMAV).node(
                        '{TimeStep ID Latitude Longitude finished level}',
                        async function (jsonObject) {
                            if (_this.new_data_flag) {
                                console.log("initial mav pipe abort");
                                this.abort();
                            }else {
                                _this.mavData.push(jsonObject);
                            }
                        }
                    );
                    const flag = await _this.checkMAVData();
                    if (flag) {
                        // console.log("_this mav data length",_this.mavData.length);
                        resolve(
                            _this.mavData.map(post => ({
                                ...post,
                            }))
                        )
                    }
                    // console.log(_this.mavData);
                } catch (err) {
                    reject(err);
                }
            })
        },

        getMAVDataWithLevel(urlMAV, data){
            return new Promise(async (resolve, reject) => {
                try {
                    var _this = this;
                    console.log("get data from", urlMAV);
                    oboe(urlMAV).node(
                        '{TimeStep ID Latitude Longitude finished level}',
                        async function (jsonObject) {
                            data.push(jsonObject);
                        }
                    );
                    const flag = await _this.checkMAVDataWithLevel(data);
                    if (flag) {
                        // console.log("_this mav data length",_this.mavData.length);
                        resolve(
                            data.map(post => ({
                                ...post,
                            }))
                        )
                    }
                    // console.log(_this.mavData);
                } catch (err) {
                    reject(err);
                }
            })
        },

        checkMAVDataWithLevel(data) {
            return new Promise(async (resolve, reject) => {
                try {
                    let x = setInterval(() => {
                        if(data.length >= 100) {
                            clearInterval(x);
                            resolve(true);
                        }
                    }, 0);
                } catch (err) {
                    reject(err);
                }
            })
        },

        getUAVData(uavURL) {
            return new Promise(async (resolve, reject) => {
                try {
                    var _this = this;
                    // console.log(_this);
                    console.log("get data from",uavURL);
                    oboe(uavURL).node(
                        '{TimeStep ID Latitude Longitude SignalStrength CurrentBasestation finished}',
                        async function (jsonObject) {
                            _this.uavData.push(jsonObject);
                        }
                    );
                    // console.log("_this uav data length",_this.uavData.length);
                    const flag = await _this.checkUAVData();
                    if (flag) {
                        // console.log("_this uav data length",_this.uavData.length);
                        resolve(
                            _this.uavData.map(post => ({
                                ...post,
                            }))
                        );
                    }
                } catch(err) {
                    reject(err);
                }
            })
        },

        getUAVDataWithLevel(uavURL) {
            return new Promise(async (resolve, reject) => {
                try {
                    var _this = this;
                    console.log("get data from",uavURL);
                    oboe(uavURL)
                        .node(
                        '{TimeStep ID Latitude Longitude SignalStrength CurrentBasestation ' +
                        'finished Trajectory Level Flag}',
                        async function (jsonObject) {
                            if (_this.new_data_flag) {
                                console.log("initial uav pipe abort");
                                this.abort();
                            }else {
                                _this.uavData.push(jsonObject);
                                // console.log(_this.uavData.length);
                            }
                        });
                    // console.log("_this uav data length",_this.uavData.length);
                    const flag = await _this.checkUAVData();
                    if (flag) {
                        console.log("_this uav data length",_this.uavData.length);

                        resolve(
                            _this.uavData.map(post => ({
                                ...post,
                            }))
                        );
                    }
                } catch(err) {
                    reject(err);
                }
            })
        },

        getIndependentUAVDataWithLevel(uavURL, data) {
            return new Promise(async (resolve, reject) => {
                try {
                    let _this = this;
                    console.log("get data from",uavURL);
                    oboe(uavURL).node(
                        '{TimeStep ID Latitude Longitude SignalStrength CurrentBasestation ' +
                        'finished Trajectory Level Flag}',
                        async function (jsonObject) {
                            // if (data.length > 100) {data.splice(0, 10);}
                             data.push(jsonObject);
                        }
                    );
                    // console.log("_this uav data length",_this.uavData.length);
                    const flag = await _this.checkIndependentLevelData(data);
                    if (flag) {
                        // console.log("_this uav data length",_this.uavData.length);
                        // console.log("resolve!");
                        resolve(
                            data.map(post => ({
                                ...post,
                            }))
                        );
                    }
                } catch(err) {
                    reject(err);
                }
            })
        },

        checkIndependentLevelData(data) {
            return new Promise(async (resolve, reject) => {
                try {
                    let x = setInterval(() => {
                        if(data.length >= 100) {
                            clearInterval(x);
                            resolve(true);
                        }
                    }, 0);
                } catch (err) {
                    reject(err);
                }
            })
        },

        checkMAVData() {
            return new Promise(async (resolve, reject) => {
                try {
                    var _this = this;

                    let x = setInterval(() => {
                        if(_this.mavData.length >= 100) {
                            clearInterval(x);
                            resolve(true);
                        }
                    }, 0);
                } catch (err) {
                    reject(err);
                }
            })
        },

        checkUAVData() {
            return new Promise(async (resolve, reject) => {
                try {
                    var _this = this;

                    let x = setInterval(() => {
                        if(_this.uavData.length >= 100) {
                            clearInterval(x);
                            resolve(true);
                        }
                    }, 0);
                } catch (err) {
                    reject(err);
                }
            })
        },

    },
};
</script>

<style>
    /* Always set the map height explicitly to define the size of the div
    * element that contains the map. */
    #map {
        height: 100%;
    }
    /* Optional: Makes the sample page fill the window. */
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
    }
</style>
