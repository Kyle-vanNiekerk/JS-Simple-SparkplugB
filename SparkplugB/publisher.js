const fs = require('fs');
const path = require('path');
const mqtt = require('mqtt');
const { readConfig } = require('../Config/config.js');

async function publishMessage(topic, message) {
    try {
        const config = await readConfig();
        console.log("MQTT Config:", config);
        const options = {};

        if (config.mqttUsername) options.username = config.mqttUsername;
        if (config.mqttPassword) options.password = config.mqttPassword;
        if (config.clientCertificate) options.cert = fs.readFileSync(config.clientCertificate);
        if (config.clientKey) options.key = fs.readFileSync(config.clientKey);
        if (config.caCertificate) options.ca = fs.readFileSync(config.caCertificate);

        console.log("Connecting to MQTT broker at:", config.mqttBrokerUrl);
        const client = mqtt.connect(config.mqttBrokerUrl, options);

        client.on('connect', () => {
            console.log("MQTT client connected");
            client.publish(topic, message, {}, (err) => {
                if (err) {
                    logError(err);
                } else {
                    console.log("Message published successfully");
                }
                client.end();
            });
        });

        client.on('error', (err) => {
            console.log("MQTT client error:", err);
            logError(err);
        });
    } catch (err) {
        logError(err);
    }
}

function logError(error) {
    const errorLogPath = path.join(__dirname, '..', 'error_log.txt');
    const timestamp = new Date().toISOString();
    const errorMessage = `[Publisher] ${timestamp} - ${error.message || error}\n`;
    fs.appendFileSync(errorLogPath, errorMessage, 'utf-8');
}

module.exports = {
    publishMessage
};