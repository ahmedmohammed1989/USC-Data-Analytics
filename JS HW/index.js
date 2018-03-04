var $tbody = document.querySelector("tbody");
var $date = document.querySelector("#date");
var $city = document.querySelector("#city");
var $state = document.querySelector("#state");
var $country = document.querySelector("#country");
var $shape = document.querySelector("#shape");
var $searchBtn = document.querySelector("#search");
var $resetBtn = document.querySelector("#reset");

$searchBtn.addEventListener("click", handleSearchButtonClick);
$resetBtn.addEventListener("click", resetbutton);

var data_filtered = dataSet;


function showtable() {
  $tbody.innerHTML = "";
  for (var i = 0; i < data_filtered.length; i++) {

    var sight = data_filtered[i];
    var fields = Object.keys(sight);
   
    var $row = $tbody.insertRow(i);
    for (var j = 0; j < fields.length; j++) {
      
      var field = fields[j];
      var $cell = $row.insertCell(j);
      $cell.innerText = sight[field];
    }
  }
}

function handleSearchButtonClick() {
  

  var filterDate = $date.value.trim();
  if (filterDate != "") {
    data_filtered = dataSet.filter(function (sight) {
      var sightDate = sight.datetime;
      return sightDate === filterDate;
    });
  };
  var filterCity = $city.value.trim().toLowerCase();
  if (filterCity != "") {
    data_filtered = data_filtered.filter(function (sight) {
      var sightCity = sight.city;
      return sightCity === filterCity;
    });
  };
  var filterState = $state.value.trim().toLowerCase();
  if (filterState != "") {
    data_filtered = data_filtered.filter(function (sight) {
      var sightState = sight.state;
      return sightState === filterState;
    });
  };
  var filterCountry = $country.value.trim().toLowerCase();
  if (filterCountry != "") {
    data_filtered = data_filtered.filter(function (sight) {
      var sightCountry = sight.country;
      return sightCountry === filterCountry;
    });
  };
  var filterShape = $shape.value.trim().toLowerCase();
  if (filterShape != "") {
    data_filtered = data_filtered.filter(function (sight) {
      var sightShape = sight.shape;
      return sightShape === filterShape;
    });
  };
  showtable();
};

function resetbutton() {
  data_filtered = dataSet;
  $date.value = "";
  $city.value = "";
  $state.value = "";
  $country.value = "";
  $shape.value = "";
  showtable();
}

showtable();