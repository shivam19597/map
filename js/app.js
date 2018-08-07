//global
//secret keys
var GOOGLE_MAP_KEY = "AIzaSyB3fVh46_YszhL0tIHbYa7jFU7PWNAfqPs";
var DARK_SKY_KEY = "4315c04d000b476eb80c07affa6200d8";

//model
function model() {
    return ([{
        position: {
            lat: 28.6156,
            lng: 77.1786
        },
        title: "Buddha Jayanti Park",
        type: "Park"
    }, {
        position: {
            lat: 28.5931,
            lng: 77.2197
        },
        title: "The Lodi Garden",
        type: "Park"
    }, {
        position: {
            lat: 28.7223,
            lng: 77.1186
        },
        title: "Japanese Park",
        type: "Park"
    }, {
        position: {
            lat: 28.6127,
            lng: 77.2773
        },
        title: "Swaminarayan Akshardham",
        type: "Tourist Spot"
    }, {
        position: {
            lat: 28.5244,
            lng: 77.1855
        },
        title: "Qutub Minar",
        type: "Tourist Spot"
    }, {
        position: {
            lat: 28.5933,
            lng: 77.2507
        },
        title: "Humayun's Tomb",
        type: "Tourist Spot"
    }, {
        position: {
            lat: 28.6315,
            lng: 77.2167
        },
        title: "Connaught Place",
        type: "Market"
    }, {
        position: {
            lat: 28.6310,
            lng: 77.2186
        },
        title: "Palika Bazaar",
        type: "Market"
    }, {
        position: {
            lat: 28.6278,
            lng: 77.2190
        },
        title: "Janpath",
        type: "Market"
    }, {
        position: {
            lat: 28.6353,
            lng: 77.2197
        },
        title: "PVR Plaza",
        type: "Movie Theater"
    }, {
        position: {
            lat: 28.6331,
            lng: 77.1389
        },
        title: "PVR Naraina",
        type: "Movie Theater"
    }, {
        position: {
            lat: 28.6210,
            lng: 77.2182
        },
        title: "Tamra Restaurant",
        type: "Restaurant"
    }, {
        position: {
            lat: 28.5616,
            lng: 77.2688
        },
        title: "Carnatic Cafe",
        type: "Restaurant"
    }, {
        position: {
            lat: 28.6314,
            lng: 77.2274
        },
        title: "Kitty Su",
        type: "Club"
    }, {
        position: {
            lat: 28.6210,
            lng: 77.2179
        },
        title: "Privee",
        type: "Club"
    }, {
        position: {
            lat: 28.6434,
            lng: 77.1778
        },
        title: "Lanterns Kitchen & Bar",
        type: "Bar"
    }, {
        position: {
            lat: 28.6327,
            lng: 77.1990
        },
        title: "Laxminarayan Temple",
        type: "Temple"
    }]);
}

//view model
var viewModel = function() {
    var self = this;
    self.filtered_text = ko.observable("");
    self.locations = model();
    self.temp_locations = ko.observable(model());
    self.titles = self.locations.map(function(location) {
        return location.title;
    });
    self.infoWindowSwitch = false;
    self.markers = [];
    self.infoWindow = new google.maps.InfoWindow();
    self.map;
    self.initMap = function() {
        self.map = new google.maps.Map($('#map')[0], {
            center: new google.maps.LatLng(28.5494, 77.2001),
            zoom: 11
        });
        self.fillMarkersArray();
    };
    // fill marker array with markers
    self.fillMarkersArray = function() {
        self.locations.forEach(function(location) {
            var marker = new google.maps.Marker({
                position: location.position,
                title: location.title,
                animation: google.maps.Animation.DROP
            });
            self.markers.push(marker);
        });
        self.setMarkers();
    };
    //Event Listener
    self.addClickListenerToMarker = function(marker) {
        marker.addListener('click', function() {
            self.setInfoWindow(marker);
            self.setInfoWindowContent(marker);
            self.markers.forEach(function(value) {
                value.setAnimation(null);
            });
            if (self.map.getCenter() == marker.getPosition()) {
                self.map.setCenter(new google.maps.LatLng(28.5494, 77.2001));
                self.closeInfoWindow();
                self.map.setZoom(11)
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                self.map.setCenter(marker.getPosition());
                self.map.setZoom(14);
            }
        });
    }
    //set marker on the map
    self.setMarkers = function() {
        self.markers.forEach(function(marker) {
            marker.setMap(self.map);
            self.addClickListenerToMarker(marker);
        });
    };
    // set info window
    self.setInfoWindow = function(marker) {
        self.infoWindow.open(self.map, marker);
    };
    //close info window
    self.closeInfoWindow = function() {
        self.infoWindow.close();
    };
    //List event listener
    self.listItemClicked = function(data) {
        var d = data
        var position = data.position;
        var marker = (function() {
            for (var i = 0; i < self.markers.length; i++) {
                if (self.markers[i].getPosition().lat() == d.position.lat && self.markers[i].getPosition().lng().toFixed(4) == d.position.lng)
                    return self.markers[i];
            }
        }());
        google.maps.event.trigger(marker, 'click');

    };
    //set info window content
    self.setInfoWindowContent = function(marker) {
        var latlng = {
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng()
        };
        //ajax call to dark sky weather api
        $.ajax({
            url: "https://api.darksky.net/forecast/4315c04d000b476eb80c07affa6200d8/" + latlng.lat + "," + latlng.lng,
            type: 'GET',
            dataType: "jsonp",
            success: function(data) {
                //setting info window content
                var content = "<div style='color:black'> <h2 style='color:red ;text-decoration:underline;padding:2px;font-size:1.5em'>DarkSky Whether Report</h2>" +
                    "<h3 style='color:blue'><b>Title: </b><span  style='color:black'>" + marker.getTitle() + "</span></h3>" +
                    "<h3 style='color:blue'><b>TimeZone: </b><span  style='color:black'>" + data.timezone + "</span></h3>" +
                    "<h3 style='color:blue'><b>Summary: </b><span  style='color:black'>" + data.currently.summary + "</span></h3>" +
                    "<h3 style='color:blue'><b>icon: </b><span  style='color:black'>" + data.currently.icon + "</span></h3>" +
                    "<h3 style='color:blue'><b>Apparent Temperature: </b><span  style='color:black'>" + data.currently.apparentTemperature + "</span></h3>" +
                    "<h3 style='color:blue'><b>Temperature: </b><span  style='color:black'>" + data.currently.temperature + "</span></h3>" +
                    "<h3 style='color:blue'><b>Dew Point: </b><span  style='color:black'>" + data.currently.dewPoint + "</span></h3>" +
                    "<h3 style='color:blue'><b>Humidity: </b><span  style='color:black'>" + data.currently.humidity + "</span></h3>" +
                    "<h3 style='color:blue'><b>Pressure: </b><span  style='color:black'>" + data.currently.pressure + "</span></h3>" +
                    "<h3 style='color:blue'><b>Wind Speed: </b><span  style='color:black'>" + data.currently.windSpeed + "</span></h3>" +
                    "<h3 style='color:blue'><b>Cloud Cover: </b><span  style='color:black'>" + data.currently.cloudCover + "</span></h3>" +
                    "<h3 style='color:blue'><b>Visibility: </b><span  style='color:black'>" + data.currently.visibility + "</span></h3>" +
                    "<h3 style='color:blue'><b>Ozone: </b><span  style='color:black'>" + data.currently.ozone + "</span></h3>" +
                    "<h3 style='color:blue'><b>Wind Bearing: </b><span  style='color:black'>" + data.currently.windBearing + "</span></h3>"

                self.infoWindow.setContent(content);
            },
            error: function(e) {
                alert("Error in loading data from dark sky!! please try again later");
            }
        });

    };
    //filter
    self.filter = function() {
        var text = self.filtered_text();
        var new_positions = [];
        var new_temp_locations = [];
        if (text !== "") {
            for (var i = 0; i < self.locations.length; i++) {
                if (self.locations[i].type.toLowerCase().replace(" ", "") === text.toLowerCase().replace(" ", "")) {
                    new_positions.push(self.locations[i].position);
                    new_temp_locations.push(self.locations[i]);
                }
            }
            var markers = [];

            for (i = 0; i < self.markers.length; i++) {
                for (var j = 0; j < new_positions.length; j++) {
                    if (self.markers[i].getPosition().lat().toFixed(4) === new_positions[j].lat.toFixed(4) && self.markers[i].getPosition().lng().toFixed(4) === new_positions[j].lng.toFixed(4)) {
                        markers.push(self.markers[i]);
                    }
                }
            }
            if (markers.length === 0)
                alert("NO Match Found");
            self.markers.forEach(function(value) {
                value.setMap(null);
            });
            markers.forEach(function(value) {
                value.setMap(self.map);
            });
            self.temp_locations(new_temp_locations);

        } else {
            self.showAllMarkers();
        }

    };
    //showing all markers to the map
    self.showAllMarkers = ko.computed(function() {
        if (self.filtered_text() === "") {
            self.markers.forEach(function(value) {
                value.setMap(self.map);
            });
            self.temp_locations(model());
        }
    });
    self.initMap();

};
//dealing with error
self.error = function() {

    alert("Unable to load data!! please try again later");
}
//running the app
function run() {
    ko.applyBindings(new viewModel());
}