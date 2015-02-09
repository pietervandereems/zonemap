/*jslint browser:true, nomen:true*/
/*globals require*/

require(['leaflet'], function (L) {
    'use strict';
    var mapElm = document.getElementById('map'), // Dom Elements
        map = L.map(mapElm).setView([12.971599, 77.594563], 12), // Leaflet Variables
        zone,
        locate,
        updateMarker;

    zone = L.tileLayer('https://zone.mekton.nl/tiles/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 12,
        maxZoom: 18
    });

    locate = L.control();

    locate.onAdd = function (map) {
        var container,
            list = '<option value="">Location</option>',
            updateMarker,
            marker;
        container = L.DomUtil.create('div', 'locate-container');
        this.select = L.DomUtil.create('select', 'select', container);
        list += '<option value="12.96967141582902,77.59339928627014">Sports</option>';
        list += '<option value="12.9492,77.5860">Botanical Gardens</option>';
        list += '<option value="12.96219588361988,77.57351875305176">Hospital</option>';
        list += '<option value="13.080230711990428,77.57497787475586">Agricultural University</option>';
        list += '<option value="13.135695543101336,77.60300159454346">Airforce</option>';
        list += '<option value="12.938377236944088,77.59669303894043">Mental Sciences</option>';
        list += '<option value="12.94383544221124,77.59581327438354">Dental Sciences</option>';
        list += '<option value="12.987601322043336,77.62922286987305">Army</option>';
        list += '<option value="12.826363620592424,77.5411605834961">Von Braun Park</option>';
        list += '<option value="12.88510641838721,77.52644062042236">Dyson Memorial Park</option>';
        list += '<option value="12.9977627702671,77.63958692550659">Asimov R&D Grounds</option>';
        this.select.innerHTML = list;

        updateMarker = function (latlng) {
            if (marker) { // we have a previous marker
                marker.setLatLng(latlng).update();
            } else { // Create a new marker
                marker = new L.Marker([latlng.lat, latlng.lng], {draggable: false});
                marker.addTo(map);
            }
        };
        this.goToLocation = function (ev) {
            var coordinates;
            coordinates = ev.target.options[ev.target.selectedIndex].value.split(',');
            map.setView([coordinates[0], coordinates[1]], 16);
            updateMarker(L.latLng(coordinates[0], coordinates[1]));
        };
        this.select.addEventListener('change', this.goToLocation);
        return this.select;
    };
    locate.onRemove = function () {
        this.select.removeEventListener('change', this.goToLocation);
        console.log('removed');
    };

    zone.addTo(map);
    locate.addTo(map);

    map.addEventListener('click', function (ev) {
        console.log('location:', ev);
    });
});
