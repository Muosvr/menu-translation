const express = require("express");
const translate = require("../../googleAPI/translate");

const router = express.Router();

// Testing word
const text = "The Graduate";
const language = "zh-CH";

router.get("/", (req, res) => {
  translate(text, language, req.get("host"))
    .then(response => {
      res.json({ ["The translation of " + "'" + text + "'" + "is"]: response });
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
