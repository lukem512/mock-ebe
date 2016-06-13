"use strict";

// Mock Energy Balancing Engine
// Luke Mitchell, 09/06/2016
var httpClient = require('./httpClient');
var amqpClient = require('./amqpClient');

// Register delegates with the AMQP client, if the device and parameter
// reference identifiers match then a callback is executed
var registerReceivePushNotification = (device_parameter, expected_value, cb) => {
  // This is a JavaScript closure and allows specific values
  // to be encoded into an anonymous function definition
  var delegate = (function(device_parameter, expected_value, cb) {
    return function(obj){
      let found = false;

      /* { previous: 105,
      current: 123,
      type: '112',
      action: 'change_record',
      site: 'secure_testsite',
      device_parameter: 114,
      trigger: 'OD',
      time: '2016-06-13T10:34:23.850940+00:00' } */

      if (obj.device_parameter == device_parameter) {
        if (obj.current.toString() == expected_value.toString()) {
          // The message matches the expected change in device parameter
          // Forward it onto the callback
          cb(obj);
          found = true;
        }
      }

      // If the value was found, remove the delegate
      return found;
    };
  })(device_parameter, expected_value, cb);

  // Register our anonymous delegate
  amqpClient.registerDelegate(delegate);
};

console.log('Mock Energy Balancing Engine is starting...');

// Expose the necessary test methods
module.exports.connected = amqpClient.connected;
module.exports.requestUpdateDeviceData = httpClient.requestUpdateDeviceData;
module.exports.registerReceivePushNotification = registerReceivePushNotification;
