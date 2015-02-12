/*jslint browser:true, nomen:true*/
/*globals require*/

require(['leaflet', 'pouchdb-3.2.1.min'], function (L, Pouchdb) {
    'use strict';
    var mapElm = document.getElementById('map'), // Dom Elements
        map = L.map(mapElm).setView([12.971599, 77.594563], 12), // Leaflet Variables
        zone,
        locate,
        updateMarker,
        sendLocation,
        markers = {},
        commandDb = new Pouchdb('commanddb'),
        interpretCommand,
        listener;

    // ****************** Leaflet **********************
    zone = L.tileLayer('https://zone.mekton.nl/tiles/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 12,
        maxZoom: 18
    });
    updateMarker = function (ev) {
        var target = ev.target,
            coordinates;
        if (target.checked) {
            coordinates = target.value.split(',');
            markers[target.value] = new L.Marker([coordinates[0], coordinates[1]], {dragable: false});
            markers[target.value].addTo(map);
        } else {
            map.removeLayer(markers[target.value]);
            delete markers[target.value];
        }
    };

    sendLocation = function (ev) {
        console.log('sendLocation', markers);
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
        list += '<label><input type="checkbox" name="coordinates" value="mark" />Mark</label><br/>';
        list += '<button type="button">Send</button>';
        this.container.innerHTML = list;

        return this.container;
    };
    locate.onRemove = function () {
        this.select.removeEventListener('click', sendLocation);
        console.log('removed');
    };

    zone.addTo(map);
    locate.addTo(map);

    map.addEventListener('click', function (ev) {
        console.log('location:', ev);
    });

    locate.container.addEventListener('click', function (ev) {
        if (ev.target.tagName.toLowerCase() === 'button') {
            sendLocation(ev);
            return;
        }
        console.log('locate location', ev);
        updateMarker(ev);
    });


    // ****************** Control **********************
//    interpretCommand = function (doc) {
//        if (!doc.command) {
//            return;
//        }
//        switch (doc.command) {
//        case 'move':
//            goToLocation(doc);
//            break;
//        case 'mark':
//            multiMarkers.update(doc);
//            break;
//        }
//    };
//    listener = {
//        start: function () {
//            if (listener.status !== 'stopped') {
//                return;
//            }
//            listener.status = 'started';
//            commandDb.changes({since: 'now', include_docs: true, live: true})
//                .on('change', function (change) {
//                    if (listener.status === 'running') {
//                        console.log('listing, change', change);
//                        if (change.doc) {
//                            interpretCommand(change.doc);
//                        }
//                    }
//                })
//                .on('uptodate', function () {
//                    listener.status = 'running';
//                    console.log('listening, uptodate', arguments);
//                });
//        },
//        status: 'stopped'
//    };
//    Pouchdb.replicate('https://zone.mekton.nl/db/zone_control', 'commanddb', {live: true})
//        .on('uptodate', function () { // Should be deprecated in pouchdb, but not yet
//            listener.start();
//        })
//        .on('paused', function () { // should be used instead of uptodate, but seems not to be called yet
//            console.log('paused', arguments);
//        });
});
