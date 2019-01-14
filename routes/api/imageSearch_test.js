const express = require("express");
const searchImage = require("../../googleAPI/searchImage");

const router = express.Router();

// @route GET /search
router.get("/", (req, res) => {
  searchImage("炒花蟹", 10, req.get("host")).then(response => {
    res.json({ msg: response });
  });
});

module.exports = router;
