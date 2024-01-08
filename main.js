

const options = {method: 'GET', headers: {accept: 'application/json'}};

let latitude, longitude = 0.00

let cookie = getCookie('loc')
console.log(cookie)

if(cookie != null){
    if (navigator.geolocation) {
        getWeather(cookie)
    } else {
        getElem('no-support').style.display = 'block'
        console.log("Geolocation is not supported by this browser.");
    }
} else {
    getElem('loading').style.display = 'none'
    getElem('getcookie').style.display = 'flex'
}
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getWeather(loc){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=7451605158a8f69a66a587964740fe6e`, options)
    .then(response => response.json())
    .then( response => {
        console.log(response)
        getElem('loading').style.display = 'none'
        getElem('weather').innerText = response.weather[0].main + ' - ' + response.name + ', ' + response.sys.country
        getElem('desc').innerText = response.weather[0].description.toUpperCase() + '  •  ' + toCelsius(response.main.temp) + ' °C' + ' / ' + toFahren(response.main.temp) + ' °F'
        getElem('image').innerHTML = `<img src='https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png' alt='Weather Image'>`
    })
    .catch(err => console.error(err));
}

function getElem(id){
    return document.getElementById(id)
}

function getLocValue(){
    loc = getElem('loc').value
    setCookie('loc', loc, 31)
    if( loc == ''){}
    else {
        getWeather(loc)
        getElem('getcookie').style.display = 'none'
    }
}

function toCelsius(kelvin){
    return (kelvin - 273.15).toFixed(0)
}

function toFahren(kelvin){
    return ( toCelsius(kelvin) * (9/5) + 2 ).toFixed(0)
}


getElem('loc').addEventListener("keydown", (e) => {
    if (e.key == 'Enter'){
        getLocValue()
    }
  });

getElem('button').addEventListener("click", (e) => {
    getLocValue()
});