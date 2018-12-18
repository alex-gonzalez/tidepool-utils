#!/usr/bin/env node

var readline = require('readline');
var tidepoolUtils = require('./tidepool-utils');

function usage () {
    console.error('usage: ', process.argv.slice(0, 2));
    console.error('\t', 'download [tidepool username] <ouput tidepool data file>');
    console.error('\t', 'extract_openaps_pump_settings <tidepool data file> <start date> <end date>');
    console.error('\t', 'extract_nightscout_entries <tidepool data file> <start date> <end date>');
    console.error('\t', 'extract_nightscout_treatments <tidepool data file> <start date> <end date>');
}

var action = process.argv[2];

if ([null, undefined, '--help', '-h', 'help'].indexOf(action) > 0) {
  usage();
  process.exit(0);
}
switch (action) {
  case 'download':

    var username = null;
    var password = null;
    var path = null;

    var askUsername = () => {
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Tidepool.org Username: ', function(un) {
        username = un;
        rl.close();
        askPassword();
      });
    };

    var askPassword = () => {
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.stdoutMuted = true;
      rl.question('Password: ', function(pass) {
        console.log('');
        password = pass;
        rl.close();
        doDownload();
      });
      rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (rl.stdoutMuted)
          rl.output.write("*");
        else
          rl.output.write(stringToWrite);
      };
    };

    var doDownload = () => {
      tidepoolUtils.downloadData(username, password, process.argv[3]);
    }

    if (process.argv.length==5) {
      username = process.argv[3];
      path = process.argv[4];
      askPassword();
    }

    if (process.argv.length==4) {
      path = process.argv[3];
      askUsername();
    }

  break;

  case 'extract_openaps_pump_settings':
    tidepoolUtils.extractOpenApsPumpProfile(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);
  break;

  case 'extract_nightscout_entries':
    tidepoolUtils.extractNightscoutEntries(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);
  break;

  case 'extract_nightscout_treatments':
    tidepoolUtils.extractNightscoutTreatments(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);
  break;

}
