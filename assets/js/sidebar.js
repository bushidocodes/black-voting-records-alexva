var map = require('./map.js');

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



