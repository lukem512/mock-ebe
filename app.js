"use strict";

// Mock Energy Balancing Engine
// Luke Mitchell, 09/06/2016
console.log('[EBE] Mock Energy Balancing Engine is starting...');

var httpClient = require('./httpClient');
var amqpClient = require('./amqpClient');

// Expose the necessary test methods
var socket = require('node-socket-ipc');
socket.routines.add('requestUpdateDeviceData', function(args) {
  return httpClient.requestUpdateDeviceData(args.device_parameter_id, args.target_value);
});
