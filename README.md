# Mock EBE

A simple client for integration testing IODiCUS. This client mocks the role of the Energy Balancing Engine and will issue device update requests to the Energy Portal.

The mock EBE exposes a socket interface for `send` and `receive` events. The interface also allows external applications to request a `requestUpdateDeviceData` using a `call` message. To configure the port used for this interface the `SOCKET_PORT` environment variable is set.

To install the test you must clone this module and its dependencies:

```
  git clone https://github.com/lukem512/mock-ebe.git
  cd ./mock-ebe
  npm install
```

To run the mock EBE client the following command is used, specifying the message queue host in `EP_MESSAGING_HOST`, the correct port to connect to the message queue and a valid user token.

```
  EP_MESSAGING_HOST='EP_MESSAGING_HOST_HERE' EP_MESSAGING_PORT=5675 EP_AUTHORIZATION_TOKEN='YOUR_EP_TOKEN_HERE' SOCKET_PORT=3001 npm start
```
