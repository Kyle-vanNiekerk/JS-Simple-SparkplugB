const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function readConfig() {
    const envFilePath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envFilePath)) {
        await generateDefaultConfig();
        require('dotenv').config({ path: envFilePath });
    }

    try {
        const config = {
            mqttBrokerUrl: process.env.MQTT_BROKER_URL,
            mqttUsername: process.env.MQTT_USERNAME,
            mqttPassword: process.env.MQTT_PASSWORD,
            clientCertificate: process.env.CLIENT_CERTIFICATE,
            clientKey: process.env.CLIENT_KEY,
            caCertificate: process.env.CA_CERTIFICATE,
            groupId: process.env.GROUP_ID,
            edgeNodeId: process.env.EDGE_NODE_ID,
            deviceId: process.env.DEVICE_ID
        };
        return config;
    } catch (err) {
        logError(err);
        throw err;
    }
}

async function writeConfig(
    mqttBrokerUrl,
    mqttUsername,
    mqttPassword,
    clientCertificate,
    clientKey,
    caCertificate,
    groupId,
    edgeNodeId,
    deviceId
) {
    const envFilePath = path.join(__dirname, '..', '.env');
    const configContent = 
`MQTT_BROKER_URL=${mqttBrokerUrl}
GROUP_ID=${groupId}
EDGE_NODE_ID=${edgeNodeId}
DEVICE_ID=${deviceId}
MQTT_USERNAME=${mqttUsername}
MQTT_PASSWORD=${mqttPassword}
CLIENT_CERTIFICATE=${clientCertificate}
CLIENT_KEY=${clientKey}
CA_CERTIFICATE=${caCertificate}`;

    try {
        fs.writeFileSync(envFilePath, configContent, 'utf-8');
    } catch (err) {
        logError(err);
        throw err;
    }
}

async function generateDefaultConfig() {
    const envFilePath = path.join(__dirname, '..', '.env');
    const defaultConfig = 
`MQTT_BROKER_URL=mqtt://localhost:1883
GROUP_ID=defaultGroup
EDGE_NODE_ID=defaultEdgeNode
DEVICE_ID=defaultDevice
MQTT_USERNAME=
MQTT_PASSWORD=
CLIENT_CERTIFICATE=
CLIENT_KEY=
CA_CERTIFICATE=`;

    try {
        fs.writeFileSync(envFilePath, defaultConfig, 'utf-8');
    } catch (err) {
        logError(err);
        throw err;
    }
}

function configExists() {
    const envFilePath = path.join(__dirname, '..', '.env');
    return fs.existsSync(envFilePath);
}

function logError(error) {
    const errorLogPath = path.join(__dirname, '..', 'error_log.txt');
    const timestamp = new Date().toISOString();
    const errorMessage = `[Config] ${timestamp} - ${error.message || error}\n`;
    fs.appendFileSync(errorLogPath, errorMessage, 'utf-8');
}

module.exports = {
    readConfig,
    writeConfig,
    generateDefaultConfig,
    configExists
};