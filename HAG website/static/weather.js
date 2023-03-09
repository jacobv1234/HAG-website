// OPENWEATHER IMAGES FOR FORECAST ARE AT
// https://openweathermap.org/img/wn/<id>@2x.png


var latitude = 0
var longitude = 0

// get location - automatically asks permission
navigator.geolocation.getCurrentPosition(function(position) {

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

})

// build http request body
let body = {
    longitude: longitude,
    latitude: latitude,
    time: Date.now()
}

let data = {}
// send a request to main.py for the weather data
fetch('/weather/content', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body)
})
.then(response => response.json())

// handle response
.then(data => {

console.log(data)
let full_location = (data.location[0] + ', ' + data.location[1])
document.querySelector('.Location').innerHTML = full_location

// times, temperatures, and images
for (i=0; i<10; i++)  {
    time = data[i]
    console.log(time)
    img_code = data[time].type
    temp = data[time].temp
    document.querySelector('.Hour' + i).innerHTML = '<h6 class="Time0">'+time+'</h6><img src="https://openweathermap.org/img/wn/'+img_code+'@2x.png"><h6 class="Temp0">'+temp+'</h6>'
}

});
