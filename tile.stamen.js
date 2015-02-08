/*globals L*/
(function (exports) {
    'use strict';
    /*
    * tile.stamen.js v1.3.0
    */

    var SUBDOMAINS = ["a.", "b.", "c.", "d."],
        MAKE_PROVIDER = function (layer, type, minZoom, maxZoom) {
            return {
                "url":          ["http://{S}tile.stamen.com/", layer, "/{Z}/{X}/{Y}.", type].join(""),
                "type":         type,
                "subdomains":   SUBDOMAINS.slice(),
                "minZoom":      minZoom,
                "maxZoom":      maxZoom,
                "attribution":  ""
            };
        },
        PROVIDERS =  {
            "toner":        MAKE_PROVIDER("toner", "png", 0, 20),
            "terrain":      MAKE_PROVIDER("terrain", "jpg", 4, 18),
            "watercolor":   MAKE_PROVIDER("watercolor", "jpg", 1, 18)
        },
        odbl = [
            "toner",
            "toner-hybrid",
            "toner-labels",
            "toner-lines",
            "toner-background",
            "toner-lite"
        ],
        setupFlavors,
        getProvider,
        deprecate;

    /*
    * A shortcut for specifying "flavors" of a style, which are assumed to have the
    * same type and zoom range.
    */
    setupFlavors = function (base, flavors, type) {
        var provider = getProvider(base);
        flavors.forEach(function (f) {
            var flavor = [base, f].join("-");
            PROVIDERS[flavor] = MAKE_PROVIDER(flavor, type || provider.type, provider.minZoom, provider.maxZoom);
        });
    };

    /*
    * Get the named provider, or throw an exception if it doesn't exist.
    */
    getProvider = function (name) {
        if (PROVIDERS[name]) {
            var provider = PROVIDERS[name];

            if (provider.deprecated && console && console.warn) {
                console.warn(name + " is a deprecated style; it will be redirected to its replacement. For performance improvements, please change your reference.");
            }

            return provider;
        }
        throw 'No such provider (' + name + ')';
    };

    deprecate = function (base, flavors) {
        var provider = getProvider(base);

        flavors.forEach(function (f) {
            var flavor = [base, f].join("-");
            PROVIDERS[flavor] = MAKE_PROVIDER(flavor, provider.type, provider.minZoom, provider.maxZoom);
            PROVIDERS[flavor].deprecated = true;
        });
    };


    // set up toner and terrain flavors
    setupFlavors("toner", ["hybrid", "labels", "lines", "background", "lite"]);
    setupFlavors("terrain", ["background"]);
    setupFlavors("terrain", ["labels", "lines"], "png");

    // toner 2010
    deprecate("toner", ["2010"]);

    // toner 2011 flavors
    deprecate("toner", ["2011", "2011-lines", "2011-labels", "2011-lite"]);


    odbl.forEach(function (key) {
        PROVIDERS[key].retina = true;
        PROVIDERS[key].attribution = "";
    });

    /*
    * Export stamen.tile to the provided namespace.
    */
    exports.stamen = exports.stamen || {};
    exports.stamen.tile = exports.stamen.tile || {};
    exports.stamen.tile.providers = PROVIDERS;
    exports.stamen.tile.getProvider = getProvider;


    /*
    * StamenTileLayer for Leaflet
    * <http://leaflet.cloudmade.com/>
    *
    * Tested with version 0.3 and 0.4, but should work on all 0.x releases.
    */
    if (typeof L === "object") {
        L.StamenTileLayer = L.TileLayer.extend({
            initialize: function (name, options) {
                var provider = getProvider(name),
                    url = provider.url.replace(/({[A-Z]})/g, function (s) {
                        return s.toLowerCase();
                    }),
                    opts = L.Util.extend({}, options, {
                        "minZoom":      provider.minZoom,
                        "maxZoom":      provider.maxZoom,
                        "subdomains":   provider.subdomains,
                        "scheme":       "xyz",
                        "attribution":  provider.attribution,
                        sa_id:          name
                    });
                L.TileLayer.prototype.initialize.call(this, url, opts);
            }
        });

        /*
        * Factory function for consistency with Leaflet conventions 
        */
        L.stamenTileLayer = function (options, source) {
            return new L.StamenTileLayer(options, source);
        };
    }

}(exports === undefined ? this : exports));
