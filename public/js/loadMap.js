var fullstackAcademy = new google.maps.LatLng(38.81, -77.05);

var markers = [];

var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
}, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
}, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
}, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
}, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
}, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
}, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
}, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
}];

var mapCanvas = document.getElementById('map-canvas');

var currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
});

var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
};

function drawMarker(type, coords) {
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    // var iconURL = iconURLs[type];
    var iconURL = google.maps.SymbolPath.CIRCLE;
    var marker = new google.maps.Marker({
        icon: iconURL,
        position: latLng
    });
    marker.setMap(currentMap);

    return marker;
};


//
$.ajax({
    url: "http://localhost:8080/json",
    dataType: "json"
}).done(function (results) {
    results.forEach((record) => {
        console.log(record);
        if (record.latLng) {
            let marker = drawMarker('restaurant', [record.latLng.lat, record.latLng.lng]);
            let contentString = `<h1>Name: ${record.firstname} ${record.lastname}</h1>`+
            `<h4>Birthdate: ${record.birthdate}</h4>`+
            `<h4>Occupation: ${record.occupation}</h4>`+
            `<h4>Address: ${record.address}</h4>`;
            let infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            marker.addListener('click', function () {
                console.log("cleek");
                infowindow.open(currentMap, marker);
            });
        }



    })
    return results;
});
//   console.log(records);