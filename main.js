const { generateDefaultConfig, readConfig, writeConfig, configExists } = require('./Config/config');
const { publishMessage } = require('./SparkplugB/publisher');
var sparkplug = require('sparkplug-payload').get("spBv1.0");

async function main() {
    if (!configExists())
        await generateDefaultConfig();
    let config = await readConfig();

    console.log(config);
    console.log(config.mqttBrokerUrl);
    console.log(config.mqttTopic);

    var payload = {
        "timestamp": new Date().getTime(),
        "metrics": [
            {
                "name": "intMetric",
                "value": 1,
                "type": "Int32"
            }
        ]
    };

    // Log the payload before encoding
    console.log("Payload:", payload);

    var encoded = sparkplug.encodePayload(payload);

    // Log the encoded payload
    console.log("Encoded Payload:", encoded);

    // Ensure the encoded payload is a Buffer
    let message = encoded.toString('base64');

    // Log the base64 encoded message
    console.log("Base64 Encoded Message:", message);

    publishMessage(encoded);
}

main().catch(err => console.error(err));