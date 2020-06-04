/*global google*/

import MAV from "./MAV";

class MAVController {
    constructor(sourceMap, mavData) {
        // console.log("MAVController");
        this._sourceMap = sourceMap;
        this.mavData = mavData;
        this.past = [];
        this.mavMap = new Map();
        Event.listen("currTime", (timeStep) => this.fly(timeStep));
        Event.listen("mav backtrack", (backFlag, currTime) => this.backtrack(backFlag, currTime))
    }

    extractMAV(timeStep){
        console.log("timeStep", timeStep);
        let res = [];
        let seg = 0;
        for (let i = 0; i < this.mavData.length; i++) {
            if (this.mavData[i].TimeStep == timeStep) res.push(this.mavData[i]);
        }
        // console.log("seg ", seg, "res len : ", res.length, " mav data len: ", this.mavData.length);

        return res;
    }

    fly(timeStep) {
        let data = this.extractMAV(timeStep);
        if (data.length == 0) return;
        // console.log("start flying"+" data len: "+data.length);
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
            if (!this.mavMap.has(data[i].ID)) {
                // console.log("没有 ："+i);
                this.mavMap.set(data[i].ID, new MAV(this._sourceMap, data[i]))
            }
            else {
                if (data[i].finished === "-1") {
                    // console.log("data[i].finished === \"-1\" "+i);
                    this.mavMap.get(data[i].ID).marker.setMap(null);
                    if (Object.getOwnPropertyNames(this.mavMap.get(data[i].ID).path).length > 0) {
                        this.mavMap.get(data[i].ID).path.setMap(null);
                    }
                    this.mavMap.delete(data[i].ID);
                    continue;
                }
                let currMAV = this.mavMap.get(data[i].ID);
                currMAV.marker.setPosition({
                    lat: Number(data[i].Latitude),
                    lng: Number(data[i].Longitude)
                });
                if (Object.getOwnPropertyNames(currMAV.path).length <= 0) {
                    currMAV.path = new google.maps.Polyline({
                        path: [
                            {
                                lat: Number(currMAV.latitude),
                                lng: Number(currMAV.longitude)
                            },
                            {
                                lat: Number(data[i].Latitude),
                                lng: Number(data[i].Longitude)
                            },
                        ],
                        icons: [{
                            icon: currMAV.pathICON,
                            offset: '50%',
                            repeat: '20px',
                        }],
                        geodesic: true,
                        strokeColor: '#fc9009',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    currMAV.path.setMap(this._sourceMap);
                }else {
                    let newLatLng = new google.maps.LatLng({
                        lat: Number(data[i].Latitude),
                        lng: Number(data[i].Longitude)
                    });
                    let path = currMAV.path.getPath();
                    path.push(newLatLng);
                    currMAV.path.setPath(path);
                }
                currMAV.latitude = data[i].Latitude;
                currMAV.longitude = data[i].Longitude;
                currMAV.timeStep = data[i].TimeStep;
                this.mavMap.set(currMAV.ID, currMAV);
            }
        }
    }

    backtrack(backFlag, currTime) {
        console.log("backFlag, currTime :" + backFlag + " " + currTime);
        // console.log("this.past[this.past.length-1].TimeStep: " + this.past[this.past.length-1][0].TimeStep);

        //
        // let steps = backFlag;
        //
        // let backstep = this.past.splice(this.past.length - steps, steps);
        // console.log("MAVController backtrack(): back steps" + backstep.length);

        let backstep = this.extractMAV(currTime);
        console.log("backstep.length"+backstep.length);

        console.log("====================");
        let backMAVs = new Map();
        console.log(backMAVs.size);
        for (let i = backstep.length-1; i >= 0; i--) {
            if (backMAVs.has(backstep[i].ID)) {
                backMAVs.set(backstep[i].ID, backMAVs.get(backstep[i].ID) + 1);
            } else if (this.mavMap.has(backstep[i].ID)) {
                backMAVs.set(backstep[i].ID, 1);
            }
        }
        console.log(backMAVs.size);
        console.log("====================");

        for (let [key, value] of backMAVs) {
            if (this.mavMap.has(key)) {
                let currMAV = this.mavMap.get(key);

                if (!Object.getOwnPropertyNames(currMAV.path).length > 0) continue;

                let path = currMAV.path.getPath();
                while (value > 0) {
                    path.pop();
                    value--;
                }
                const len = path.getLength();
                const latlng = path.getAt(len-1);

                if (latlng === undefined) continue;

                currMAV.marker.setPosition({
                    lat: latlng.lat(),
                    lng: latlng.lng(),
                });
                this.mavMap.set(key, currMAV);
            }
        }
    }

}

export default MAVController;