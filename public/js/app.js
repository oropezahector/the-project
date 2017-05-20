$(document).ready(function() {


  function getDataID(id, type) {
    var queryUrl;
    switch (type) {
      case "user":
        queryUrl = "/api/users/" + id;
        break;
      case "building":
        queryUrl = "/api/buildings/" + id;
        break;
      default:
        return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.UserID || data.id)
        userId = data.UserID || data.id;
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
