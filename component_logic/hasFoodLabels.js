// check if labels contain the word food
// @param collection {string[[]]} - nested array of strings containing labels for images
// returns {boot}
const hasFoodLabels = collection => {
  tolerance = 0.6;
  var foodVote = 0;
  collection.forEach(set => {
    if (set.join(" ").includes("food")) {
      foodVote++;
    }
  });

  if (foodVote / collection.length >= tolerance) {
    // console.log("Food");
    return true;
  } else {
    // console.log("Not Food");
    return false;
  }
};

module.exports = hasFoodLabels;
