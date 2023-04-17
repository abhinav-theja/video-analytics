const fs = require("fs");
const tf = require("@tensorflow/tfjs-node");
const cocoSsd = require("@tensorflow-models/coco-ssd");
const getClient = require("../lib/db");
const { ObjectId } = require("mongodb");

async function detectObjects(imagePath, _id) {
  try {
    // Load the COCO-SSD model.
    const model = await cocoSsd.load();

    // Read the image file and decode it.
    const imageBuffer = fs.readFileSync(
      "/var/project/api/public/thumbnails/" + imagePath
    );
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);

    // Run the model on the image tensor.
    const predictions = await model.detect(imageTensor);

    // Dispose the image tensor to release memory.
    imageTensor.dispose();

    // Print the predictions.
    console.log("Predictions:", JSON.stringify(predictions, null, 2));

    // insert predictions into db
    const client = await getClient();
    const collection = client.collection("items");

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { predictions: predictions,
        updatedAt: new Date()
      } }
    );


    return predictions;
  } catch (error) {
    console.log(error);
  }
}

exports.detectObjects = detectObjects;
