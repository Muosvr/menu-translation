const express = require("express");
const translate = require("../../googleAPI/translate");

const router = express.Router();

router.get("/", (req, res) => {
  translate("APPETISERS  LIGHT BITES", "zh-CN").then(response => {
    res.json(response);
  });
});

module.exports = router;
