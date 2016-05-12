var request = require('request');

function getWeather(location) {
    return new Promise(function(resolve, reject) {

        if(!location) {
            reject('No location provided.');
        }

        var url = 'http://api.openweathermap.org/data/2.5/weather?q=' +  encodeURIComponent(location) +',us&appid=b1b15e88fa797225412429c1c50c122a&units=imperial';
        request({
            url: url,
            json: true
        }, function(error, response, body) {
            if(error) {
                reject('Unable to retrieve weather.');
            } else {
                resolve('It\'s ' + body.main.temp + '˚F in ' + body.name + '.');
            }
        });
    });
}

getWeather('london').then(function(currentWeather) {
    console.log(currentWeather);
}, function(error) {
    console.log(error);
});
