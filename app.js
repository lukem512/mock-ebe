"use strict";

// Mock Energy Balancing Engine
// Luke Mitchell, 09/06/2016
var httpClient = require('./httpClient');
var amqpClient = require('./amqpClient');

// Connection to the RabbitMQ messaging server
var connection = amqpClient.connection;

console.log('Mock Energy Balancing Engine is starting...');
