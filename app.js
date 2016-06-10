"use strict";

// Mock Energy Balancing Engine
// Luke Mitchell, 09/06/2016
var request = require('request');

var EP_API_HOST = process.env.EP_API_HOST || "localhost";
var EP_API_PORT = process.env.EP_API_PORT || 8000;
var EP_API_SSL = process.env.EP_API_SSL || false;

var EP_AUTHORIZATION_TOKEN = process.env.EP_AUTHORIZATION_TOKEN;

// Construct the URL of the REST API
function makeEpUri() {
  let protocol = (EP_API_SSL ? 'https://' : 'http://');
  return protocol + EP_API_HOST + ':' + EP_API_PORT;
};

// Make a PATCH request to update a specified device parameter
function requestUpdateDeviceData(device_parameter_id, target_value) {
  let body = {
    target_value
  };

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
    if (err) { return console.error(err); }

    switch (res.statusCode) {
      case 200:
      console.log('Update request returned success', res.body);
      break;

      case 401:
      console.error('Not authorized - try a different token');
      break;

      case 404:
      console.error('Device not found');
      break;

      case 500:
      console.error('Internal server error');
      break;

      default:
      console.error('Unhandled status code (' + res.statusCode + ')');
      break;
    }
  });
};

console.log('Mock Energy Balancing Engine is starting...');

// The device parameter id is obtained from the Energy Aggregator Admin panel
// i.e. /admin/ep/deviceparameter/114/
requestUpdateDeviceData(114, '200');
