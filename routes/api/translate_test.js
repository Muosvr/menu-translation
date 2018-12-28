const express = require("express");
const translate = require("../../googleAPI/translate");

const router = express.Router();

router.get("/", (req, res) => {
  translate("The Graduate", "zh-CN")
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
