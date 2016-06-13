"use strict";

// Mock Energy Balancing Engine
// Luke Mitchell, 09/06/2016
var httpClient = require('./httpClient');
var amqpClient = require('./amqpClient');

// Register delegates with the AMQP client, if the device and parameter
// reference identifiers match then a callback is executed
// TODO: what is the message format? THIS PROBABLY WONT WORK
// TODO: test
// TODO: maybe a timeout or something to indicate failure?
var registerReceivePushNotification = (DRefID, DPID, expected_value, cb) => {
  // This is a JavaScript closure and allows specific values
  // to be encoded into an anonymous function definition
  var delegate = (function(DRefID, DPID, expected_value, cb) {
    return function(message){
      let obj = JSON.parse(message);
      let found = false;

      let DDDO = obj.Data.GDDO.ZNDS.DDDO;
      DDDO.some(dddo => {
        if (dddo.DRefID == DRefID && dddo.DPID == DPID) {
          dddo.DPDO.some(dpdo => {
            if (dpdo.CV.toString() == expected_value.toString()) {
              // The message matches the expected change in device parameter
              // Forward it onto the callback
              cb(obj);
              found = true;
            }

            // Break the 'some'
            return found;
          });
        }

        // Break the outer 'some'
        return found;
      });

      // If the value was found, remove the delegate
      return found;
    };
  })(DRefID, DPID, expected_value, cb);

  // Register our anonymous delegate
  amqpClient.registerDelegate(delegate);
};

console.log('Mock Energy Balancing Engine is starting...');

// Expose the necessary test methods
module.exports.requestUpdateDeviceData = httpClient.requestUpdateDeviceData;
module.exports.registerReceivePushNotification = registerReceivePushNotification;
