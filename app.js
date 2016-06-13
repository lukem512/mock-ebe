"use strict";

// Mock Energy Balancing Engine
// Luke Mitchell, 09/06/2016
var httpClient = require('./httpClient');
var amqpClient = require('./amqpClient');

// Provide a closure for the specified device parameter and expected value
var delegate = function(device_parameter, expected_value, cb) {
  return function(obj) {
    let found = false;

    /* { previous: 105,
    current: 123,
    type: '112',
    action: 'change_record',
    site: 'secure_testsite',
    device_parameter: 114,
    trigger: 'OD',
    time: '2016-06-13T10:34:23.850940+00:00' } */

    if (obj.action == 'change_record') {
      if (obj.device_parameter.toString() == device_parameter.toString()) {
        if (obj.current.toString() == expected_value.toString()) {
          cb(obj);
          found = true;
        }
      }
    }

    // If the value was found, remove the delegate
    return found;
  };
}

// Register delegates with the AMQP client, if the device and parameter
// reference identifiers match then a callback is executed
var registerReceivePushNotification = (device_parameter, expected_value, cb) => {
  var _delegate = delegate(device_parameter, expected_value, cb);
  amqpClient.registerDelegate(_delegate);
};

console.log('Mock Energy Balancing Engine is starting...');

// Expose the necessary test methods
module.exports.connected = amqpClient.connected;
module.exports.requestUpdateDeviceData = httpClient.requestUpdateDeviceData;
module.exports.registerReceivePushNotification = registerReceivePushNotification;
