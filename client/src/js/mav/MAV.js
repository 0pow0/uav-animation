class MAV {
    constructor(sourceMap, data) {
        this._ID = data.ID;
        this._latitude = data.Latitude;
        this._longitude = data.Longitude;
        this._timeStep = data.TimeStep;
        this.markerStyle = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#fc9009",
            fillOpacity: 2,
            strokeWeight: 6,
        };
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