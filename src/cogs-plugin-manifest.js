module.exports =
    /**
     * @type {const}
     * @satisfies {import("@clockworkdog/cogs-client").CogsPluginManifest}
     */
    ({
        name: 'MQTT Client',
        icon: 'bullseye-pointer',
        description: 'Plugin that handles sending and receiving MQTT messages',
        version: '1',
        events: {
            toCogs: [
                {
                    name: 'mqttMessage',
                    value: {
                        type: 'string' // Topic
                    }
                }
            ],
            fromCogs: [
                {
                    name: 'publish',
                    value: {
                        type: 'string' // Topic
                    }
                },
                {
                    name: 'subscribe',
                    value: {
                        type: 'string' // Topic
                    }
                },
                {
                    name: 'unsubscribe',
                    value: {
                        type: 'string' // Topic
                    }
                },
            ],
        },
        state: [
            {
                name: 'publishPayload',
                value: {
                    type: 'string',
                    default: ''
                },
                writableFromCogs: true
            },
            {
                //Quality of Service
                //https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/
                name: 'QoS',
                value: {
                    type: 'number',
                    default: 0,
                    min: 0,
                    max: 2
                },
                writableFromCogs: true
            },
            {
                name: 'retainFlag',
                value: {
                    type: 'boolean',
                    default: false
                },
                writableFromCogs: true
            },
            {
                name: 'dupFlag',
                value: {
                    type: 'boolean',
                    default: false
                },
                writableFromCogs: true
            },

            {
                name: 'subscribePayload',
                value: {
                    type: 'string',
                    default: ''
                },
                writableFromClient: true
            },
            {
                name: 'mqttServerConnected',
                value: {
                    type: 'boolean',
                    default: false
                },
                writableFromClient: true
            },

        ],
        config: [
            {
                name: 'mqttServerUrl',
                value: {
                    type: 'string',
                    default: ''
                },
            },
            {
                name: 'logging',
                value: {
                    type: 'boolean',
                    default: false
                },
            },             {
                name: 'username',
                value: {
                    type: 'string',
                    default: ''
                },
            },           {
                name: 'password',
                value: {
                    type: 'string',
                    default: ''
                },
            },
        ]
    });