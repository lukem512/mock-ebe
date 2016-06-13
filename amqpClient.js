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

// Add a delegate to the list
var registerDelegate = (cb) => {
  delegates.push(cb);
};

// Find a matching function and remove it
var unregisterDelegate = (cb) => {
  for (i = delegates.length - 1; i >= 0; i--) {
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
  process.exit(1);
});

connection.on('ready', function () {
  console.log('[AMQP] Connected to', EP_MESSAGING_HOST);

  connection.queue(EP_MESSAGING_QUEUE_NAME, q => {
      console.log('[AQMP] Queue ' + q.name + ' is open');

      q.bind(EP_MESSAGING_EXCHANGE_NAME, '#');

      q.subscribe(message => {
        console.log('[AQMP] Received', message);

        delegates.forEach(delegate => {
          if (delegate(message)) {
            unregisterDelegate(delegate);
          }
        });
      });
  });
});

module.exports.registerDelegate = registerDelegate;
module.exports.unregisterDelegate = unregisterDelegate;
