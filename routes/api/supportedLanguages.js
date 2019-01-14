const express = require("express");
const getSupportedLanguages = require("../../googleAPI/getSupportedLanguages");

const router = express.Router();

// @route GET /suppoertedLanguages
router.get("/", (req, res) => {
  getSupportedLanguages(req.get("host"))
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
