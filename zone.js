/*jslint browser:true, nomen:true*/
/*globals require, L, alert*/

//********** THIRD, show map and react to user input ***************************
require.config({
    paths: {
        'leaflet': 'leaflet',
        'stamen': 'tile.stamen'
    },
    shim: {
        'leaflet': {
            exports: 'L'
        },
        'stamen' : {
            deps: ['leaflet']
        }
    }
});

require(['stamen'], function (stamen) {
    'use strict';
    var MARKER, // MARKER contains the current marker on the map
        mapElm = document.getElementById('map'), // Dom Elements
        map = L.map(mapElm).setView([53.2362, 6.5949], 11), // Leaflet Variables
        stamenTiles,
        updateMarker;

    // **** Helper functions ********
    stamenTiles = new L.StamenTileLayer("watercolor");
    map.addLayer(stamenTiles);

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
