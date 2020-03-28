class GroundController 
{

    constructor(config,socket)
    { 
        this.socket   = socket || {};
        this.port     = config.comport || "COM1";
        this.map      = null;
        this.mapId    = config.mapId || "myMap";
        this.mapToken = config.mapToken || "";
        this.console  = document.getElementById(config.console) || {};
        this.table    = document.getElementById(config.table) || {};
        this.geoNow   = {"lat":config.location[0],"lon":config.location[1],"alt":0.00,"sat":0};
        this.geoMin   = {"alt":0.00,"sat":0};
        this.geoMax   = {"alt":0.00,"sat":0};
        this.markerUpdate  = true;
        this.markerCurrent = null;
    }

    connect(port = this.port)
    {
        this.socket.emit('start',port);
        this.initMap();
    }

    initMap()
    {
        this.map = L.map(this.mapId).setView([this.geoNow.lat, this.geoNow.lon], 17);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: this.mapToken
        }).addTo(this.map);
        this.addMarker();
    }

    addMarker()
    {
        this.markerCurrent = L.marker([this.geoNow.lat, this.geoNow.lon]);
    }
    updateMarker()
    {
        if(this.markerUpdate){
            this.map.panTo(new L.LatLng(this.geoNow.lat, this.geoNow.lon));
            this.markerCurrent = L.marker([this.geoNow.lat, this.geoNow.lon]).addTo(this.map);
            this.markerUpdate = false;
        }
    }

    update(rawData)
    {
        this.updateConsole(rawData);
        if(!rawData.match(/^[a-zA-z]/)){
            let data = rawData.split(",");
            if(data.length == 4){

                if(this.geoNow.lat != data[0] || this.geoNow.lon != data[1]) {
                    this.markerUpdate = true;
                }
                //Update Current Values
                this.geoNow.lat = data[0];
                this.geoNow.lon = data[1];
                this.geoNow.alt = data[2];
                this.geoNow.sat = data[3];
                //Update Max/Min Values
                if(this.geoNow.alt < this.geoMin.alt) { this.geoMin.alt = this.geoNow.alt; }
                if(this.geoNow.alt > this.geoMax.alt) { this.geoMax.alt = this.geoNow.alt; }
                if(this.geoNow.sat < this.geoMin.sat) { this.geoMin.sat = this.geoNow.sat; }
                if(this.geoNow.sat > this.geoMax.sat) { this.geoMax.sat = this.geoNow.sat; }
                //Update GUI
                this.updateTable();
                this.updateMarker();
            }
        }
    }

    updateConsole(rawData)
    {
        let currentdate = new Date();
        let datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + " "  
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();
        this.console.value += ( datetime + ': ' + rawData + '\r\n');
        this.console.scrollTop = this.console.scrollHeight;
    }

    updateTable()
    {
        this.table.rows[0].cells[1].innerHTML = this.geoNow.lon;
        this.table.rows[1].cells[1].innerHTML = this.geoNow.lat;
        this.table.rows[2].cells[1].innerHTML = this.geoNow.alt;
        this.table.rows[2].cells[2].innerHTML = this.geoMin.alt;
        this.table.rows[2].cells[3].innerHTML = this.geoMax.alt;
        this.table.rows[3].cells[1].innerHTML = this.geoNow.sat;
        this.table.rows[3].cells[2].innerHTML = this.geoMin.sat;
        this.table.rows[3].cells[3].innerHTML = this.geoMax.sat;
    }

}