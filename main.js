const { readConfig } = require('./Config/config');
const { publishMessage } = require('./SparkplugB/publisher');
var sparkplug = require('sparkplug-payload').get("spBv1.0");

async function main() {
    console.log("Reading configuration...");
    let config = await readConfig();

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

    var encoded = sparkplug.encodePayload(payload);

    const topic = `spBv1.0/${config.groupId}/${config.edgeNodeId}/${config.deviceId}/DDATA`;
    console.log("Publishing message to topic:", topic);
    await publishMessage(topic, encoded);
    console.log("Message published");
}

main().catch(err => console.error(err));