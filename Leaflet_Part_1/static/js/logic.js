
  

      // Get GeoJson data for earthquakes within the last 7 days
      let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

      d3.json(url).then(function(response) {
        createMarkers(response.features);
        
          });
        
        // Create a function to determine the radius of the circle marker based on the magnitude of the earthquake  
        function getColor(depth) {
          switch (true) {
            case depth > 90:
              return "Red";
            case depth > 70:
              return "pink";
            case depth > 50:
              return "orange";
            case depth > 30:
              return "yellow";
            case depth > 10:
              return "green";
            default:
              return "lightgreen";
          }
        };

        function getRadius(magnitude) {
          if (magnitude === 0) {
            return 1;
          } else {
            return magnitude * 3;
          }
        }

        function createMarkers(mapdata) {
          function onEachFeature(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
            }

        // Create a GeoJSON layer containing the features array on the earthquakeData object
        let mapping = L.geoJSON(mapdata, {
          onEachFeature: onEachFeature,
            pointToLayer: function(feature, latlng) {
                let geojsonMarkerOptions = {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: "black",
                    weight: 0.5,
                    opacity: 0.5,
                    fillOpacity: 0.8          
          }
            return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        });
        createMapWithLayer(mapping);
        }
      
    
    

    function createMapWithLayer(mapping) {
      // Add a tile layer (the background map image) from MapBox
      let grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnN0ZXZlbnMzMTgiLCJhIjoiY2xpaTJqM2ZpMHZ3eTNmbXE4YjFtdjVqZyJ9.hT8YYeWHPYyqgqlwsUUZMA', {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        style: 'mapbox/light-v11',
      });

      let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [mapping, grayscale]
      });

  

      // Create a legend control element
      let legend = L.control({ position: "bottomright" });

      // add legend to the map
      legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend"),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];


    // create a legend title
     let legendTitle = '<h4>Earthquake Depth</h4>';
     div.innerHTML += legendTitle;

    // loop through depths and generate labels with colored squares
    for (let i = 0; i < depths.length; i++) {
        
        labels.push(
            '<span class="legend-square" style="background-color: ' + getColor(depths[i] + 1) + '"></span> ' + depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+"));
    }     
    div.innerHTML += '<ul>' + labels.join('') + '</ul>';
    
    div.classList.add("legend-style");
    return div;
};
legend.addTo(myMap);
      }