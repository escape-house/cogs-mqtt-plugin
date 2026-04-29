# Cogs HTTP Client with return values

This is an MQTT plugin for [COGS](https://cogs.show/).

A demonstration of how the plugin can be implemented in COGS is also in the `cogs-test` directory.

## How to Use
1. Download the latest release
2. [Add the plugin](https://docs.cogs.show/plugins/how-to-install/) to your project.
3. Enable the plugin
4. Configure the MQTT server URL under MQTT Client -> mqttServerUrl. Optionally, you can also configure a username and password.
5. Use subscribe and publish as shown in the demo or as explained in the [docs](#events).

## Demo
The Demo includes a demo-MQTT server. To start the server, you have to have docker-compose installed.
1. ```cd cogs-demo```
2. ```docker-compose up```
It should be available through `localhost:9001`

## Events, States and Config

### Config
#### mqttServerUrl
The URL of the MQTT server should be configured here.
> The URL can be on the following protocols: 'mqtt', 'mqtts', 'tcp', 'tls', 'ws', 'wss', 'wxs', 'alis'. If you are trying to connect to a unix socket just append the +unix suffix to the protocol (ex: mqtt+unix). This will set the unixSocket property automatically.

(https://github.com/mqttjs/mqtt.js/#mqttconnecturl-options)

#### username & password
If the MQTT server has auth enabled, use these two fields.

#### logging
For debugging purposes, you can enable logging to get an extensive log on all events. You can access this log through Plugins -> MQTT Client -> Click the three dots -> Open developer tools -> Console.

### Events
#### mqttMessage
If you have subscribed to a topic, you can handle messages here. Use the topic name as the value. MQTT wildcards don't work here, but you can implement them with custom JS logic.

#### publish
To publish a message. Pass the topic as the value. You should set publishPayload, QoS, retainFlag, and dupFlag before you execute this event. You should set these states to the default value when you don't want to set them. (See the MQTT: Publish behavior in the Cogs demo for a best practice.)

#### subscribe & unsubscribe
Pass a topic to subscribe to a topic. MQTT wildcards can be used here. Use unsubscribe to unsubscribe while also passing the topic.

### States
#### publishPayload
The payload that is used by the publish event.

#### subscribePayload
When handling an incoming mqttMessage, the payload of the message is stored in the subscribePayload state.

#### QoS
Used by publish and subscribe to set the [QoS](https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/).

#### retainFlag & dubFlag
These options will also be used by publish requests.

## Building
To build the project, run `yarn install` and `yarn build`

## Author
If you have any questions, need support or ideas to improve this plugin, reach out to me on the COGS Discord :)
