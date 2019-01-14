// check if labels contain the word food
// @param collection {string[[]]} - nested array of strings containing labels for images
// returns {boot}
const hasFoodLabels = collection => {
  tolerance = 0.6;
  var foodVote = 0;
  foodIndex = [];
  collection.forEach((set, index) => {
    const joinedSet = set.join(" ");
    if (joinedSet.includes("food") || joinedSet.includes("drink")) {
      foodIndex.push(index);
      foodVote++;
    }
  });

  if (foodVote / collection.length >= tolerance) {
    // console.log("Food");
    return foodIndex;
  } else {
    // console.log("Not Food");
    return false;
  }
};

module.exports = hasFoodLabels;
