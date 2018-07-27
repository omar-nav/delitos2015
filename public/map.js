var mymap = L.map('mapid').setView([19.5, -102.747675], 5.4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoib21hci1uYXZhcnJvIiwiYSI6ImNpanN2ZWZxZzBoa291eWx4ZWdsajl1OGIifQ.SH4OG9811nirTGJ3rE4DHw'
}).addTo(mymap);

// COLORES
function choroplethize(d) {
    return d > 162 ? '#b10026' :
        d > 80 ? '#e31a1c' :
            d > 54 ? '#fc4e2a' :
                d > 24 ? '#fd8d3c' :
                 d > 11 ? '#feb24c' :
                       d > 5 ? '#fed976' :
                        '#ffffb2';
}
function colorearGraduadoAbortos(d) {
    return d > 58 ? '#980043' :
        d > 25 ? '#dd1c77' :
            d > 15 ? '#df65b0' :
                d > 6 ? '#d7b5d8' :
                    '#f1eef6';
}
function colorearGraduadoAbusoDeConfianza2015(d) {
    return d > 1480 ? '#980043' :
        d > 917 ? '#dd1c77' :
            d > 535 ? '#df65b0' :
                d > 243 ? '#d7b5d8' :
                    '#f1eef6';
}
function colorearGraduadoAbusoSexual2015(d) {
    return d > 1247 ? '#980043' :
        d > 446 ? '#dd1c77' :
            d > 311 ? '#df65b0' :
                d > 93 ? '#d7b5d8' :
                    '#f1eef6';
}

// PINTAR LAS FIGURAS CON LOS COLORES
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

function estilizarAbortos(feature) {
    return {
        weight: .75,
        opacity: 0.5,
        color: 'grey',
        dashArray: '0',
        fillOpacity: 0.9,
        fillColor: colorearGraduadoAbortos(feature.properties.abortos)
    }
}
function estilizarAbusoDeConfizana2015(feature) {
    return {
        weight: .75,
        opacity: 0.5,
        color: 'grey',
        dashArray: '0',
        fillOpacity: 0.9,
        fillColor: colorearGraduadoAbusoDeConfianza2015(feature.properties.abuso2015)
    }
}
function estilizarAbusoSexual2015(feature) {
    return {
        weight: .75,
        opacity: 0.5,
        color: 'grey',
        dashArray: '0',
        fillOpacity: 0.9,
        fillColor: colorearGraduadoAbusoSexual2015(feature.properties.abusoSexua)
    }
}

// CREAR VARIABLES PARA LAS CAPAS
var Secuestros2015Layer = L.geoJSON([secuestros2015], {
    style: styleSecuestros,
    onEachFeature: geojsonPopup,
    pointToLayer: function (feature, latlng){
        return L.marker(latlng);
    }
});
var Abortos2015Layer = L.geoJSON([abortos2015], {
    style: estilizarAbortos,
    onEachFeature: geojsonPopupAbortos,
    pointToLayer: function (feature, latlng){
        return L.marker(latlng);
    }
});
var AbusosDeConfianza2015Layer = L.geoJSON([abusoDeConfianza2015], {
    style: estilizarAbusoDeConfizana2015,
    onEachFeature: geojsonPopupAbusoDeConfianza2015,
    pointToLayer: function (feature, latlng){
        return L.marker(latlng);
    }
});
var AbusosSexuales2015Layer = L.geoJSON([abusoSexual2015], {
    style: estilizarAbusoSexual2015,
    onEachFeature: geojsonPopupAbusoSexual2015,
    pointToLayer: function (feature, latlng){
        return L.marker(latlng);
    }
});

// CREAR CAJAS AL MOMENTO DE HACER CLIC
function geojsonPopup(feature, layer){
    if(feature.properties.NOMGEO != null){
        layer.bindPopup('Estado:   ' + feature.properties.NOMGEO + '<br>Secuestros en 2015:   '+ feature.properties._Total);
    }
}
function geojsonPopupAbortos(feature, layer){
    if(feature.properties.NOMGEO != null){
        layer.bindPopup('Estado:   ' + feature.properties.NOMGEO + '<br>Abortos en 2015:   '+ feature.properties.abortos);
    }
}
function geojsonPopupAbusoDeConfianza2015(feature, layer){
    if(feature.properties.NOMGEO != null){
        layer.bindPopup('Estado:   ' + feature.properties.NOMGEO + '<br>Abusos de confianza en 2015:   '+ feature.properties.abuso2015);
    }
}
function geojsonPopupAbusoSexual2015(feature, layer){
    if(feature.properties.NOMGEO != null){
        layer.bindPopup('Estado:   ' + feature.properties.NOMGEO + '<br>Abusos sexuales en 2015:   '+ feature.properties.abusoSexua);
    }
}
Secuestros2015Layer.addTo(mymap);
var featureLayers = {
    "Secuestros 2015": Secuestros2015Layer,
    "Abortos 2015": Abortos2015Layer,
    "Abusos de confianza 2015": AbusosDeConfianza2015Layer,
    "Abusos sexuales 2015": AbusosSexuales2015Layer
};
var geojson = L.control.layers(featureLayers,null,{
    collapsed: false
}).addTo(mymap);

// LEGEND STARTS HERE
var Secuestros2015Legend = L.control({position: 'bottomright'});
var Abortos2015Legend = L.control({position: 'bottomright'});
var AbusosdeConfianza2015Legend = L.control({position: 'bottomright'});
var AbusosSexuales2015Legend = L.control({position: 'bottomright'});

Secuestros2015Legend.onAdd = function (mymap) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,5,11,24,54,80,162],
        labels = ['Secuestros por estado'],
        from, to;
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            '<i style="background:' + choroplethize(from + 1) + '"></i> ' +
            from + (to ? ' a ' + to : ' o más'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};
Abortos2015Legend.onAdd = function (mymap) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,6,15,25,58],
        labels = ['Abortos por estado'],
        from, to;
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            '<i style="background:' + colorearGraduadoAbortos(from + 1) + '"></i> ' +
            from + (to ? ' a ' + to : ' o más'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};
AbusosdeConfianza2015Legend.onAdd = function (mymap) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,243,535,917,1480],
        labels = ['Abusos de confianza por estado'],
        from, to;
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            '<i style="background:' + colorearGraduadoAbusoDeConfianza2015(from + 1) + '"></i> ' +
            from + (to ? ' a ' + to : ' o más'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};
AbusosSexuales2015Legend.onAdd = function (mymap) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,93,311,446,1247],
        labels = ['Abusos sexuales por estado'],
        from, to;
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            '<i style="background:' + colorearGraduadoAbusoSexual2015(from + 1) + '"></i> ' +
            from + (to ? ' a ' + to : ' o más'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

Secuestros2015Legend.addTo(mymap);
let currentLegend = Secuestros2015Legend;

mymap.on('baselayerchange', function (eventLayer) {
    if  (eventLayer.name === 'Secuestros 2015') {
        mymap.removeControl(currentLegend);
        currentLegend = Secuestros2015Legend;
        Secuestros2015Legend.addTo(mymap);
    }
    else if  (eventLayer.name === 'Abortos 2015') {
        mymap.removeControl(currentLegend);
        currentLegend = Abortos2015Legend;
        Abortos2015Legend.addTo(mymap);
    }
    else if  (eventLayer.name === 'Abusos de confianza 2015') {
        mymap.removeControl(currentLegend);
        currentLegend = AbusosdeConfianza2015Legend;
        AbusosdeConfianza2015Legend.addTo(mymap);
    }
    else if  (eventLayer.name === 'Abusos sexuales 2015') {
        mymap.removeControl(currentLegend);
        currentLegend = AbusosSexuales2015Legend;
        AbusosSexuales2015Legend.addTo(mymap);
    }
});
// LEGEND ENDS HERE