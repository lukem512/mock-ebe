"use strict"

// Mock Energy Balancing Engine
// Luke Mitchell, 09/06/2016
var amqp = require('amqp');

var EP_MESSAGING_HOST = process.env.EP_MESSAGING_HOST || "localhost";
var EP_MESSAGING_PORT = process.env.EP_MESSAGING_PORT || 5672;

var EP_MESSAGING_USER = process.env.EP_MESSAGING_USER || "guest";
var EP_MESSAGING_PASS = process.env.EP_MESSAGING_PASS || "guest";

var EP_MESSAGING_EXCHANGE_NAME = process.env.EP_MESSAGING_EXCHANGE_NAME || "LES_EVENTS";
var EP_MESSAGING_QUEUE_NAME = process.env.EP_MESSAGING_QUEUE_NAME || '';

// A list of functions to be called when a message is received
// A delegate returns 'true' to be removed from this list
var delegates = [];

// Boolean flag indicating connection status
var connected = false;

// Add a delegate to the list
var registerDelegate = (cb) => {
  delegates.push(cb);
};

// Find a matching function and remove it
var unregisterDelegate = (cb) => {
  for (let i = delegates.length - 1; i >= 0; i--) {
    if (delegates[i].toString() === cb.toString()) {
      delegates.splice(i, 1);
    }
  }
};

var connection = amqp.createConnection({
  host: EP_MESSAGING_HOST,
  port: EP_MESSAGING_PORT,
  login: EP_MESSAGING_USER,
  password: EP_MESSAGING_PASS
});

connection.on('error', e => {
  console.error('[AMQP] Error', e);
});

connection.on('close', e => {
  console.error('[AMQP] Connection was closed');
  connected = false;
});

connection.on('ready', function () {
  console.log('[AMQP] Connected to', EP_MESSAGING_HOST);
  connected = true;

  connection.queue(EP_MESSAGING_QUEUE_NAME, q => {
      console.log('[AMQP] Queue ' + q.name + ' is open');

      q.bind(EP_MESSAGING_EXCHANGE_NAME, '#');

      q.subscribe(message => {
        delegates.forEach(delegate => {
          if (delegate(message)) {
            unregisterDelegate(delegate);
          }
        });
      });
  });
});

function isConnected() {
  return connected;
};

module.exports.connected = isConnected;
module.exports.registerDelegate = registerDelegate;
module.exports.unregisterDelegate = unregisterDelegate;
