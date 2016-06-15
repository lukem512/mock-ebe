"use strict";

// Mock Energy Balancing Engine
// Luke Mitchell, 09/06/2016
var request = require('request');

var EP_API_HOST = process.env.EP_API_HOST || "localhost";
var EP_API_PORT = process.env.EP_API_PORT || 8000;
var EP_API_SSL = process.env.EP_API_SSL || false;

let LOG_PREFIX = process.env.LOG_PREFIX || '[EBE]';

var EP_AUTHORIZATION_TOKEN = process.env.EP_AUTHORIZATION_TOKEN;

// Construct the URL of the REST API
function makeEpUri() {
  let protocol = (EP_API_SSL ? 'https://' : 'http://');
  return protocol + EP_API_HOST + ':' + EP_API_PORT;
};

// Make a PATCH request to update a specified device parameter
// This is a promise indicating whether the request was successful
var requestUpdateDeviceData = function(device_parameter_id, target_value) {
  let body = {
    target_value
  };

  return new Promise((resolve, reject) => {
    request({
      uri: makeEpUri() + '/api/device_parameter/' + device_parameter_id,
      method: 'PATCH',
      body,
      json: true,
      headers: {
        'Authorization': 'Token ' + EP_AUTHORIZATION_TOKEN
      }
    },
    (err, res, body) => {
      if (err) {
        console.error(LOG_PREFIX + '[HTTP] Error', err);
        return reject(err, false);
      }

      switch (res.statusCode) {
        case 200:
        console.log(LOG_PREFIX + '[HTTP] Update request returned success', res.body);
        break;

        case 401:
        console.error(LOG_PREFIX + '[HTTP] Not authorized - try a different token');
        break;

        case 404:
        console.error(LOG_PREFIX + '[HTTP] Device not found');
        break;

        case 500:
        console.error(LOG_PREFIX + '[HTTP] Internal server error');
        break;

        default:
        console.error(LOG_PREFIX + '[HTTP] Unhandled status code (' + res.statusCode + ')');
        break;
      }

      resolve(res.statusCode == 200);
    });
  });
};

module.exports.requestUpdateDeviceData = requestUpdateDeviceData;
