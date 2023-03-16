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

let full_location = (data.location[0] + ', ' + data.location[1])
document.querySelector('.Location').innerHTML = full_location

// times, temperatures, and images

let times = Object.keys(data['forecast'])
let time = ''

// this is as Now is at the end of the json
time = 'Now'
img_code = data['forecast']['Now']['type']
temp = data['forecast']['Now']['temp']
object_name = '.Hour0'
document.querySelector(object_name).innerHTML = '<h6 class="Time0">Now</h6><img src="https://openweathermap.org/img/wn/'+img_code+'@2x.png"><h6 class="Temp0">'+temp+'°C</h6>'

// iterate the rest
for (i=0; i<9; i++)  {
    time = times[i]
    img_code = data['forecast'][time]['type']
    temp = data['forecast'][time]['temp']
    object_name = '.Hour'+(i+1)
    document.querySelector(object_name).innerHTML = '<h6 class="Time0">'+time+'</h6><img src="https://openweathermap.org/img/wn/'+img_code+'@2x.png"><h6 class="Temp0">'+temp+'°C</h6>'
}


// pollen
const green = '#00c51b'
const yellow = '#ff9900'
const red = '#ff0000'
const purple = '#830b4a'


let grass = document.querySelector('.Pollen-Grass')
let trees = document.querySelector('.Pollen-Trees')
let weeds = document.querySelector('.Pollen-Weeds')
grass.innerHTML = 'Grass '+ data['pollen']['grass'] +'ppm'
trees.innerHTML = 'Trees '+ data['pollen']['trees'] +'ppm'
weeds.innerHTML = 'Weeds '+ data['pollen']['weeds'] +'ppm'


// the numbers for the colour change come from the table on Kleenex Pollen Pal
// trees colour change
if (data['pollen']['trees'] < 96) {
    trees.style.borderColor = green
} else if (data['pollen']['trees'] < 208) {
    trees.style.borderColor = yellow
} else if (data['pollen']['trees'] < 704) {
    trees.style.borderColor = red
} else {
    trees.style.borderColor = purple
}

// grass colour change
if (data['pollen']['grass'] < 30) {
    grass.style.borderColor = green
} else if (data['pollen']['grass'] < 61) {
    grass.style.borderColor = yellow
} else if (data['pollen']['grass'] < 342) {
    grass.style.borderColor = red
} else {
    grass.style.borderColor = purple
}

// weeds colour change
if (data['pollen']['weeds'] < 21) {
    weeds.style.borderColor = green
} else if (data['pollen']['weeds'] < 78) {
    weeds.style.borderColor = yellow
} else if (data['pollen']['weeds'] < 267) {
    weeds.style.borderColor = red
} else {
    weeds.style.borderColor = purple
}


// pollution
let target = ''
for (i=0;i<5;i++) {
    target = '.Year' + i
    document.querySelector(target).innerHTML = data['pollution'][i]['year'] + '&nbsp&nbsp&nbsp' + data['pollution'][i]['value'] + ' μg/m<sup>3</sup>'
}

// advice
for (i=0;i<3;i++) {
    target = '.help' + i
    document.querySelector(target).innerHTML = '<h2>'+data['advice'][i]['title']+'</h2><p>'+data['advice'][i]['description']+'</p>'
}

});