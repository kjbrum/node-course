function getLocation() {
    return new Promise(function(resolve, reject) {
        resolve({
            city: 'Des Moines',
            state: 'Iowa'
        });
    });
}

function getWeather(location) {
    return new Promise(function(resolve, reject) {
        resolve('It\'s 55 in ' + location.city + ', ' + location.state + '!');
    });
}

getLocation().then(function(location) {
    return getWeather(location);
}).then(function(weather) {
    console.log(weather)
});
