const { readConfig } = require('./Config/config');
const { publishMessage } = require('./SparkplugB/publisher');
var sparkplug = require('sparkplug-payload').get("spBv1.0");

async function main() {
    console.log("Reading configuration...");
    let config = await readConfig();

    // Create NBIRTH payload
    var birthPayload = {
        "timestamp": new Date().getTime(),
        "metrics": [
            {
                "name": "Node Control/Rebirth",
                "value": false,
                "type": "Boolean"
            },
            {
                "name": "bdSeq",
                "value": 0,
                "type": "Int32"
            }
        ],
        "seq": 0 // Add sequence number
    };

    var encodedBirth = sparkplug.encodePayload(birthPayload);
    const birthTopic = `spBv1.0/${config.groupId}/${config.edgeNodeId}/NBIRTH`;
    console.log("Publishing NBIRTH message to topic:", birthTopic);
    await publishMessage(birthTopic, encodedBirth);
    console.log("NBIRTH message published");

    // Create DDATA payload
    var dataPayload = {
        "timestamp": new Date().getTime(),
        "metrics": [
            {
                "name": "intMetric",
                "value": {
                    "intValue": 1
                },
                "type": "Int32"
            }
        ],
        "seq": 1 // Add sequence number
    };

    var encodedData = sparkplug.encodePayload(dataPayload);
    const dataTopic = `spBv1.0/${config.groupId}/${config.edgeNodeId}/${config.deviceId}/DDATA`;
    console.log("Publishing DDATA message to topic:", dataTopic);
    await publishMessage(dataTopic, encodedData);
    console.log("DDATA message published");
}

main().catch(err => console.error(err));