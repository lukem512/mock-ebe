"use strict"

// Mock Energy Balancing Engine
// Luke Mitchell, 09/06/2016
var amqp = require('amqp');
var socket = require('node-socket-ipc');

var EP_MESSAGING_HOST = process.env.EP_MESSAGING_HOST || "localhost";
var EP_MESSAGING_PORT = process.env.EP_MESSAGING_PORT || 5672;

var EP_MESSAGING_USER = process.env.EP_MESSAGING_USER || "guest";
var EP_MESSAGING_PASS = process.env.EP_MESSAGING_PASS || "guest";

var EP_MESSAGING_EXCHANGE_NAME = process.env.EP_MESSAGING_EXCHANGE_NAME || "LES_EVENTS";
var EP_MESSAGING_QUEUE_NAME = process.env.EP_MESSAGING_QUEUE_NAME || '';

var connection = amqp.createConnection({
  host: EP_MESSAGING_HOST,
  port: EP_MESSAGING_PORT,
  login: EP_MESSAGING_USER,
  password: EP_MESSAGING_PASS
});

connection.on('error', e => {
  console.error('[EBE][AMQP] Error', e.code);
});

connection.on('close', e => {
  console.error('[EBE][AMQP] Connection was closed');
});

connection.on('ready', function () {
  console.log('[EBE][AMQP] Connected to', EP_MESSAGING_HOST);

  connection.queue(EP_MESSAGING_QUEUE_NAME, q => {
      console.log('[EBE][AMQP] Queue ' + q.name + ' is open');

      q.bind(EP_MESSAGING_EXCHANGE_NAME, '#');

      q.subscribe(message => {
        console.log('[EBE][AMQP] Received a message', message)
        socket.publish('receive', message);
      });
  });
});
