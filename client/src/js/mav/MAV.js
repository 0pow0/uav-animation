class MAV {
    constructor(sourceMap, data, level) {
        this._ID = data.ID;
        this._latitude = data.Latitude;
        this._longitude = data.Longitude;
        this._timeStep = data.TimeStep;
        this.markerStyle = null;

        this.level1 = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: "#95ff6d",
            fillOpacity: 2,
            strokeWeight: 3,
            strokeOpacity: 0.5,

        };

        this.level2 = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: "#32b300",
            fillOpacity: 2,
            strokeWeight: 3,
            strokeOpacity: 0.5,
        };

        this.level3 = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: "#00aeff",
            fillOpacity: 2,
            strokeWeight: 3,
            strokeOpacity: 0.5,

        };

        this.level4 = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: "#1500ff",
            fillOpacity: 2,
            strokeWeight: 3,
            strokeOpacity: 0.5,

        };

        switch (level) {
            case "1":
                this.markerStyle = this.level1;
                break;
            case "2":
                this.markerStyle = this.level2;
                break;
            case "3":
                this.markerStyle = this.level3;
                break;
            case "4":
                this.markerStyle = this.level4;
                break;
            default:
                this.markerStyle = {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#fc9009",
                    fillOpacity: 2,
                    strokeWeight: 6,
                };
        }



        this.marker = new google.maps.Marker({
            position: {
                lat: Number(this._latitude),
                lng: Number(this._longitude)
            },
            map: sourceMap,
            icon: this.markerStyle,
        });
        this.pathICON = {
            path: google.maps.SymbolPath.CIRCLE
        };
        this.path = {}
    }

    updateLevelIcon(level) {
        switch (level) {
            case "1":
                this.marker.setIcon(this.level1);
                break;
            case "2":
                this.marker.setIcon(this.level2);
                break;
            case "3":
                this.marker.setIcon(this.level3);
                break;
            case "4":
                this.marker.setIcon(this.level4);
                break;
            default:
                this.marker.setIcon(this.markerStyle);
        }
    }

    get ID() {
        return this._ID;
    }

    get latitude() {
        return this._latitude;
    }

    get longitude() {
        return this._longitude;
    }

    get timeStep() {
        return this._timeStep;
    }

    set latitude(value) {
        this._latitude = value;
    }

    set longitude(value) {
        this._longitude = value;
    }

    set timeStep(value) {
        this._timeStep = value;
    }
}


export default MAV;