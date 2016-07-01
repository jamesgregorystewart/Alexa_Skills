var alexa = require('alexa-app'),
	app = new alexa.app('cryptoTrader'),
	http = require("http"),
	request = require("request"),
	autobahn = require('autobahn'),
	wsuri = "wss://api.poloniex.com",
	connection = new autobahn.Connection({
		url: wsuri,
		realm: "realm1"
	});
 
connection.onopen = function (session) {
	function marketEvent (args,kwargs) {
		console.log(args);
	}
	function tickerEvent (args,kwargs) {
		console.log(args);
	}
	function trollboxEvent (args,kwargs) {
		console.log(args);
	}
	//session.subscribe('BTC_XMR', marketEvent);
	session.subscribe('ticker', tickerEvent);
	//session.subscribe('trollbox', trollboxEvent);
}
connection.onclose = function () {
  console.log("Websocket connection closed");
}                      
//connection.open(); // todo: purpose of open connection? Stream of data useful?

app.launch(function(req, res) {
	res.say("CryptoTrader ready for orders!").shouldEndSession(false);
});

app.intent('ticker', {
	'slots': {'updateAll': 'LITERAL'},
	'utterances': ['update all tickers']
	},
	function(req, res) {

		var currency = '';
		request
			.get
			('https://poloniex.com/public?command=returnTicker')
			.on('data', function(data) {
				currency += data;
			})
			.on('response', function(response) {
				console.log('request status:' + response.statusCode);
			})
			.on('end', function() {
				var market = JSON.parse(currency);
				console.log(market); 
			})
	});

module.exports = app;