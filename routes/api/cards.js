const express = require("express");
const annotateImage = require("../../googleAPI/annotateImage");
const parseOCRAnnotation = require("../../utils/parseOCRAnnotation");
const createCards = require("../../component_logic/createCards");

const router = express.Router();

// Testing
const testUrl =
  "https://www.thechurch.ie/wp-content/uploads/2018/03/Evening-Menu2018.jpg";

router.get("/", (req, res) => {
  annotateImage(testUrl, "DOCUMENT_TEXT_DETECTION")
    .then(detection => {
      return parseAnnotation(detection);
    })
    .then(parsed => {
      createCards(parsed, false, "zh-CN").then(cards => {
        res.json({ cards: cards });
      });
    });
});

module.exports = router;
