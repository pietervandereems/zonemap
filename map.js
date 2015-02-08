/*jslint browser:true, nomen:true*/
/*globals require, L, alert*/

//********** THIRD, show map and react to user input ***************************
require.config({
    paths: {
        'leaflet': 'leaflet',
        'providers': 'leaflet-providers'
    },
    shim: {
        'leaflet': {
            exports: 'L'
        },
        'providers' : {
            deps: ['leaflet']
        }
    }
});

require(['providers'], function () {
    'use strict';
    var MARKER, // MARKER contains the current marker on the map
        mapElm = document.getElementById('map'), // Dom Elements
        map = L.map(mapElm).setView([12.971599, 77.594563], 11), // Leaflet Variables
        stamenTiles,
        updateMarker;

    var Stamen_Watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16
    });
    var Stamen_TonerLines = L.tileLayer('http://{s}.tile.stamen.com/toner-lines/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
    });

    L.tileLayer.provider('Stamen.Watercolor').addTo(map);

    // *** Internal Functions ****
    updateMarker = function (latlng) {
        if (MARKER) { // we have a previous marker
            MARKER.setLatLng(latlng).update();
        } else { // Create a new marker
            MARKER = new L.Marker([latlng.lat, latlng.lng], {draggable: true});
            MARKER.addTo(map);
        }
    };

    // **** Add the listeners ****
    // ** Leaflet
    map.addEventListener('click', function (ev) {
        updateMarker(ev.latlng);
    });
});
