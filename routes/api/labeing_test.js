const express = require("express");
const getImageLabels = require("../../component_logic/getImageLabels");
const batchAnnotateImages = require("../../googleAPI/batchAnnotateImages");

const router = express.Router();

// urls = [
//   "https://www.thechurch.ie/wp-content/uploads/2018/03/Evening-Menu2018.jpg",
//   "https://img.huffingtonpost.com/asset/585be1aa1600002400bdf2a6.jpeg",
//   "https://ichef.bbci.co.uk/food/ic/food_16x9_832/recipes/one_pot_chorizo_and_15611_16x9.jpg"
// ];
urls = [
  "https://iconpolystudio.com/wp-content/uploads/2017/07/Replica-Mueller-Improved-Fire-Hydrant.png"
];

// @route GET /label
router.get("/", (req, res) => {
  // batchAnnotateImages(urls, "LABEL_DETECTION", req.get("host")).then(
  //   response => {
  //     res.json(response);
  //   }
  // );
  getImageLabels(urls, req.get("host"))
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      console.log(err);
    });
});
module.exports = router;
