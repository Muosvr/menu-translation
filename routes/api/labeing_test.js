const express = require("express");
const batchAnnotateImages = require("../../googleAPI/batchAnnotateImages");
const router = express.Router();

urls = [
  "https://www.thechurch.ie/wp-content/uploads/2018/03/Evening-Menu2018.jpg",
  "https://img.huffingtonpost.com/asset/585be1aa1600002400bdf2a6.jpeg",
  "https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/one_pot_chorizo_and_15611_16x9.jpg"
];

router.get("/", (req, res) => {
  batchAnnotateImages(urls, "LABEL_DETECTION").then(response => {
    res.json(response);
  });
});
module.exports = router;
