const { generateDefaultConfig, readConfig, writeConfig, configExists } = require('./Config/config');
const { publishMessage } = require('./SparkplugB/publisher');
var sparkplug = require('sparkplug-payload').get("spBv1.0");

async function main() {
    if (!configExists())
        await generateDefaultConfig();
    let config = await readConfig();

    console.log(config);

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
    publishMessage(topic, encoded);
}

main().catch(err => console.error(err));