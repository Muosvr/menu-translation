const express = require("express");
const translate = require("../../googleAPI/translate");

const router = express.Router();

// Testing word
const text = "牛肉面";
const language = "en";

router.get("/:language", (req, res) => {
  translate(text, req.params.language, req.get("host"))
    .then(response => {
      res.json({ ["The translation of " + "'" + text + "'" + "is"]: response });
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
