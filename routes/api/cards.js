const express = require("express");
const imageOCR = require("../../googleAPI/imageOCR");
const parseOCRAnnotation = require("../../utils/parseOCRAnnotation");
const createCards = require("../../component_logic/createCards");
const fs = require("fs");

const router = express.Router();

// @route POST /cards/image
// @desc Create cards from blocks of text as recognized by Google annotator
// @access Public
router.post("/image", (req, res) => {
  // byLine is false, process image by blocks
  const byLine = false;

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded");
  }
  // to access the file use req.files.input_name_from_form_data
  const file = req.files.image.data;

  // Conver to base64 encoding
  const base64Image = Buffer.from(file).toString("base64");

  imageOCR(base64Image, "DOCUMENT_TEXT_DETECTION", req.get("host"))
    .then(annotation => {
      return parseOCRAnnotation(annotation);
    })
    .then(parsed => {
      createCards(parsed, byLine, "zh-CN", req.get("host")).then(cards => {
        res.json({ cards: cards });
      });
    })
    .catch(err => {
      res.json("error:", err);
    });
});

// @route POST /cards/imageByLine
// @desc Create card for each new line
// @access Public
router.post("/imageByLine", (req, res) => {
  // Setting byLine parameter to true, process image line by line
  const byLine = true;

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded");
  }
  // to access the file use req.files.input_name_from_form_data
  const file = req.files.image.data;

  // Conver to base64 encoding
  const base64Image = Buffer.from(file).toString("base64");

  imageOCR(base64Image, "DOCUMENT_TEXT_DETECTION", req.get("host"))
    .then(annotation => {
      return parseOCRAnnotation(annotation);
    })
    .then(parsed => {
      createCards(parsed, byLine, "zh-CN", req.get("host")).then(cards => {
        res.json({ cards: cards });
      });
    })
    .catch(err => {
      res.json("error:", err);
    });
});

module.exports = router;
