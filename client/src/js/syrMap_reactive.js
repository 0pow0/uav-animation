/*global google*/

import UAV from './UAV'
import MAVController from "./mav/MAVController";
import uavIcon from '../assets/uav.png'

class syrMap_reactive {

    constructor(mapID, uavdata, startArea, endArea, mavData) {
        this.googlemap = new google.maps.Map(document.getElementById(mapID), {
            zoom: 13,
            center: {lat: 43.0481221, lng: -76.14742439999999}
        });

        this.yellow_dot_path = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
        this.red_dot_path = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

        //for animation
        this.timeoutArr = [];
        //pointing to json
        this._uavdata = uavdata;
        this._mavData = mavData;
        //start area json
        this.startArea = startArea;
        //end area json
        this.endArea = endArea;
        //updated time for query
        this.updatedCurrTime = 0;
        //flags
        this.showTrackFlag = document.getElementById('uavTrackChkBox').checked;
        this.showUAVIDFlag = document.getElementById('uavIDChkBox').checked;
        this.timeInterval = 0;
        this.hideUAVFlag = document.getElementById('uavHideChkBox').checked;
        this.hideUAVTrackFlag = document.getElementById('uavHideChkBox').checked;
        this.updateCurrtimeFlag = false;
        this.flying = false;
        this.mavController = new MAVController(this.googlemap, this._mavData);

        //store all the flying uav
        this.uavMap = new Map();
        //show area
        this.showStartArea();
        this.showEndArea();
        // for playback
        this.pastTimeInterval = [];
        //uav image
        this.missingIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#7CFC00",
            fillOpacity: 2,
            strokeWeight: 6,
        };

        this.level1 = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#95ff6d",
            fillOpacity: 2,
            strokeWeight: 6,
        };

        this.level2 = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#32b300",
            fillOpacity: 2,
            strokeWeight: 6,
        };

        this.level3 = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#00aeff",
            fillOpacity: 2,
            strokeWeight: 6,
        };

        this.level4 = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#1500ff",
            fillOpacity: 2,
            strokeWeight: 6,
        };


        // this.uavImage = '/images/uav.png';
        this.uavImageNull = {path: google.maps.SymbolPath.CIRCLE, scale: 0};
    }


    get uavdata() {
        return this._uavdata;
    }

    set uavdata(value) {
        this._uavdata = [];
        // console.log("this is uavdata setter");
        // console.log(this._uavdata.length);
        this._uavdata = value;
        // console.log(this._uavdata.length);
    }

    set mavData(value) {
        this._mavData = [];
        this._mavData = value;
        this.mavController.mavData = [];
        this.mavController.mavData = value;
    }

    get mavData() {
        return this._mavData;
    }

    showStartArea() {
        for (let item in this.startArea) {
            let rectangle = new google.maps.Rectangle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.05,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: this.googlemap,
                bounds: {
                    north: Number(this.startArea[item].bottom_right_y),
                    south: Number(this.startArea[item].top_left_y),
                    east: Number(this.startArea[item].bottom_right_x),
                    west: Number(this.startArea[item].top_left_x)
                }
            });
        }
    }


    showEndArea() {
        for (let item in this.endArea) {
            let rectangle = new google.maps.Rectangle({
                strokeColor: '#0000FF',
                strokeOpacity: 0.05,
                strokeWeight: 2,
                fillColor: '#0000FF',
                fillOpacity: 0.35,
                map: this.googlemap,
                bounds: {
                    north: Number(this.endArea[item].bottom_right_y),
                    south: Number(this.endArea[item].top_left_y),
                    east: Number(this.endArea[item].bottom_right_x),
                    west: Number(this.endArea[item].top_left_x)
                }
            });
        }
    }



    checkTimeSeg() {
        let currTimeStep = this._uavdata[0].TimeStep;
        let tempIndex = 0;
        while (tempIndex < this._uavdata.length) {
            if (this._uavdata[tempIndex].TimeStep !== currTimeStep) {
                break;
            }
            tempIndex += 1;
        }
        return tempIndex;
    }


    fly() {
        if (this.updateCurrtimeFlag) {
            let res = this.updateCurrtime();
            if (!res) {
                return;
            }
        }

        if (this.flying) {
            return;
        } else {
            this.flying = true;
        }

        let intervalId = setInterval(() => {
            //exit
            if (this._uavdata.length == 0) {
                console.log("done,", this._uavdata.length);
                clearInterval(intervalId);
                return;
            }
            //console.log("length ", this._uavdata.length);
            //console.log("first ele", this._uavdata[0]);
            let endIndex = this.checkTimeSeg();
            let currIndex = 0;
            let currID = 0;
            let currUAV;
            let labelid = null;
            let image = this.missingIcon;

            // console.log(this._uavdata[currIndex].TimeStep);
            document.getElementById('curtime').value= this._uavdata[currIndex].TimeStep;
            Event.fire("currTime", this._uavdata[currIndex].TimeStep);
            document.getElementById('curUAVnum').value = this.uavMap.size;
            while (currIndex < endIndex) {
                currID = this._uavdata[currIndex].ID;
                let currLevel = this._uavdata[currIndex].Level;
                // console.log(currLevel);
                //console.log("curr Index ", currIndex);
                //console.log("curr uav ID", currID);
                //new UAV
                switch (currLevel) {
                    case '1':
                        image = this.level1;
                        break;
                    case '2':
                        image = this.level2;
                        break;
                    case '3':
                        image = this.level3;
                        break;
                    case '4':
                        image = this.level4;
                        break;
                    default:
                        image = this.missingIcon
                }
                if (!this.uavMap.has(currID)) {
                    //new icon

                    //if show uav id
                    if (this.showUAVIDFlag) {
                        labelid = this._uavdata[currIndex].ID;
                        image =  this.uavImageNull;
                    } else {
                        // image = this.missingIcon;
                        labelid = null;
                    }
                    // make marker
                    let marker;
                    let newUAV;
                    if (this._uavdata[currIndex].finished < 2) {
                        //no conflict
                        marker = new google.maps.Marker({
                            position: {
                                lat: Number(this._uavdata[currIndex].Latitude),
                                lng: Number(this._uavdata[currIndex].Longitude)
                            },
                            map: this.googlemap,
                            icon: image,
                            label: labelid
                        });
                        newUAV = new UAV(this._uavdata[currIndex], marker);
                        newUAV.state = true;
                    } else {
                        // conflict
                        marker = new google.maps.Marker({
                            position: {
                                lat: Number(this._uavdata[currIndex].Latitude),
                                lng: Number(this._uavdata[currIndex].Longitude)
                            },
                            map: this.googlemap,
                            label: labelid,
                            icon: image
                        });
                        newUAV = new UAV(this._uavdata[currIndex], marker);
                        newUAV.state = false;
                    }
                    this.uavMap.set(currID, newUAV);
                    //console.log("new UAV ID ", currID);
                } else {
                    // uav exists
                    currUAV = this.uavMap.get(currID);
                    //console.log("exist uav",currUAV);
                    //uav lands

                    if (this._uavdata[currIndex].finished === '-1') {
                        //remove icon
                        if (this.hideUAVFlag) {
                            currUAV.mapmarker.setMap(null);
                        }
                        if (this.hideUAVTrackFlag
                            && Object.getOwnPropertyNames(currUAV.uavPath).length > 0) {
                            currUAV.uavPath.setMap(null);
                        }
                        //delete element in map
                        this.uavMap.delete(currID);
                    }
                    //uav moving
                    else {
                        if (this.showTrackFlag) {
                            let lineSymbol = {
                                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
                            };
                            if (!Object.getOwnPropertyNames(currUAV.uavPath).length > 0) {
                                // uavPath is null
                                currUAV.uavPath = new google.maps.Polyline({
                                    path: [
                                        {
                                            lat: currUAV.lat,
                                            lng: currUAV.long
                                        },
                                        {
                                            lat: Number(this._uavdata[currIndex].Latitude),
                                            lng: Number(this._uavdata[currIndex].Longitude)
                                        },
                                    ],
                                    icons: [{
                                        icon: lineSymbol,
                                        offset: '100%',
                                        repeat: '20px',
                                    }],
                                    geodesic: true,
                                    strokeColor: '#42b0f4',
                                    strokeOpacity: 1.0,
                                    strokeWeight: 2
                                });
                                currUAV.uavPath.setMap(this.googlemap);
                            } else {
                                // update path
                                let newLatLng = new google.maps.LatLng({
                                    lat: Number(this._uavdata[currIndex].Latitude),
                                    lng: Number(this._uavdata[currIndex].Longitude)
                                });
                                let path = currUAV.uavPath.getPath();
                                path.push(newLatLng);
                                currUAV.uavPath.setPath(path);
                            }
                            // currUAV.prePath.push(flightPath);
                            // flightPath.setMap(this.googlemap);
                        }
                        //update uav obj position
                        currUAV.lat = Number(this._uavdata[currIndex].Latitude);
                        currUAV.long = Number(this._uavdata[currIndex].Longitude);
                        let icon = null;
                        // conflict with uav is yellow
                        if (this._uavdata[currIndex].Flag === "1") {
                            icon = {
                                path: this.yellow_dot_path,
                                size: new google.maps.Size(Number(3), Number(3))
                            };
                        }
                        // conflict with mav is red
                        if (this._uavdata[currIndex].Flag === "2") {
                            icon = {
                                path: this.red_dot_path,
                                size: new google.maps.Size(Number(3), Number(3))
                            };
                        }
                        //if normnal to conflict
                        if (this._uavdata[currIndex].finished === "2" && currUAV.state === true) {

                            currUAV.state = false;
                            currUAV.mapmarker.setMap(null);
                            currUAV.mapmarker = new google.maps.Marker({
                                position: {
                                   lat: currUAV.lat,
                                    lng: currUAV.long
                                },
                                map: this.googlemap,
                                icon: icon
                            });
			    currUAV.mapmarker.setMap(this.googlemap);
                            //console.log("change to confict");
                        }
                        //if confict to normal
                        else if(this._uavdata[currIndex].finished === "1" && currUAV.state === false){
                            // console.log(currUAV.ID);
                            currUAV.state = true;
                            currUAV.mapmarker.setMap(null);
                            currUAV.mapmarker = new google.maps.Marker({
                                position: {
                                    lat: currUAV.lat,
                                    lng: currUAV.long
                                },
                                map: this.googlemap,
                                icon: image,

                            });
                            //console.log("change to normal");
                        }
                        currUAV.mapmarker.setPosition({
                            lat: Number(this._uavdata[currIndex].Latitude),
                            lng: Number(this._uavdata[currIndex].Longitude)
                        });
                        //update uav hashmap
                        this.uavMap.set(currID, currUAV);
                    }
                }
                currIndex += 1;
            }
            //move uavData loading window
            this.pastTimeInterval.push(this._uavdata.splice(0, endIndex));
            
            if (this.pastTimeInterval.length > 100) {
                this.pastTimeInterval.shift();
            }
        }, this.timeInterval);
        this.timeoutArr.push(intervalId);
    }

    pause() {
        this.flying = false;
        for (let item in this.timeoutArr) {
            clearInterval(this.timeoutArr[item]);
        }
    }

    backtrack(backFlag) {
        Event.fire2("mav backtrack", backFlag, (Math.floor((document.getElementById('curtime').value-backFlag)/10) * 10));
        // console.log(backFlag);
        this.pause();

        let steps = backFlag;
        let backstep = this.pastTimeInterval.splice(this.pastTimeInterval.length - steps, steps);


        let backUAVs = new Map();
        for (let i = backstep.length-1; i >= 0; i--) {
            backstep[i].forEach(u => {
                this._uavdata.unshift(u);
                if (backUAVs.has(u.ID)) {
                    backUAVs.set(u.ID, backUAVs.get(u.ID) + 1);
                } else if (this.uavMap.has(u.ID)) {
                    backUAVs.set(u.ID, 1);
                }
            });
        }

        for (let [key, value] of backUAVs) {
            if (this.uavMap.has(key)) {
                let currUAV = this.uavMap.get(key);

                if (!Object.getOwnPropertyNames(currUAV.uavPath).length > 0) continue;

                let path = currUAV.uavPath.getPath();
                while (value > 0) {
                    path.pop();
                    value--;
                }
                const len = path.getLength();
                const latlng = path.getAt(len-1);

                if (latlng === undefined) continue;

                currUAV.mapmarker.setPosition({
                    lat: latlng.lat(),
                    lng: latlng.lng(),
                });
                this.uavMap.set(key, currUAV);
            }
        }
        document.getElementById('curtime').value= this._uavdata[0].TimeStep;
    }

    resume() {
        this.fly();
    }

    setTimeInterval(val) {
        // this.timeInterval = document.getElementById('timeinterval').value;
        this.timeInterval = val;

        if (this.flying) {
            this.pause();
            this.resume();
        } else {
            this.pause();
        }

    }

    setShowTrack() {
        this.showTrackFlag = document.getElementById('uavTrackChkBox').checked;
    }

    setShowUAVID() {
        this.showUAVIDFlag = document.getElementById('uavIDChkBox').checked;
    }

    setHideUAVTrack() {
        this.hideUAVFlag = document.getElementById('uavHideChkBox').checked;
        this.hideUAVTrackFlag = document.getElementById('uavHideChkBox').checked;
    }
    getCurrTime(currtime) {
        this.updateCurrtimeFlag = true;
        this.updatedCurrTime = Number(document.getElementById('setCurtime').value);
    }

    updateCurrtime() {
        let endIndex = this._uavdata.length;
        if (Number(this._uavdata[endIndex-1].TimeStep) < this.updatedCurrTime) {
            alert("Input time step" + this.updatedCurrTime + "last time step in pool " + Number(this._uavdata[endIndex-1].TimeStep) + "\n" +
                "Make sure input time step in the range.\n" +
                "If true, please wait a few minutes to load data into pool.\n" +
                "Don't refresh this page and try again.");
            // console.log();
            return false;
        }
        let startIndex = 0;
        let midIndex;
        let midTimeStep = 0;
        let resultIndex = 0;
        //binary search
        while (startIndex + 1 < endIndex) {
            midIndex =parseInt( startIndex + (endIndex - startIndex) / 2);
            midTimeStep = Number(this._uavdata[midIndex].TimeStep);
            if (midTimeStep < this.updatedCurrTime) {
                startIndex = midIndex;
            } else {
                endIndex = midIndex;
            }
        }
        if (Number(this._uavdata[startIndex].TimeStep) === this.updatedCurrTime) {
            resultIndex = startIndex;
        }
        if (Number(this._uavdata[endIndex].TimeStep) === this.updatedCurrTime) {
            resultIndex = endIndex;
        }
        //move to that timestep
        this._uavdata.splice(0, resultIndex);
        this.updateCurrtimeFlag = false;
        return true;
    }

}

export default syrMap_reactive;
