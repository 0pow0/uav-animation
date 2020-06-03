/*global google*/

class MAVMarker {
    constructor(sourceMap) {
        // console.log("MAVMarker");
        this._sourceMap = sourceMap;
        this.markerStyle = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#fc9009",
            fillOpacity: 2,
            strokeWeight: 6,
        };
        Event.listen("currTime", () => {
            console.log(document.getElementById("curtime").value);
        })
    }

    showMAV(mav){
        console.log("mav.latitude", mav.latitude);
        new google.maps.Marker({
            position: {
                lat: Number(mav.latitude),
                lng: Number(mav.longitude)
            },
            map: this._sourceMap,
            icon: this.markerStyle,
            label: mav.ID
        });
    }
}

export default MAVMarker;