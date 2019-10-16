// Store the API endpoint inside earthquakeURL
const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(earthquakeURL).then(response => {
  // Once we get a response, send the response.features object to the createFeatures function
  console.log(response.features);
  createFeatures(response.features);
});


// Define a function we want to run once for each feature in the features array
function createFeatures(earthquakeData) {

 
    // Give each feature a circle marker
    function pointToLayer(feature, latlng) {
        //  Style for each feature 
        return L.circleMarker(latlng, {
        fillOpacity: .5,
        opacity: 1,
        weight: 2,
        color: colorize(feature.properties.mag),
        fillColor: colorize(feature.properties.mag),
        radius: quakeSize(feature.properties.mag)
        });
    }
    // Give each feature a popup describing the place, time, and magnitude of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h2><center>Location: "+ feature.properties.place +"</center></h2><hr><h2><center>Magnitude: " + feature.properties.mag
        + "</center></h2><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

  // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap, outdooes, and darkmap layers
    const streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: attribution,
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    const outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: attribution,
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });
    
    const dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: attribution,
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
        "Street Map": streets,
        "Outdoors": outdoors,
        "Dark Map": dark
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 3,
        layers: [streets, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create legend and add to map
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'legend'),
          grades = [0,1,2,3,4,5],
          labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

        for (var i = 0; i < grades.length; i++)
        {
        div.innerHTML +=
            '<i style="background:' + colorize(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        console.log('div' + div);
        return div;
    };
    legend.addTo(myMap); 
}

// Function to adjust marker size 
function quakeSize(magnitude) {
    return magnitude * 5;
}
// Function to adjust color of markers 
function colorize(magnitude){
    var color;
        if (magnitude >= 5) {
        color = "red" ; 
        }
        else if (magnitude >= 4) {
        color = "orange";
        }
        else if (magnitude >= 3) {
        color = "yellow";
        }
        else if (magnitude >= 2) {
        color = "green";
        }
        else if (magnitude >= 1) {
        color = "yellowgreen";
        }
        else {
        color = "greenyellow";
        }
    return color;
    } 