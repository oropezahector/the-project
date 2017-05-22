$(document).ready(function() {


  // initaialize Google Maps
  function initMap(position) {
    var userLatLong = { lat: position.coords.latitude, lng: position.coords.longitude };
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: userLatLong
    });
    var marker = new google.maps.Marker({
      position: userLatLong,
      map: map
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
