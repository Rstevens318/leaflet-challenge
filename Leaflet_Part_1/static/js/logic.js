
// Create a map object for the United States
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
    });

// Add a tile layer (the background map image) to our map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// Get GeoJson data for earthquakes within the last 7 days
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(response) {
    function createMarkers(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "black",
            weight: 0.5,
            opacity: 0.5,
            fillOpacity: 0.8
        });
 
    }
    function getColor(depth) {
        if (depth > 90) {
            return "#ff0000";
        }
        else if (depth > 70) {
            return "#ff6600";
        }
        else if (depth > 50) {
            return "#ff9900";
        }
        else if (depth > 30) {
            return "#ffcc00";
        }
        else if (depth > 10) {
            return "#ffff00";
        }
        else {
            return "#ccff00";
        }
    }

    // Create a function to determine the radius of the circle marker based on the magnitude of the earthquake
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        else {
            return magnitude * 3;
        }
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    L.geoJSON(response, {
        pointToLayer: createMarkers,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
        }
}).addTo(myMap);




// Create a legend control element
let legend = L.control({ position: "bottomright" });

// add legend to the map
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90];


    // create a legend title
     let legendTitle = '<h4>Earthquake Depth</h4>';
     div.innerHTML += legendTitle;

    // loop through depths and generate labels with colored squares
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');   
    }
    div.style.backgroundColor = '#fff';
    div.style.border = '2px solid #ccc';
    div.style.borderRadius = '5px';
    div.style.padding = '10px';
    div.style.boxShadow = '3px 3px 3px #999';
    div.style.fontSize = '12px';
    div.style.lineHeight = '18px';
    div.style.color = "#002366";
    return div;
};

// add legend to the map object
legend.addTo(myMap);
 


});