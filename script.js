var searchedCitiesAr = [];
$("#city").submit(function(event){
  event.preventDefault();
  var match = false;
  for (var i = 0; i < searchedCitiesAr.length; i++) {
    if ($("#cityName").val() === searchedCitiesAr[i]) {
      match = true;
    }
  };
  // This makes sure not to make a duplicate li
  if (!match) {
      var recSearchedCity = $("<li>");
      recSearchedCity.addClass("prevCity");
      recSearchedCity.attr("data-name", $("#cityName").val());
      recSearchedCity.text($("#cityName").val());
      $("#searchedCities").prepend(recSearchedCity);
      searchedCitiesAr.push($("#cityName").val());
  };
})