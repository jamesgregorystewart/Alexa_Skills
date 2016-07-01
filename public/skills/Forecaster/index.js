var alexa = require('alexa-app'),
	app = new alexa.app('forecaster'),
	http = require("http"),
	request = require("request");

module.change_code = 1;

app.launch(function(req, res) {
	var launchPrompt = "hello world";
	res.say(launchPrompt).reprompt("uh, hey").shouldEndSession(false);
});

app.intent('forecast', {
		'slots': {'day': 'DATE'},
		 'utterances': ['get weather for {day}']
		},
		function(req, res) {
			
			var str = '';
			request
				.get('http://api.openweathermap.org/data/2.5/forecast?APPID=65d29d9a1a0c3db728c5fec50f990c6f&q=Dallas,us&mode=json')
				.on('data', function(data) {
					 str += data; // 200 
				})
				.on('response', function(response) {
					console.log('request status:'  + response.statusCode); // 200 
					//console.dir('response is : ' + JSON.stringify(returnedData));
				})
				.on('end', function() {
					var data = JSON.parse(str);
					giveMeTheCity(data);
				})
		});

function giveMeTheCity(data) {
	console.log('city id: ' + data.city.id);
	console.log('country: ' + data.city.country);
	console.log('date: ' + data.list[0].dt_txt);
}

module.exports = app;
