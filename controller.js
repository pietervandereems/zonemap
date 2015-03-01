/*jslint browser:true, nomen:true*/
/*globals require*/

require(['leaflet'], function (L) {
    'use strict';
    var mapElm = document.getElementById('map'), // Dom Elements
        map, // Leaflet Variables
        zone,
        osm,
        locate,
        markers = {},
        updateMarker, // Internal functions
        cleanMarkers,
        sendLocation;

    // ****************** Leaflet **********************
    zone = L.tileLayer('https://zone.mekton.nl/tiles/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 10,
        maxZoom: 18
    });
    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 8,
        maxZoom: 18
    });

    map = L.map(mapElm, {center: [12.971599, 77.594563], zoom: 12, layers: [zone]});

    L.control.layers({'Zone': zone, 'Osm': osm}, null, {position: 'topleft'}).addTo(map);

    // ****************** Markers **********************
    updateMarker = function (coor, add) {
        var coordinates = [],
            coorStr;
        if (typeof coor === 'object') {
            coordinates[0] = coor.lat;
            coordinates[1] = coor.lng;
            coorStr = coor.lat + ',' + coor.lng;
        } else {
            coordinates = coor.split(',');
            coorStr = coor;
        }
        if (add) {
            markers[coorStr] = new L.Marker([coordinates[0], coordinates[1]], {dragable: true});
            markers[coorStr].addTo(map);
        } else {
            map.removeLayer(markers[coorStr]);
            delete markers[coorStr];
        }
    };

    cleanMarkers = function () {
        var inputs;
        Object.keys(markers).forEach(function (item) {
            map.removeLayer(markers[item]);
            delete markers[item];
        });
        inputs = locate.container.querySelectorAll('input');
        Object.keys(inputs).forEach(function (element) {
            inputs[element].checked = false;
        });
    };

    sendLocation = function () {
        var xhr,
            doc = {};

        if (markers.length === 0) {
            return;
        }
        if (locate.container.querySelector('input[type="text"]').value.length > 0) {
            doc.command = 'popup';
            doc.message = locate.container.querySelector('input[type="text"]').value;
            if (document.getElementById('timed').checked) {
                doc.timed = 5;
            }
        } else {
            doc.command = 'mark';
        }
        doc.location = [];
        Object.keys(markers).forEach(function (marker) {
            var latLng = markers[marker].getLatLng();
            doc.location.push({
                lat: latLng.lat,
                lng: latLng.lng
            });
        });
        xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function () {
            console.log('response:', this.responseText);
        });
        xhr.open('POST', 'https://zone.mekton.nl/db/zone_control');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(doc));
    };

    locate = L.control();

    locate.onAdd = function () {
        var list = '';
        this.container = L.DomUtil.create('div', 'locate-container');
        L.DomEvent.disableClickPropagation(this.container);
        list += '<label><input type="checkbox" name="coordinates" value="12.96967141582902,77.59339928627014" />Sports</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.9492,77.5860" />Botanical Gardens</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.96219588361988,77.57351875305176" />Fastolfe Hospital</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="13.080230711990428,77.57497787475586" />Agricultural University</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="13.135695543101336,77.60300159454346" />Airforce</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.938377236944088,77.59669303894043" />Mental Sciences</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.94383544221124,77.59581327438354" />Dental Sciences</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.987601322043336,77.62922286987305" />Army</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.826363620592424,77.5411605834961" />Von Braun Park</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.88510641838721,77.52644062042236" />Dyson Memorial Park</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.9977627702671,77.63958692550659" />Asimov R&D Grounds</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="13.071322,77.580199" />Geology Department</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.945651,77.508995" />Geology Department</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.998599084931548,77.59188652038574" />Palace</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="13.021868409794724,77.56609439849854" />Institute of Science</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.951363805094765,77.64690399169922" />Detector Range Golf Course</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.84563227058178,77.66544342041016" />Space City</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.931245838582779,77.43837833404541" />Airsoft Outdoor</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.982175440247259,77.58102893829346" />Race Course</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.96745491781277,77.58794903755188" />Memorial Church</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.993769328896438,77.6603364944458" />Susan Calvin Institue</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="13.102008522781896,77.58639335632324" />Windfall MediTech</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="13.095226675828103,77.59039521217346" />Fortune Microprocessors</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.970424184248023,77.5850522518158" />Sun, Flare, Spring</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.975139390155867,77.55075216293335" />Police Quarters</label><br/>';
        list += '<label><input type="checkbox" name="coordinates" value="12.86420911385245,77.66576528549194" />Sci-Fi fanclub</label><br/>';
        list += '<input type="checkbox" id="timed" /><input type="text" placeholder="message" /><br/>';
        list += '<button type="button" data-command="clean">Clean</button>';
        list += '<button type="button" data-command="send">Send</button>';
        this.container.innerHTML = list;

        return this.container;
    };

    locate.onRemove = function () {
        console.log('removed');
    };

    zone.addTo(map);
    locate.addTo(map);

    map.addEventListener('click', function (ev) {
        updateMarker(ev.latlng, true);
        console.log('location:', ev);
    });

    locate.container.addEventListener('click', function (ev) {
        if (ev.target.tagName.toLowerCase() === 'button') {
            switch (ev.target.dataset.command) {
            case 'send':
                sendLocation(ev);
                break;
            case 'clean':
                cleanMarkers();
                break;
            }
            return;
        }
        if (ev.target.value && ev.target.value.indexOf(',') > -1) {
            updateMarker(ev.target.value, ev.target.checked);
        }
    });
});
