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

    L.Control.Locate = L.Control.extend({
        options: {
            position: 'topright',
            placeholder: 'Locations'
        },
        initialize: function (options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            var container,
                list = '';
            container = L.DomUtil.create('div', 'locate-container');
            this.select = L.DomUtil.create('select', 'select', container);
            list = '<option value="12.96967141582902,77.59339928627014">Sports</option>';
            this.select.innerHTML = list;
            this.goToLocation = function (ev) {
                var coordinates;
                coordinates = ev.target.options[ev.target.selectedIndex].value.split(',');
                map.setView([coordinates[0], coordinates[1]], 16);
            };
            this.select.addEventListener('change', this.goToLocation);
        },
        onRemove: function () {
            this.select.removeEventListener('change', this.goToLocation);
        }
    });

    zone.addTo(map);
    new L.Control.Locate().addTo(map);
});
