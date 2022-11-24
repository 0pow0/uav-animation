/*global google*/

class UAV {

    constructor(data, mapmarker, level, map) {
        this.ID = data.ID;
        this.lat = Number(data.Latitude);
        this.long = Number(data.Longitude);
        this.mapmarker = mapmarker;
        this.prePath = [];
        this.uavPath = {};
        this.state = true;
        this.eNB = null;
				this.eNBLine = null;
        this.googlemap = map;
        this.changeENBMarker = null;
        if (level == null) this.level = null;
        else this.level = level
    }

    // remove the num lastest vertex in path
    // and return the lastest uav poistion
    popPath(num) {
        if (!Object.getOwnPropertyNames(this.uavPath).length > 0) {
            return undefined;
        }

        let path = this.uavPath.getPath();

        if (num === undefined) {
            path.pop();
        } else {
            while (num > 0) {
                path.pop();
                num--;
            }
        }

        const len = path.getLength();

        if (len === 1) {
            return undefined;
        }

        const latlng = path.getAt(len - 1);
        return latlng
    }

    // change uav marker position
    setMarkerPosition(latlng, uavMap) {
        if (latlng === undefined) {
            return;
        }

        this.mapmarker.setPosition({
            lat: latlng.lat(),
            lng: latlng.lng(),
        });

        uavMap.set(this.ID, this);
    }

    // uav back num step
    back(num, uavMap) {
        const latlng = this.popPath(num);
        this.setMarkerPosition(latlng, uavMap);
    }

    setChangeENBMarker() {
        console.log("add purple icon:", this.lat, this.long);
        const icon = {
            url: this.changeENBMarkerPath,
            scaledSize: new google.maps.Size(100, 100)
        }
        this.changeENBMarker = new google.maps.Marker({
            position: {
                lat: this.lat,
                lng: this.long
            },
            map: this.googlemap,
            icon: icon
        });
        this.changeENBMarker.setMap(this.googlemap);
    }

    unsetChangeENBMarker() {
        this.changeENBMarker && setTimout(() => this.changeENBMarker.setMap(null), 10000);
    }

}

UAV.prototype.changeENBMarkerPath = "https://maps.google.com/mapfiles/ms/icons/purple-dot.png";


export default UAV;
