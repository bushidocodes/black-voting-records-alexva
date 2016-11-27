/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var map = __webpack_require__(1);
	
	// Use jQuery selectors to save the selector tabs that we'll append things to
	var $hotelChoices = $('#hotel-choices');
	var $restaurantChoices = $('#restaurant-choices');
	var $activityChoices = $('#activity-choices');
	
	var $hotelAdd = $('#hotel-add');
	var $restaurantAdd = $('#restaurant-add');
	var $activityAdd = $('#activity-add');
	
	
	// Loop through the hotels, restaurants, and activities arrays and append each item as an option tag
	hotels.forEach((hotel) => {
	    $hotelChoices.append("<option>" + hotel.name + "</option>");
	});
	
	restaurants.forEach((restaurant) => {
	    $restaurantChoices.append("<option>" + restaurant.name + "</option>");
	});
	
	activities.forEach((activity) => {
	    $activityChoices.append("<option>" + activity.name + "</option>");
	});
	
	$hotelAdd.on("click", function () {
	    //Step 1: Use JQuery to select parent element, myHotel
	    var $hotelList = $('#hotel-list');
	
	    if ($hotelList.children().length <= 1) {
	        //Step 2:
	        $hotelList.append('<div class="itinerary-item">' +
	            '<span class="title">' + $hotelChoices.val() + '</span>' +
	            '<button class="btn btn-xs btn-danger remove btn-circle">x</button>' +
	            '</div>');
	
	        $hotelList.children().last().on('click', '.remove', function () {
	            let currentMarkerIndex = $(this).parent().data("markerIndex");
	            map.markers[currentMarkerIndex].setMap(null);
	            $(this).parent().remove();
	        })
	
	        let selectedHotel = hotels.find((hotel) => {
	            // console.log("Comparing ", hotel.name, " to ", $hotelChoices.val());
	            return (hotel.name === $hotelChoices.val()) ? true : false;
	        });
	
	        if (selectedHotel) {
	            let marker = map.drawMarker('hotel', selectedHotel.place.location);
	            map.markers.push(marker);
	            let markerIndex = map.markers.length - 1;  // <
	            $hotelList.children().last().data("markerIndex", markerIndex);
	            // bounds.extend(newMarker.position),
	            // map.fitBounds(bounds)
	            // console.log(selectedHotel.place.location);
	        } else {
	            console.log("Error finding hotel");
	        }
	
	
	
	
	
	    }
	});
	
	
	
	
	$restaurantAdd.on("click", function () {
	    //Step 1: Use JQuery to select parent element, myRestaurant
	    var $restaurantList = $('#restaurant-list');
	
	    if ($restaurantList.children().length <= 3) {
	        //Step 2:
	        $restaurantList.append('<div class="itinerary-item">' +
	            '<span class="title">' + $restaurantChoices.val() + '</span>' +
	            '<button class="btn btn-xs btn-danger remove btn-circle">x</button>' +
	            '</div>');
	
	        $restaurantList.children().last().on('click', '.remove', function () {
	            let currentMarkerIndex = $(this).parent().data("markerIndex");
	            map.markers[currentMarkerIndex].setMap(null);
	            $(this).parent().remove();
	        })
	
	        let selectedRestaurant = restaurants.find((restaurant) => {
	            return (restaurant.name === $restaurantChoices.val()) ? true : false;
	        });
	
	        if (selectedRestaurant) {
	            let marker = map.drawMarker('restaurant', selectedRestaurant.place.location);
	            map.markers.push(marker);
	            let markerIndex = map.markers.length - 1;  // <
	            $restaurantList.children().last().data("markerIndex", markerIndex);
	        } else {
	            console.log("Error finding restaurant");
	        }
	    }
	});
	
	$activityAdd.on("click", function () {
	    //Step 1: Use JQuery to select parent element, myRestaurant
	    var $activityList = $('#activity-list');
	    //Step 2:
	    $activityList.append('<div class="itinerary-item">' +
	        '<span class="title">' + $activityChoices.val() + '</span>' +
	        '<button class="btn btn-xs btn-danger remove btn-circle">x</button>' +
	        '</div>');
	    $activityList.children().last().on('click', '.remove', function () {
	        let currentMarkerIndex = $(this).parent().data("markerIndex");
	        map.markers[currentMarkerIndex].setMap(null);
	        $(this).parent().remove();
	    })
	    let selectedActivity = activities.find((activity) => {
	        return (activity.name === $activityChoices.val()) ? true : false;
	    });
	    if (selectedActivity) {
	        var marker = map.drawMarker('activity', selectedActivity.place.location);
	        map.markers.push(marker);
	        let markerIndex = map.markers.length - 1;
	        $activityList.children().last().data("markerIndex", markerIndex);
	    } else {
	        console.log("Error finding activity");
	    }
	});
	
	
	


/***/ },
/* 1 */
/***/ function(module, exports) {

	var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);
	
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
	  zoom: 13,
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
	  var iconURL = iconURLs[type];
	  var marker = new google.maps.Marker({
	    icon: iconURL,
	    position: latLng
	  });
	  marker.setMap(currentMap);
	
	  return marker;
	};
	
	//  drawMarker('hotel', [40.705137, -74.007624]);
	//  drawMarker('restaurant', [40.705137, -74.013940]);
	//  drawMarker('activity', [40.716291, -73.995315]);
	
	module.exports = {
	  fullstackAcademy: fullstackAcademy,
	  markers: markers,
	  styleArr: styleArr,
	  mapCanvas: mapCanvas,
	  currentMap: currentMap,
	  iconURLs: iconURLs,
	  drawMarker: drawMarker
	};

/***/ }
/******/ ]);
//# sourceMappingURL=tripplanner.js.map