const express = require("express");
const translate = require("../../googleAPI/translate");

const router = express.Router();

router.get("/", (req, res) => {
  translate("Hello world", "zh-CN").then(response => {
    res.json(response[0]);
  });
});

module.exports = router;
