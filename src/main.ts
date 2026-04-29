import { CogsConnection } from "@clockworkdog/cogs-client";

import * as manifest from "./cogs-plugin-manifest.js";
import mqtt,  { MqttClient } from "mqtt"; // import namespace "mqtt"
import type { QoS } from "mqtt-packet"

const cogsConnection = new CogsConnection(manifest);

let mqttClient: MqttClient | null = null

cogsConnection.addEventListener('config', ({ config }) => {
  // Handle new config
  // `config` is of type `{ [name: string]: number | string | boolean }`
  if(config["logging"]===true)console.log("Config Changed");
  if(config["mqttServerUrl"] !== ""){
    connectToMqttClient(
      config["mqttServerUrl"],
      config["logging"],
      config["username"],
      config["password"],
    )
  } 
});


cogsConnection.addEventListener("event", async ({ name, value }) => {
  switch (name) {
    case "publish": publish(value)
      break
    case "subscribe": subscribe(value)
     break
    case "unsubscribe": unsubscribe(value)
     break
  }
});

function publish(topic: string){
  if(topic === "")return
  mqttClient?.publish(
    topic,
    cogsConnection.state.publishPayload,
    {
      qos: <QoS> cogsConnection.state.QoS,
      retain: cogsConnection.state.retainFlag,
      dup: cogsConnection.state.dupFlag
    },
    (err) => {
      if (err !== undefined && err !== null) console.error(err)
    }
  )
  if (cogsConnection.config.logging) console.log(`Message published: [${topic}] ${cogsConnection.state.publishPayload} QoS: ${cogsConnection.state.QoS}`);
}

function subscribe(topic: string){
  if(topic === "")return
  mqttClient?.subscribe(
    topic,
    {
      qos: <QoS> cogsConnection.state.QoS
    },
    (err, granted) => {
      if (err != undefined && err !== null) {
        console.error(err)
        return;
      }
      if (cogsConnection.config.logging && granted !== undefined && granted.length === 1){
        console.info("Subscribed to topic: " + granted[0].topic + "; Qos:", granted[0].qos)
      }
    }
  )
}

function unsubscribe(topic: string){
  if(topic === "")return
  mqttClient?.unsubscribe(
    topic,
    (err, granted) => {
      if (err != undefined && err !== null) {
        console.error(err)
        return;
      }
      if (cogsConnection.config.logging && granted !== undefined){
        console.info("Unsubscribed to topic: " + topic)
      }
    }
  )
}

function connectToMqttClient(url: string, logging: boolean, username: string, password: string){
  if (mqttClient !== null){
    if(logging) console.log("Disconnecting old Mqtt client");
    mqttClient.endAsync()
    mqttClient = null
  } 
  if(logging) console.log("Connecting...");
  mqttClient = mqtt.connect(
    url, 
    {username: username, password: password}
  )
  cogsConnection.setState({mqttServerConnected: mqttClient.connected})

  mqttClient.on("error", (err)=>{
    mqttClient?.end() //This stops reconnecting to the client when errors like connectionrefused occour!
    console.error(err) 
  })
  mqttClient.on("connect", ()=>{
    if(logging)console.log("Connected")
    cogsConnection.setState({mqttServerConnected: true})
  })
  mqttClient.on("end", ()=>{
    if(logging)console.log("Connection ended")
    cogsConnection.setState({mqttServerConnected: false})
  })
  mqttClient.on("offline", ()=>{
    if(logging)console.log("Client offline")
    cogsConnection.setState({mqttServerConnected: false})
  })
  mqttClient.on("reconnect", ()=>{
    if(logging)console.log("Reconnecting...")
  })

  mqttClient.on("message", handleMessage)
}

function handleMessage(topic: string, message: Buffer<ArrayBufferLike>){
  const messageString = arrayBufferToString(message)
  if (cogsConnection.config.logging) console.log(`Message received: [${topic}] ${messageString}`);
  cogsConnection.setState({subscribePayload: messageString})
  cogsConnection.sendEvent("mqttMessage", topic)
}

function arrayBufferToString(buffer: Buffer<ArrayBufferLike>) {
  let decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(buffer));
}