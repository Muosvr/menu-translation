const express = require("express");
const router = express.Router();
const vision = require("@google-cloud/vision");
const parseOCRAnnotation = require("../../utils/parseOCRAnnotation");
const annotateImage = require("../../googleAPI/annotateImage");

// Testing
const testUrl =
  "https://www.thechurch.ie/wp-content/uploads/2018/03/Evening-Menu2018.jpg";

// @route GET /main
// @desc main interface
// @access Public
router.get("/", (req, res) => {
  annotateImage(testUrl, "DOCUMENT_TEXT_DETECTION").then(detection => {
    const parsedText = parseOCRAnnotation(detection);
    res.json({ msg: parsedText[3] });
  });
});

module.exports = router;
