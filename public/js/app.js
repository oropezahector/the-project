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

    infowindow = new google.maps.InfoWindow({
      content: document.getElementById('form')
    });

    messagewindow = new google.maps.InfoWindow({
      content: document.getElementById('message')
    });


    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

        newPlaceMarker(place);

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  function newPlaceMarker(place) {
    var placesService = new google.maps.places.PlacesService(map);
    console.log(place.place_id);

    placesService.getDetails({
      placeId: place.place_id
    }, function(result, status) {

      var marker = new google.maps.Marker({
        map: map,
        place: {
          placeId: place.place_id,
          location: result.geometry.location
        },
        label: '💩'
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });
    });
  }


  GoogleMapsLoader.onLoad(function(google) {
    // console.log('I just loaded google maps api');
    navigator.geolocation.getCurrentPosition(initMap);
  });

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
      if (data) {
        console.log(data);
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
      window.location.href = "/";
    } else {
      console.log(data);

    }
  }



});
