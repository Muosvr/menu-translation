const express = require("express");
const router = express.Router();
const vision = require("@google-cloud/vision");
const parseOCRAnnotation = require("../../utils/parseOCRAnnotation");
const imageOCR = require("../../googleAPI/imageOCR");

// @route GET /main
// @desc main interface
// @access Public
router.post("/", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded");
  }
  // to access the file use req.files.input_name_from_form_data
  const file = req.files.image.data;

  // Conver to base64 encoding
  const base64Image = Buffer.from(file).toString("base64");

  imageOCR(base64Image, "DOCUMENT_TEXT_DETECTION", req.get("host"))
    .then(response => {
      // const parsedText = parseOCRAnnotation(response);
      res.json(parseOCRAnnotation(response));
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
