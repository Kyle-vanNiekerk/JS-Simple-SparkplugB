const fs = require('fs');
const path = require('path');
const mqtt = require('mqtt');

async function readConfig() {
    const configFilePath = path.join(__dirname, '..', 'config.txt');
    try {
        const data = fs.readFileSync(configFilePath, 'utf-8');
        const config = {};
        data.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                const configKey = key.trim();
                config[configKey] = value.trim();
            }
        });
        return config;
    } catch (err) {
        logError(err);
        throw err;
    }
}

function publishMessage(topic, message) {
    readConfig().then(config => {
        const options = {
            username: config.mqttUsername || undefined,
            password: config.mqttPassword || undefined,
            cert: config.clientCertificate ? fs.readFileSync(config.clientCertificate) : undefined,
            key: config.clientKey ? fs.readFileSync(config.clientKey) : undefined,
            ca: config.caCertificate ? fs.readFileSync(config.caCertificate) : undefined
        };

        const client = mqtt.connect(config.mqttBrokerUrl, options);

        client.on('connect', () => {
            client.publish(topic, message, {}, (err) => {
                if (err) {
                    logError(err);
                }
                client.end();
            });
        });

        client.on('error', (err) => {
            logError(err);
        });
    }).catch(err => logError(err));
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