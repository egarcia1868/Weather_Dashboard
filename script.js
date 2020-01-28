var searchedCitiesAr = [];
$("#city").submit(function(event){
  event.preventDefault();
  var match = false;
  for (var i = 0; i < searchedCitiesAr.length; i++) {
    if ($("#cityName").val().trim() === searchedCitiesAr[i]) {
      match = true;
    }
  };
  // This makes sure not to make a duplicate li
  if (!match) {
      var recSearchedCity = $("<li>");
      recSearchedCity.addClass("prevCity");
      recSearchedCity.attr("data-name", $("#cityName").val().trim());
      recSearchedCity.text($("#cityName").val().trim());
      $("#searchedCities").prepend(recSearchedCity);
      searchedCitiesAr.push($("#cityName").val().trim());
  };

  var query = $("#cityName").val().trim();
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${query}&appid=c3da05bca4528c3489ab056a709792c2`;
  var uv;
  var uvClass;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var temp = Math.round(response.main.temp);
    var wind = Math.round(response.wind.speed);
    $("#currentCityName").html(`${response.name} <span id="currentDate"></span> <span id="weather"></span>`);
    $("#currentDate").html(moment().format("(M/D/YYYY)"));
    $("#weather").html(`<img id="weather" src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png" alt="${response.weather[0].description}">`);
    $("#temp").text(`${temp}°F`);
    $("#humid").text(`${response.main.humidity}%`);
    $("#wind").text(`${wind} MPH`);
    // Here I call a new api for uv info
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=c3da05bca4528c3489ab056a709792c2`,
      method: "GET"
    }).then(function(uvResponse) {
      uv = uvResponse.value;
      if (uv < 3) {
        $("#uv").addClass("uvLow")
      } else if (uv < 6) {
        $("#uv").addClass("uvModerate")
      } else if (uv < 8) {
        $("#uv").addClass("uvHigh")
      } else if (uv < 11) {
        $("#uv").addClass("uvVeryHigh")
      } else {
        $("#uv").addClass("uvExtreme")
      };
      $("#uv").text(uv);
    });
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=c3da05bca4528c3489ab056a709792c2`,
      method: "GET"
    }).then(function(forecastResponse) {
      // var currentHour = moment().format("HH:mm:ss");
      // var hourGroup;
      // if (currentHour.substr(id.length - 8))
      $("#card1Date").html(moment().add(1, 'day').format("(M/D/YYYY)"));
      $("#card2Date").html(moment().add(2, 'day').format("(M/D/YYYY)"));
      $("#card3Date").html(moment().add(3, 'day').format("(M/D/YYYY)"));
      $("#card4Date").html(moment().add(4, 'day').format("(M/D/YYYY)"));
      $("#card5Date").html(moment().add(5, 'day').format("(M/D/YYYY)"));
      $("#card1Icon").html(`<img class="forecastIcon" src="https://openweathermap.org/img/wn/${forecastResponse.list[4].weather[0].icon}@2x.png" alt="${forecastResponse.list[4].weather[0].description}">`);
      $("#card1Temp").text(forecastResponse.list[4].weather[0]);
      $("#card1")
      
    })
  })
})
