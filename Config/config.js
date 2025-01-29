const fs = require('fs');
const path = require('path');

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

async function writeConfig(
    mqttBrokerUrl,
    mqttTopic,
    mqttUsername,
    mqttPassword,
    clientCertificate,
    clientKey,
    caCertificate
) {
    const configFilePath = path.join(__dirname, '..', 'config.txt');
    const configContent = 
`mqttBrokerUrl=${mqttBrokerUrl}
mqttTopic=${mqttTopic}
mqttUsername=${mqttUsername}
mqttPassword=${mqttPassword}
clientCertificate=${clientCertificate}
clientKey=${clientKey}
caCertificate=${caCertificate}`;

    try {
        fs.writeFileSync(configFilePath, configContent, 'utf-8');
    } catch (err) {
        logError(err);
        throw err;
    }
}

async function generateDefaultConfig() {
    const configFilePath = path.join(__dirname, '..', 'config.txt');
    const defaultConfig = 
`mqttBrokerUrl=mqtt://localhost:1883
mqttTopic=opc_dev`;

    try {
        fs.writeFileSync(configFilePath, defaultConfig, 'utf-8');
    } catch (err) {
        logError(err);
        throw err;
    }
}

function configExists() {
    const configFilePath = path.join(__dirname, '..', 'config.txt');
    return fs.existsSync(configFilePath);
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