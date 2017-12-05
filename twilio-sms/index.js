
var yahooFinance = require('yahoo-finance');
cronJob = require('cron').CronJob;
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
var rmp;
var rmc;

//Job executes twice a day
var textJob = new cronJob( '0 10,18 * * *', function(){

   //Get stock values
    yahooFinance.quote({
      symbol: 'AAPL',
      modules: ['price'] // see the docs for the full list
    }, function (err, quotes) {
      var price = quotes['price']
      rmp = price['regularMarketPrice']
      rmc = price['regularMarketChange']

      //Send SMS
      client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.CELL_PHONE_NUMBER,
        body: "Current APPL Stock: Price: " + rmp + ", Change: " + rmc
      }).then((messsage) => console.log(message.sid));

    });

},  null, true);
