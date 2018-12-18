# Tidepool Utils

Utilities to download and work with data you have uploaded to Tidepool.org

##### THIS IS A PROOF OF CONCEPT AND HAS NOT BEEN EXTENSIVELY TESTED

Utilities to:
* download Tidepool.org data and to
* extract openaps pump profile, entries and treatment data from Tidepool data and run autotune from the openaps project

### Setup
1. install node  
2. `git clone https://github.com/alex-gonzalez/tidepool-utils.git tidepool-utils`
3. `cd tidepool-utils`
4. `npm install`  

To download data from tidepool:  
`./tidepool-cli.js download <email username> <destination file>`

To run autotune, install oref0:  
`npm install -g oref0`  

Create an openaps folder with a settings subfolder:
`mkdir openaps && mkdir openaps/settings`

Then run:  
`./autotune-tidepool.sh <--dir=absolute_path_myopenaps_directory> <--username=tidepool_username> [--start-days-ago=number_of_days] [--end-days-ago=number_of_days] [--start-date=YYYY-MM-DD] [--end-date=YYYY-MM-DD] [--xlsx=autotune.xlsx] [--log=(true)|false] [--categorize-uam-as-basal=true|(false)]`


To run tests:  
`npm test`

### Limitations
Autotune has several limitations such as only supporting a single carb factor and sensitivity factor. This software has not been extensively tested and currently only being used for omnipod + dexcom data.

This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
