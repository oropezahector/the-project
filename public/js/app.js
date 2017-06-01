$(document).ready(function() {


  // initaialize Google Maps

  var map;
  var marker;
  var infowindow;
  var messagewindow;


  function initMap(position) {
    var geocoder = new google.maps.Geocoder;
    var userLatLong = { lat: position.coords.latitude, lng: position.coords.longitude };
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: userLatLong
    });

    messagewindow = new google.maps.InfoWindow({
      content: document.getElementById('message')
    });


    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      var bounds = new google.maps.LatLngBounds();

      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        checkPlace(place);

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });


    // Map Legend creation
    var legend = document.getElementById('legend');
    var icons = {
      badPlace: {
        name: 'Poor Score',
        icon: {
          url: '/images/mr-poopy-one.png',
          width: '50px'
        }
      },
      goodPlace: {
        name: 'Good Score',
        icon: {
          url: '/images/mr-poopy-one.png',
          width: '50px'
        }
      }
    };
    for (var key in icons) {
      var type = icons[key];
      var name = type.name;
      var icon = type.icon;
      var div = document.createElement('div');
      div.innerHTML = name + '<img src="' + icon.url + '" width=' + icon.width + '> ';
      legend.appendChild(div);
    }

    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);

    // Invokes getBuildings, filling in markers for each Buidling database entry
    getBuildings();
  }


  // Checks address searches from the search box against the database, if the record doesn't exits, it POSTs it to the DB.
  function checkPlace(place) {
    // console.log(place.rating);
    $.ajax({
      method: 'GET',
      url: '/api/building/' + place.place_id
    }).done(function(buildings) {
      if (buildings) {
        // console.log(buildings);
        infowindow = new google.maps.InfoWindow({
          content: buildings.place_id
        });
        newPlaceMarker(place);
        return
      } else {
        $.ajax({
          method: 'POST',
          url: '/api/building/',
          data: {
            address: place.formatted_address,
            place_id: place.place_id
          }
        }).done(function(buildings) {
          newPlaceMarker(place);
        })
      }
    });
  }

  // Adds Markers to the map.
  function newPlaceMarker(place) {
    var placesService = new google.maps.places.PlacesService(map);
    // console.log(place.rating);

    placesService.getDetails({
      placeId: place.place_id
    }, function(result, status) {
      // console.log(result.geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        place: {
          placeId: place.place_id,
          location: result.geometry.location
        },
        // label: '💩',
        icon: {
          url: '/images/mr-poopy-one.png',
          scaledSize: new google.maps.Size(30, 30)
        }
      });

      google.maps.event.addListener(marker, 'click', function() {
        console.log(marker.place.placeId);
        getDataID(marker.place.placeId, 'building');
      });
    });

  }

  // When the Google API is loaded, it grabs the current position from the browswer and initializes the map
  GoogleMapsLoader.onLoad(function(google) {
    // console.log('I just loaded google maps api');
    navigator.geolocation.getCurrentPosition(initMap);
  });

  // Loads the Google Maps API
  GoogleMapsLoader.load();


  // API call functions
  function getDataID(id, type) {
    var queryUrl;
    switch (type) {
      case "user":
        queryUrl = "/api/user/" + id;
        break;
      case "building":
        queryUrl = "/api/building/" + id;
        break;
      case "review":
        queryUrl = "/api/review/" + id;
        break;
      default:
        return;
    }
    $.get(queryUrl, function(data) {
      switch (type) {
        case "user":
          pageUserRender(data);
          break;
        case "building":
          pageBuildingRender(data);
          break;
        case "review":
          pageReviewRender(data);
          break;
        default:
          return;
      }
    });
  }

  function getUsers() {
    $.get("/api/user", renderUserList);
  }

  function renderUserList(data) {
    if (!data.length) {
      window.location.href = "/";
    } else {
      console.log(data);
    }
  }

  function getBuildings() {
    $.get("/api/building", renderBuildings);
  }

  function renderBuildings(data) {
    if (!data.length) {
      return;
    } else {
      data.forEach(function(building) {
        newPlaceMarker(building);
      });
    }
  }

  function pageUserRender(users) {

  }

  function pageBuildingRender(building) {
    console.log(building);

    var reviewAddress = $('#review-address');
    var reviewData = $('.review-data');

    reviewAddress.html(building.address);

    var scoreList = [];
    scoreList[0] = 0;
    scoreList[1] = 0;
    scoreList[2] = 0;
    scoreList[3] = 0;
    scoreList[4] = 0;


    if (building.Reviews.length > 0) {
      var scoresDiv = $('<div>');
      for (var i = 0; i < building.Reviews.length; i++) {
        var scores = JSON.parse(building.Reviews[i].scores);
        scoreList[0] += scores[0];
        scoreList[1] += scores[1];
        scoreList[2] += scores[2];
        scoreList[3] += scores[3];
        scoreList[4] += scores[4];
      }
      for (var i = 0; i < scoreList.length; i++) {
        scoreList[i] = scoreList[i]/building.Reviews.length;
        scoresDiv.append('<p>'+scoreList[i]+'</p>');
      }
      reviewData.html(scoresDiv);
    } else {
      reviewData.html('No Scores Posted');
    }


  }


  function pageReviewRender(review) {

  }

  $('#logout').on('click', logout);

  function logout() {
    console.log('Logging Out ');
    document.cookie = 'connect.sid=; expires=Thu, 01-Jan-70 00:00:01 GMT; Path=/';
  }

});
