$(document).ready(function() {

  var score1;
  var score2;
  var score3;
  var score4;
  var score5;
  var commentField = $('#commentField');
  var address = $('#review-address');
  var user = $('#user');
  var reviewForm = $('.review-form');
  var reviewBtn = $('#reviewBtn');
  var reviewCatagories = ['Neighborhood', 'Cleanliness', 'Management Response', 'Up to Date', 'Noise'];


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
        });
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
          scaledSize: new google.maps.Size(55, 55)
        }
      });

      google.maps.event.addListener(marker, 'click', function() {
        console.log(marker.place.placeId);
        getDataID(marker.place.placeId, 'building');
        reviewBtn.removeClass('hidden');
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

  function pageBuildingRender(building) {
    // console.log(building);

    var reviewAddress = $('#review-address');
    var reviewData = $('.review-data');

    reviewAddress.html(building.address);
    reviewAddress.attr('data-placeId', building.place_id);

    var scoreList = [];
    scoreList[0] = 0;
    scoreList[1] = 0;
    scoreList[2] = 0;
    scoreList[3] = 0;
    scoreList[4] = 0;


    if (building.Reviews.length > 0) {
      var scoresDiv = $('<div>');
      var scoresTable = $('<table>');
      var tableHead = $('<thead>');
      var tableRow = $('<tr>');
      scoresTable.addClass('table');
      // scoresTable.addClass('table-bordered')

      // tableRow.append('<th>Catagory</th>');
      // tableRow.append('<th>Score</th>');
      tableHead.append(tableRow);
      scoresTable.append(tableHead);

      for (var i = 0; i < building.Reviews.length; i++) {
        var scores = JSON.parse(building.Reviews[i].scores);
        scoreList[0] += scores[0];
        scoreList[1] += scores[1];
        scoreList[2] += scores[2];
        scoreList[3] += scores[3];
        scoreList[4] += scores[4];
      }

      for (var i = 0; i < scoreList.length; i++) {
        scoreList[i] = scoreList[i] / building.Reviews.length;
        var scoreRow = $('<div>');
        var currentPercentage = scoreList[i]*20;

        scoreRow.addClass('score-container').append('<span class="category-name">' + reviewCatagories[i] + ': </span><span class="score-explained">'+parseFloat(scoreList[i]).toFixed(1)+'</span>');
        scoresTable.append(scoreRow);

        scoreRow.append('<div class="cat-score cat-score-'+scoreList[i]+'" data-score="'+scoreList[i]+'"><div class="cat-score-inner" style="width:'+currentPercentage+'%;"></div></div>');
        scoresTable.append(scoreRow);

      }
      scoresDiv.append(scoresTable)
      reviewData.html(scoresDiv);

      reviewData.append('<p><strong>Comments: </strong></p>');

      for (var i = 0; i < building.Reviews.length; i++) {
        reviewData.append('<p>'+building.Reviews[i].comment+'</p>');
      }
    } else {
      reviewData.html('No reviews yet, be the first one to review.');
    }


  }

  $("input:radio[name=score1]").click(function() {
    score1 = parseInt($(this).val());
  });

  $("input:radio[name=score2]").click(function() {
    score2 = parseInt($(this).val());
  });

  $("input:radio[name=score3]").click(function() {
    score3 = parseInt($(this).val());
  });
  $("input:radio[name=score4]").click(function() {
    score4 = parseInt($(this).val());
  });
  $("input:radio[name=score5]").click(function() {
    score5 = parseInt($(this).val());
  });

  $('#review-submit').on('click', function(event) {
    event.preventDefault();
    var addressId = address.data('placeid');
    var userId = user.data('id');
    // console.log(score1, score2, score3, score4, score5);
    // console.log('USER ID: ' + userId);
    // console.log('ADDRESS ID: ' + addressId);
    // console.log(commentField.val());
    if (score1 && score2 && score3 && score4 && score5) {
      var temp = [score1, score2, score3, score4, score5]
      var reviewScores = JSON.stringify(temp);
      $.ajax({
        method: 'POST',
        url: '/api/review/',
        data: {
          UserFbId: userId,
          BuildingPlaceId: addressId,
          comment: commentField.val(),
          scores: reviewScores
        }
      }).done(function(review) {
        getDataID(address.data('placeid'), 'building');
        reviewForm.addClass('hidden');
        reviewBtn.removeClass('hidden');
        window.location.reload();
      });
    } else {
      $('#error').modal('toggle');
      reviewBtn.removeClass('hidden');
    }
  });

  reviewBtn.on('click', function() {
    // reviewBtn.addClass('hidden');
    $('#reviewForm').modal('toggle');
  });

  $('#logout').on('click', logout);

  function logout() {
    console.log('Logging Out ');
    document.cookie = 'connect.sid=; expires=Thu, 01-Jan-70 00:00:01 GMT; Path=/';
  }

});
