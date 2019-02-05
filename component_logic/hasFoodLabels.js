// check if labels contain the word food or drink
// @param collection {string[[]]} - nested array of strings containing labels for images
// returns {boot}
const hasFoodLabels = collection => {
  tolerance = 0.4;
  var foodVote = 0;
  foodIndex = [];

  // Filter out bad image links
  collection = collection.filter(labels => {
    return labels[0] != "No labels found";
  });

  collection.forEach((set, index) => {
    const joinedSet = set.join(" ");
    if (joinedSet.includes("food") || joinedSet.includes("drink")) {
      foodIndex.push(index);
      foodVote++;
    }
  });

  if (foodVote / collection.length >= tolerance) {
    return foodIndex;
  } else {
    return false;
  }
};

module.exports = hasFoodLabels;
