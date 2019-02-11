const express = require("express");
const searchImage = require("../../googleAPI/searchImage");
const saveImageSearch = require("../../component_logic/saveImageSearch");
const searchImageFromDB = require("../../component_logic/searchImageFromDB");

const router = express.Router();

// @route GET /search/:keyword
router.get("/:keyword", (req, res) => {
  // Save result to DB
  searchImage(req.params.keyword, 10, req.get("host")).then(response => {
    // saveImageSearch(req.params.keyword, response, true);
    res.json({ msg: response });
  });
});

module.exports = router;
