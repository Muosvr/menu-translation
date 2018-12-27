const express = require("express");
const annotateImage = require("../../googleAPI/annotateImage");
const parseOCRAnnotation = require("../../utils/parseOCRAnnotation");
const createCards = require("../../component_logic/createCards");

const router = express.Router();

// Testing
const testUrl =
  "https://www.thechurch.ie/wp-content/uploads/2018/03/Evening-Menu2018.jpg";

// @route GET /cards
// @desc Create cards
// @access Public
router.get("/", (req, res) => {
  annotateImage(testUrl, "DOCUMENT_TEXT_DETECTION")
    .then(detection => {
      return parseOCRAnnotation(detection);
    })
    .then(parsed => {
      createCards(parsed, false, "zh-CN").then(cards => {
        res.json({ cards: cards });
      });
    });
});

// @route POST /cards/image
// @desc Create cards
// @access Public
router.post("/image", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded");
  }
  const file = req.files.image;
  file.mv("./test_images/uploaded_file.jpg", err => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send("File uploaded!");
  });
  // const image = req;
  // console.log(image);
  // res.json("uploaded");
});

module.exports = router;
