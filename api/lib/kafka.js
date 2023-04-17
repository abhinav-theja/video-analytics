// kafka connection
const kafka = require('kafka-node');

const { detectObjects } = require('./detectImage');
const client = new kafka.KafkaClient({kafkaHost: 'localhost:29092'});
const producer = new kafka.Producer(client);
const Consumer = kafka.Consumer;
// // create kafka topic test
// const topicsToCreate = [
//     {
//         topic: 'items',
//         partitions: 1,
//         replicationFactor: 1
//     }
// ];

// client.createTopics(topicsToCreate, (error, result) => {
//     console.log("createTopics", error, result);
// });
const consumer = new Consumer(
    client,
    [
        {topic: 'items', partition: 0}
    ],
    {
        autoCommit: true
    }
);

// check connection to kafka
client.on('ready', function () {
    console.log('Kafka is connected');
});


consumer.on('message', function (message) {
    try {
        let obj = JSON.parse(message.value);
        console.log(detectObjects(obj.thumbnail,obj._id));   
        
    } catch (error) {
        console.log(error);
    }
});

module.exports = {
    producer,
    consumer
};