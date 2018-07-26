var mymap = L.map('mapid').setView([23.648235, -102.747675], 5.4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoib21hci1uYXZhcnJvIiwiYSI6ImNpanN2ZWZxZzBoa291eWx4ZWdsajl1OGIifQ.SH4OG9811nirTGJ3rE4DHw'
}).addTo(mymap);

function choroplethize(d) {
    return d > 162 ? '#034e7b' :
        d > 80 ? '#0570b0' :
            d > 54 ? '#3690c0' :
                d > 24 ? '#74a9cf' :
                 d > 11 ? '#a6bddb' :
                       d > 5 ? '#d0d1e6' :
                        <!-- if values are null keep transparent-->
                        '#f1eef6';
}
function styleSecuestros(feature) {
    return {
        weight: .75,
        opacity: 0.5,
        color: 'grey',
        dashArray: '0',
        fillOpacity: 0.9,
        fillColor: choroplethize(feature.properties._Total)
    }
}
//

// function label(feature, layer){
//     if(feature.properties.refactor_4 != null){
//         layer.bindTooltip(feature.properties.refactor_4 + ' per 100,000',{direction: 'center'},{permanent: true},{opacity: .1});
//         layer.bindPopup('Country:   ' + feature.properties.SOVEREIGNT + '<br>Total Homicides:   '+ feature.properties.refactor_3 + '<br>Homicide Rate:   '+ feature.properties.refactor_4 + ' per 100,000')
//     }
// }
var Secuestros2015Layer = L.geoJSON([secuestros2015], {
    style: styleSecuestros,
     onEachFeature: geojsonPopup,
    pointToLayer: function (feature, latlng){
        return L.marker(latlng);
    }
});

function geojsonPopup(feature, layer){
    if(feature.properties.NOMGEO != null){
        layer.bindPopup('Estado:   ' + feature.properties.NOMGEO + '<br>Secuestros en 2015:   '+ feature.properties._Total);
    }
}

Secuestros2015Layer.addTo(mymap);
var featureLayers = {
    "2015 Secuestros": Secuestros2015Layer
//    "2017 January Zoning": Zoning2017Layer
};
var geojson = L.control.layers(featureLayers).addTo(mymap);

// LEGEND STARTS HERE
var SecuestrosParcelLegend = L.control({position: 'bottomright'});

SecuestrosParcelLegend.onAdd = function (mymap) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 11, 24, 80, 162],
        labels = ['Suma de Secuestros 2015 <br> por estado'],
        from, to;
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            '<i style="background' + choroplethize(from + 1) + '"></i> ' +
            from + (to ? ' - ' + to : ' +'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

SecuestrosParcelLegend.addTo(mymap);
currentLegend = SecuestrosParcelLegend;
mymap.on('overlayadd', function (eventLayer) {
    if  (eventLayer.name === '2015 Secuestros') {
        mymap.removeControl(currentLegend);
        currentLegend = SecuestrosParcelLegend;
        SecuestrosParcelLegend.addTo(mymap);
    }
    // else if  (eventLayer.name === '2000 Census Population') {
    //     map.removeControl(currentLegend);
    //     currentLegend = Population2000Legend;
    //     Population2000Legend.addTo(map);
    // }
});
// LEGEND ENDS HERE