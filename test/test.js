var assert = require('assert');
var tidepoolUtils = require('../tidepool-utils');
var fs = require('fs');

var OUTPUT_DIRECTORY = './test/output';
var SAMPLE_TIDEPOOL_DATA_FILE = './test/sample_tidepool_download.json';
var TEST_PUMP_PROFILE_OUTPUT = OUTPUT_DIRECTORY + '/testpumpprofile.json';
var TEST_ENTRIES_OUTPUT = OUTPUT_DIRECTORY + '/testentries.json';
var TEST_TREATMENTS_OUTPUT = OUTPUT_DIRECTORY + '/testtreatments.json';
var START_DATE = '2018-12-01';
var END_DATE = '2018-12-16';

before(function() {
  if (!fs.existsSync(OUTPUT_DIRECTORY)){
    fs.mkdirSync(OUTPUT_DIRECTORY);
  }
  
});

describe('tidepool-utils', function() {
  describe('#extractOpenApsPumpProfile', function() {
    it('should create the pump profile file in the correct path', function() {
      tidepoolUtils.extractOpenApsPumpProfile(SAMPLE_TIDEPOOL_DATA_FILE, TEST_PUMP_PROFILE_OUTPUT, START_DATE, END_DATE);
      assert.equal(fs.existsSync(TEST_PUMP_PROFILE_OUTPUT), true);
    });
  });
});

describe('tidepool-utils', function() {
  describe('#extractNightscoutEntries', function() {
    it('should create the entries file in the correct path', function() {
      tidepoolUtils.extractNightscoutEntries(SAMPLE_TIDEPOOL_DATA_FILE, TEST_ENTRIES_OUTPUT, START_DATE, END_DATE);
      assert.equal(fs.existsSync(TEST_ENTRIES_OUTPUT), true);
    }).timeout(10000);
  });
});

describe('tidepool-utils', function() {
  describe('#extractNightscoutTreatments', function() {
    it('should create the treatments file in the correct path', function() {
      tidepoolUtils.extractNightscoutTreatments(SAMPLE_TIDEPOOL_DATA_FILE, TEST_TREATMENTS_OUTPUT, START_DATE, END_DATE);
      assert.equal(fs.existsSync(TEST_TREATMENTS_OUTPUT), true);
    }).timeout(10000);
  });
});

after(function() {
  fs.unlinkSync(TEST_PUMP_PROFILE_OUTPUT);
  fs.unlinkSync(TEST_ENTRIES_OUTPUT);
  fs.unlinkSync(TEST_TREATMENTS_OUTPUT);
  fs.rmdirSync(OUTPUT_DIRECTORY);
});
