const express = require("express");
const router = express.Router();
const vision = require("@google-cloud/vision");

// Set request options
const request = {
  image: {
    source: {
      imageUri:
        "https://www.thechurch.ie/wp-content/uploads/2018/03/Evening-Menu2018.jpg"
    }
  },
  features: [{ type: "DOCUMENT_TEXT_DETECTION" }]
};

// Creates a client
const client = new vision.ImageAnnotatorClient();

// Annotate image
async function detect() {
  const result = await client.annotateImage(request);
  return result;
}

// @route GET /main
// @desc main interface
// @access Public
router.get("/", (req, res) => {
  detect().then(detection => {
    res.json({ msg: detection[0]["fullTextAnnotation"]["pages"][0]["blocks"] });
  });
  // console.log("Some where else");
});

module.exports = router;
