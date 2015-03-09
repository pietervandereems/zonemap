/*jslint browser:true, nomen:true*/
/*globals require*/

require(['leaflet', 'pouchdb-3.3.1.min'], function (L, Pouchdb) {
    'use strict';
    var mapElm = document.getElementById('map'), // Dom Elements
        map = L.map(mapElm).setView([12.971599, 77.594563], 12), // the leaflet map
        zone,           // The zone tilelayer
        locate,         // The leaflet location control
        updateMarker,   // Update the single marker from the leaflet location control
        goToLocation,   // Mark and zoom to this location
        displayImage,   // Display an image fullscreen (instead of map)
        marker,         // The single marker from the leaflet location control
        multiMarkers,   // The (possible) multiple marker(s) recieved from remote
        MARKERS,        // To store and control the multiple markers recieved from remote
        POPUPS,         // Store and control the popups recieved from remote
        popups,         // the popups recieved from remote
        interpretCommand,
        listenForCommands = false;

    // ****************** Leaflet **********************
    zone = L.tileLayer('https://zone.mekton.nl/tiles/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        minZoom: 12,
        maxZoom: 18
    });

    // ** Markers **
    MARKERS = function () {
        var markers = [],
            update,
            clean;
        update = function (doc) {
            if (marker) { // remove the single marker if present
                map.removeLayer(marker);
                marker = false;
            }
            this.clean();
            doc.location.forEach(function (loc) {
                var mark;
                mark = new L.Marker([loc.lat, loc.lng], {draggable: false});
                mark.addTo(map);
                markers.push(mark);
            });
        };
        clean = function () {
            markers.forEach(function (mark) {
                map.removeLayer(mark);
            });
        };
        return {
            update: update,
            clean: clean
        };
    };
    multiMarkers = new MARKERS();

    updateMarker = function (latlng) {
        multiMarkers.clean(); // remove the multi markers if presetn
        if (marker) { // we have a previous single marker, update it's position
            marker.setLatLng(latlng).update();
        } else { // Create a new single marker
            marker = new L.Marker([latlng.lat, latlng.lng], {draggable: false});
            marker.addTo(map);
        }
    };

    // ** Popups **
    POPUPS = function () {
        var popupArr = [],
            display,
            clean;
        display = function (doc) {
            console.log('popup', doc);
            clean();
            doc.location.forEach(function (loc) {
                var popup;
                popup = L.popup();
                popup.setContent(doc.message);
                popup.setLatLng([loc.lat, loc.lng]);
                popup.addTo(map);
                popupArr.push(popup);
            });
            if (doc.timed) {
                window.setTimeout(function () {
                    clean();
                }, doc.timed * 500);
            }
        };
        clean = function () {
            popupArr.forEach(function (popup) {
                map.removeLayer(popup);
            });
        };
        return {
            display: display,
            clean: clean
        };
    };
    popups = new POPUPS();

    // ** Location **
    goToLocation = function (ev) {
        var coordinates;
        if (ev._id) {
            map.setView([ev.location.lat, ev.location.lng], ev.zoomlevel || 16);
            if (ev.mark) {
                updateMarker(L.latLng(ev.location.lat, ev.location.lng));
            }
        } else {
            if (ev.target.options[ev.target.selectedIndex].value.indexOf(',') > -1) {
                coordinates = ev.target.options[ev.target.selectedIndex].value.split(',');
                map.setView([coordinates[0], coordinates[1]], 16);
                updateMarker(L.latLng(coordinates[0], coordinates[1]));
            }
        }
    };

    displayImage = function (doc) {
        var tabs = document.querySelectorAll('[data-tab]');
        Object.keys(tabs).forEach(function (tab) {
            var elm = tabs[tab],
                image = doc._attachments[Object.keys(doc._attachments)[0]];
            if (elm.dataset.tab === 'image') {
                elm.classList.remove('invisible');
                elm.querySelector('img').src = 'data:' + image.content_type + ';base64,' + image.data;
            } else {
                elm.classList.add('invisble');
            }
        });
    };

    // ** Leaflet Control **

    locate = L.control();

    locate.onAdd = function () {
        var container,
            list = '<option value="">Location</option>';
        container = L.DomUtil.create('div', 'locate-container');
        L.DomEvent.disableClickPropagation(container);
        this.select = L.DomUtil.create('select', 'select', container);
        L.DomEvent.disableClickPropagation(this.select);
        list += '<option value="12.96967141582902,77.59339928627014">Sports</option>';
        list += '<option value="12.9492,77.5860">Botanical Gardens</option>';
        list += '<option value="12.96219588361988,77.57351875305176">Fastolfe Hospital</option>';
        list += '<option value="13.080230711990428,77.57497787475586">Agricultural University</option>';
        list += '<option value="13.135695543101336,77.60300159454346">Airforce</option>';
        list += '<option value="12.938377236944088,77.59669303894043">Mental Sciences</option>';
        list += '<option value="12.94383544221124,77.59581327438354">Dental Sciences</option>';
        list += '<option value="12.987601322043336,77.62922286987305">Army</option>';
        list += '<option value="12.826363620592424,77.5411605834961">Von Braun Park</option>';
        list += '<option value="12.88510641838721,77.52644062042236">Dyson Memorial Park</option>';
        list += '<option value="12.9977627702671,77.63958692550659">Asimov R&D Grounds</option>';
        list += '<option value="13.071322,77.580199">Geology Department</option>';
        list += '<option value="12.945651,77.508995">Geology Department</option>';
        list += '<option value="12.998599084931548,77.59188652038574">Palace</option>';
        list += '<option value="13.021868409794724,77.56609439849854">Institute of Science</option>';
        list += '<option value="12.951363805094765,77.64690399169922">Detector Range Golf Course</option>';
        list += '<option value="12.84563227058178,77.66544342041016">Space City</option>';
        list += '<option value="12.931245838582779,77.43837833404541">Airsoft Outdoor</option>';
        this.select.innerHTML = list;

        this.select.addEventListener('change', goToLocation);
        return this.select;
    };
    locate.onRemove = function () {
        this.select.removeEventListener('change', goToLocation);
        console.log('removed');
    };

    // ** Add it to the map **
    zone.addTo(map);
    locate.addTo(map);

    map.addEventListener('click', function (ev) {
        console.log('location:', ev);
    });


    // ****************** Control **********************
    interpretCommand = function (doc) {
        if (!doc.command) {
            return;
        }
        switch (doc.command) {
        case 'move':
            goToLocation(doc);
            break;
        case 'mark':
            multiMarkers.update(doc);
            break;
        case 'popup':
            popups.display(doc);
            break;
        case 'image':
            displayImage(doc);
            break;
        }
    };

    Pouchdb.replicate('https://zone.mekton.nl/db/zone_control', 'commanddb', {live: true, retry: true})
//        .on('uptodate', function () { // Deprecated in pouchdb 3.3.0
//        })
        .on('paused', function () { // should be used instead of uptodate
            listenForCommands = true;
        })
        .on('change', function (change) {
            if (listenForCommands) {
                if (change.docs) {
                    interpretCommand(change.docs[0]);
                }
            }
        })
//        .on('complete', function () {
//        })
//        .on('active', function () {
//        })
        .on('denied', function () {
            console.warn('denied', arguments);
        })
        .on('error', function () {
            console.error('error', arguments);
        });
});
