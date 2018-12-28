const express = require("express");
const searchImage = require("../../googleAPI/searchImage");

const router = express.Router();

router.get("/", (req, res) => {
  searchImage("burger", 5, req.get("host")).then(response => {
    res.json({ msg: response });
  });
});

module.exports = router;
