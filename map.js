/*jslint browser:true, nomen:true*/
/*globals require*/

require(['leaflet'], function (L) {
    'use strict';
    var mapElm = document.getElementById('map'), // Dom Elements
        map = L.map(mapElm).setView([12.971599, 77.594563], 12), // Leaflet Variables
        zone;

    zone = L.tileLayer('http://zone.mekton.nl/tiles/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 12,
        maxZoom: 18
    });

    zone.addTo(map);
});
