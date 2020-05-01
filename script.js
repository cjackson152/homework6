$(document).ready(function(){
  $('#searchBtn').on('click', function(){
    var searchLoc = $("#search").val();
 
    searchW(searchLoc);
 
  });

  $('.previousSearch').on('click', 'li', function(){ 
    searchW($(this).text());
  })

  function listAppend(text) {
    let li = $('<li>').addClass('weatherList').text(text);
    $('.previousSearch').append(li);
  }

  function searchW(searchLoc) {
    $.ajax({
      type: 'GET',
      url: 'http://api.openweathermap.org/data/2.5/weather?q=' + searchLoc + '&appid=7ba67ac190f85fdba2e2dc6b9d32e93c&units=imperial',
      dataType: 'JSON',
      success: function(data) {
        if (previousSearch.indexOf(searchLoc) === -1) {
          previousSearch.push(searchValue);
          window.localStorage.setItem('previousSearch', JSON.stringify(previousSearch));

          listAppend(searchLoc);
        }
        $('#today').empty();

        let title = $('<h1>').addClass('headerJumbo').text(data.name + '( ' + new Date().toLocaleDateString() + ')');
        let box = $('<div>').addClass('box');
        let windSpeed = $('<p>').addClass('infoText').text('Wind: ' + data.wind.speed + ' mph');
        let temp = $('<p>').addClass('infoText').text('Temperature: ' + data.main.temp + 'farenheit');
        let map = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
        let cats = $('<div>').addClass('box');

        title.append(map);
        cats.append(title, temp, windSpeed);
        box.append(cats);
        $('#today').append(box);

        getWeather(searchLoc);
        getUVIndex(data.coord.lat, data.coord.lon);

      }
    });

  }
  function getWeather(searchLoc) {
    $.ajax({
      type: 'GET',
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=7ba67ac190f85fdba2e2dc6b9d32e93c&units=imperial",
      dataType: 'JSON',
      success: function(data) {
        $('#weatherInfo').html('<h1 class=headerJumbo> Forecast: </h1>').append('<div class=rows>');


        for(var i=0; i<data.list.length; i++) {
          if (data.list[i].dt_txt.indexOf('12:00:00') !== -1) {
          
            let col = $('<div>').addClass('col-md-2');
            let dogs = $('<div>').addClass('div-dogs');
            let divBody = $('<div>').addClass('div-body');
            let title = $('<h1>').addClass('div-title');
            let img = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png');
            let p1 = $('<p>').addClass('div-text').text('Temp: ' +data.list[i].main.temp_max + 'farenheit');
            let p2 = $('<p>').addClass('div-text').text('Humidity: ' + data.list[i].main.humidity + '%');
            

          }
        }
      }
    })
  }



})


