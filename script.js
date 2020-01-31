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
  getThatWeather($("#cityName"));
  $("#city")[0].reset();
});

$(document).on("click", ".prevCity", function() {getThatWeather(event.target)});

  var getThatWeather = function(toSearch) {
  console.log(toSearch);
  var query;
  if ($(toSearch).hasClass("prevCity") === true) {
    query = toSearch.getAttribute("data-name");
  } else {
    query = $(toSearch).val().trim();
  };
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
    $("#weather").html(`<img id="weather" src="https://openweathermap.org/img/w/${response.weather[0].icon}.png" alt="${response.weather[0].description}">`);
    $("#temp").text(`${temp}°F`);
    $("#humid").text(`${response.main.humidity}%`);
    $("#wind").text(`${wind} MPH`);
    // Here I call a new api for uv info
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=c3da05bca4528c3489ab056a709792c2&units=imperial`,
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

    // This will create and populate my 5 day forecast
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=c3da05bca4528c3489ab056a709792c2&units=imperial`,
      method: "GET"
    }).then(function(forecastResponse) {
      // var currentHour = moment().format("HH:mm:ss");
      // var hourGroup;
      // if (currentHour.substr(id.length - 8))
      for (var i = 0; i < 5; i++) {
        $(".hide").removeClass("hide");
        var temp = Math.round(forecastResponse.list[6 + (i * 8)].main.temp);
        $(`#card${i+1}Date`).html(moment().add((i+1), 'day').format("(M/D/YYYY)"));
        $(`#card${i+1}Icon`).html(`<img class="forecastIcon" src="https://openweathermap.org/img/w/${forecastResponse.list[6 + (i * 8)].weather[0].icon}.png" alt="${forecastResponse.list[6 + (i * 8)].weather[0].description}">`);
        $(`#card${i+1}Temp`).text(temp);
        $(`#card${i+1}Humid`).text(forecastResponse.list[6 + (i * 8)].main.humidity);
      }
    })
  })
};
