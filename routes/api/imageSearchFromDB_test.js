const express = require("express");
const searchImageFromDB = require("../../component_logic/searchImageFromDB");

const router = express.Router();

// @route GET /search
router.get("/:keyword", (req, res) => {
  // Get result from DB
  searchImageFromDB(req.params.keyword)
    .then(images => {
      res.json(images);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
