var request = require('request');
var fs = require('fs');
var moment = require('moment');


var TIDEPOOL_API_HOST = 'https://api.tidepool.org';

module.exports.downloadData = function(username, password, destDatafile) {

  var loginOptions = {'url': TIDEPOOL_API_HOST + '/auth/login', 'method': 'POST', 'auth': {'user': username,'pass': password,'sendImmediately': true}};
  request(loginOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var JSONBody = JSON.parse(body);
      var token = response.headers['x-tidepool-session-token'];
      var userid = JSONBody.userid;
      var dataOptions = {'url': TIDEPOOL_API_HOST + '/data/' + userid, 'method': 'GET', headers: {'x-tidepool-session-token': token}};

      request(dataOptions, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          console.error("Error "+response.statusCode);
        }
      }).pipe(fs.createWriteStream(destDatafile));
    }
    else {
      console.log("Error "+response.statusCode);
    }
  });
}

module.exports.extractNightscoutEntries = function(sourceDatafile, destDatafile, startDate, endDate) {
  var data = fs.readFileSync(sourceDatafile, 'utf8');
  obj = JSON.parse(data);
  var results = [];
  for (i=0; i<obj.length; i++) {
    // BUG: this is 8 hours off
    if (moment(obj[i].time).isAfter(startDate) && moment(obj[i].time).isBefore(endDate)) {
      if (obj[i].type == 'cbg') {
        results.push({type: 'sgv', sgv: obj[i].payload.smoothedValue || obj[i].payload.realTimeValue, date: moment(obj[i].deviceTime).toDate()});
      }
    }
  }
  fs.writeFileSync(destDatafile, JSON.stringify(results, null, '\t'));
}

module.exports.extractNightscoutTreatments = function(sourceDatafile, destDatafile, startDate, endDate) {
  var data = fs.readFileSync(sourceDatafile, 'utf8');
  obj = JSON.parse(data);
  var results = [];
  for (i=0; i<obj.length; i++) {
    // BUG: this is 8 hours off
    if (moment(obj[i].time).isAfter(startDate) && moment(obj[i].time).isBefore(endDate)) {
      // TODO: find out if treatemnt info can come from other places besides wizard like food + bolus data
      if (obj[i].type == 'wizard') {
        results.push(
          {
            eventType: 'Bolus Wizard',
            carbs: (obj[i].payload.carb_grams==65535)?0:obj[i].payload.carb_grams, // TODO: where is this 65535 value coming from? should troubleshoot and avoid this value coming in at all if possible.
            insulin: obj[i].payload.carb_bolus_units_delivered + obj[i].payload.corr_units_delivered,
            preBolus: '20',
            created_at: obj[i].time
          }
        );
      }
    }
  }
  fs.writeFileSync(destDatafile, JSON.stringify(results, null, '\t'));
}

module.exports.extractOpenApsPumpProfile = function(sourceDatafile, destDatafile, startDate, endDate) {
  var data = fs.readFileSync(sourceDatafile, 'utf8');
  obj = JSON.parse(data);

  var profile = {
    "min_5m_carbimpact": 8, // default
    "basalprofile": [],
    "isfProfile": {
      "sensitivities": [
        {
            "i": 0,
            "start": "00:00:00",
            "sensitivity": null,
            "offset": 0,
            "x": 0,
            "endOffset": 1440
        }
      ]
    },
    "autosens_max": 1.2, // safety setting
    "autosens_min": 0.7, // safety setting
  }

  for (i=0; i<obj.length; i++) {
    if (moment(obj[i].time).isAfter(startDate) && moment(obj[i].time).isBefore(moment(endDate).add(1, 'days'))) {
      if (obj[i].type == 'pumpSettings' ) {
        var pumpSettings = obj[i];
        var basals = pumpSettings.basalSchedules[pumpSettings.activeSchedule];

        for (t=0; t<basals.length; t++) {

          var record = {
            "start": moment.utc(basals[t].start).format('HH:mm:ss'),
            "minutes": basals[t].start / (60 * 1000),
            "rate": basals[t].rate
          };
          
          profile.basalprofile.push(record);

        }

        if (pumpSettings.bolus.calculator.insulin.units == 'minutes')
          profile.dia = pumpSettings.bolus.calculator.insulin.duration / 60;

        // TODO: support multiple carb ratios
        profile.carb_ratio = pumpSettings.carbRatio[0].amount;

        // QUESTION: will this work with multiple sensitivities?
        profile.isfProfile.sensitivities[0].sensitivity = mmolToMgDl(pumpSettings.insulinSensitivity[0].amount);

        fs.writeFileSync(destDatafile, JSON.stringify(profile, null, '\t'));

        return;
      }
    }
  }
}


function mmolToMgDl(mmol) {
  return Math.round(mmol*18);
}
