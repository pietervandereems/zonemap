/*jslint browser:true, nomen:true*/
/*globals require*/

require(['leaflet'], function (L) {
    'use strict';
    var mapElm = document.getElementById('map'), // Dom Elements
        map = L.map(mapElm).setView([12.971599, 77.594563], 12), // Leaflet Variables
        zone,
        locations;

    locations = [
        {
            'lat': 12.96967141582902,
            'lng': 77.59339928627014,
            'popup': 'Sports'
        },
        {
            'lat': 2.9492,
            'lng': 77.5860,
            'popup': 'Botanical Gardens'
        },
        {
            'lat': 12.96219588361988,
            'lng': 77.57351875305176,
            'popup': 'Fastolfe Hospital'
        },
        {
            'lat': 13.080230711990428,
            'lng': 77.57497787475586,
            'popup': 'Agricultural University'
        },
        {
            'lat': 13.135695543101336,
            'lng': 77.60300159454346,
            'popup': 'Airforce'
        },
        {
            'lat': 12.938377236944088,
            'lng': 77.59669303894043,
            'popup': 'Mental Sciences'
        },
        {
            'lat': 12.94383544221124,
            'lng': 77.59581327438354,
            'popup': 'Dental Sciences'
        },
        {
            'lat': 12.987601322043336,
            'lng': 77.62922286987305,
            'popup': 'Army'
        },
        {
            'lat': 12.826363620592424,
            'lng': 77.5411605834961,
            'popup': 'Von Braun Park'
        },
        {
            'lat': 12.88510641838721,
            'lng': 77.52644062042236,
            'popup': 'Dyson Memorial Park'
        },
        {
            'lat': 12.9977627702671,
            'lng': 77.63958692550659,
            'popup': 'Asimov R&D Grounds'
        },
        {
            'lat': 13.071322,
            'lng': 77.580199,
            'popup': 'Geology Department'
        },
        {
            'lat': 12.945651,
            'lng': 77.508995,
            'popup': 'Geology Department'
        },
        {
            'lat': 12.998599084931548,
            'lng': 77.59188652038574,
            'popup': 'Palace'
        },
        {
            'lat': 13.021868409794724,
            'lng': 77.56609439849854,
            'popup': 'Institute of Science'
        },
        {
            'lat': 12.951363805094765,
            'lng': 77.64690399169922,
            'popup': 'Detector Range Golf Course'
        },
        {
            'lat': 12.84563227058178,
            'lng': 77.66544342041016,
            'popup': 'Space City'
        },
        {
            'lat': 12.931245838582779,
            'lng': 77.43837833404541,
            'popup': 'Airsoft Outdoor'
        }

    ];

    zone = L.tileLayer('https://zone.mekton.nl/tiles/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 12,
        maxZoom: 18
    });

    zone.addTo(map);
    locations.forEach(function (loc) {
        var marker;
        marker = new L.Marker([loc.lat, loc.lng], {draggable: false});
        marker.bindPopup(loc.popup);
        marker.addTo(map);
    });
});
