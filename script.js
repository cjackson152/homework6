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
      }
    })
  }

})


