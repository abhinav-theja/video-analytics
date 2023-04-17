var express = require("express");
var router = express.Router();
const getClient = require("../lib/db");
const { ObjectId } = require("mongodb");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const { producer } = require("../lib/kafka");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

router.get("/", async (req, res) => {
  try {
    const client = await getClient();
    const collection = client.collection("items");

    const items = await collection.find().toArray();

    return res.json(items);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/",
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      const { name, description } = req.body;

      const thumbnail_name = `thumbnail-${req.file.filename.replace(
        ".mp4",
        ""
      )}.png`;
      let screenshot_names = [];
      let promise = new Promise((resolve, reject) => {
        ffmpeg(path.join(__dirname, "..", "public", req.file.filename))
          .screenshots({
            timestamps: [30.5, "50%", "01:10.123"],
            filename: thumbnail_name,
            folder: path.join(__dirname, "..", "public", "thumbnails"),
            size: "320x240",
          })
          .on("end", function () {
            console.log("Screenshots taken");
          })
          // get screenshot name
          .on("filenames", function (filenames) {
            console.log("Will generate " + filenames.join(", "));
            screenshot_names = filenames;
            setTimeout(() => {
              (async () => {
                const client = await getClient();
                const collection = client.collection("items");

                const result = await collection.insertOne({
                  name,
                  description,
                  image: req.file.filename,
                  thumbnail: thumbnail_name.replace(".png", "_1.png"),
                  created_at: new Date(),
                });
                producer.send(
                  [
                    {
                      topic: "items",
                      messages: [
                        JSON.stringify({
                          _id: result.insertedId,
                          name,
                          description,
                          image: req.file.filename,
                          thumbnail: screenshot_names[0],
                        }),
                      ],
                    },
                  ],
                  (err, data) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(data);
                    }
                  }
                );
              })();
            }, 4000);
          })
          .on("error", function (err) {
            console.error(err);
          });
      });

      return res.json({ message: "File uploaded successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// delete all items
router.delete("/", async (req, res) => {
  try {
    const client = await getClient();
    const collection = client.collection("items");

    await collection.deleteMany({});
    return res.json({ message: "All items deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const client = await getClient();
    const collection = client.collection("items");

    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
