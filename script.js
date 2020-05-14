const openWeatherKey = '1e61f70bc517e0aeee95c1011a50a306';
var currentForecast = $('#todaysWeather');
var forecastHtml = $('#weekForecast');
var city;

$('#previousSearch').click(function() {
  let cityName = event.target.value;
  weather(cityName);
  forecast(cityName);
})


$('#submitCity').click(function() {
  event.preventDefault();
  let cityName = $('#cityInput').val();
  weather(cityName);
  forecast(cityName);
});

function forecast(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&APPID=${openWeatherKey}`;

    $.get(queryURL).then(function(response){
        let forecastInfo = response.list;
        forecastHtml.empty();
        $.each(forecastInfo, function(i) {
            if (!forecastInfo[i].dt_txt.includes('12:00:00')) {
                return;
            }
            let forecastDate = new Date(forecastInfo[i].dt*1000);
            let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;

            forecastHtml.append(
              `<div class='col-md'>
                <div class='card text-white bg-success'>
                    <div class='card-body'>
                        <h4 class='card-title'>${forecastDate.getMonth()+1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                        <img src=${weatherIcon} alt='Icon'>
                        <p>Temperature: ${forecastInfo[i].main.temp} &#176;F</p>
                        <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
                    </div>
                </div>
            </div>`
    )
        })
    })
};


function uvi(coordinates) {
  let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${openWeatherKey}`;

  $.get(queryURL).then(function(response){
      let currentUVI = response.value;
      let uviSeverity = 'green';
      let textColour = 'white'
      if (currentUVI >= 11) {
          uviSeverity = 'purple';
      } else if (currentUVI >= 8) {
          uviSeverity = 'red';
      } else if (currentUVI >= 6) {
          uviSeverity = 'orange';
          textColour = 'black'
      } else if (currentUVI >= 3) {
          uviSeverity = 'yellow';
          textColour = 'black'
      }
      currentForecast.append(`<p>UV Index: <span class='text-${textColour} uvPadding' style='background-color: ${uviSeverity};'>${currentUVI}</span></p>`);
  })
}



function weather(cityName) {
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=${openWeatherKey}`;

  $.get(queryURL).then(function(response){
      let time = new Date(response.dt*1000);
      let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

      currentForecast.html(
        `
      <h2>${response.name}, ${response.sys.country} (${time.getMonth()+1}/${time.getDate()}/${time.getFullYear()})<img src=${weatherIcon} height='80px'></h2>
      <p>Current Temperature: ${response.main.temp} &#176;F</p>
      <p>Current Humidity: ${response.main.humidity}%</p>
      <p>Current Wind Speed: ${response.wind.speed} MPH</p>
      `,
      uvi(response.coord))
      previousSearch(response.name);
  })
};

function previousSearch(cityName) {
    var citySearch = cityName.trim();
    var button = $(`#previousSearch > BUTTON[value='${citySearch}']`);
    if (button.length == 1) {
      return;
    }
    
    if (!city.includes(cityName)){
        city.push(cityName);
        localStorage.setItem('weatherSearch', JSON.stringify(city));
    }

    $('#previousSearch').prepend(`
    <button class='btn btn-dark cityHistoryBtn' value='${cityName}'>${cityName}</button>
    `);
}

function searchHistory(array) {
    $.each(array, function(i) {
        previousSearch(array[i]);
    })
}

if (localStorage.getItem('weatherSearch')) {
  city = JSON.parse(localStorage.getItem('weatherSearch'));
  searchHistory(city);
} else {
  city = [];
};


weather('Irvine, CA');
forecast('Irvine, CA');

