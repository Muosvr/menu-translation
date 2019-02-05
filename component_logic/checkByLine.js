// Check if the parsed content is divided up by blocks of text
// correctly, if not, set byLine to true so createCard will
// generate one card per line found in menu

const checkByLine = parsed => {
  const maxSingleItemLength = 4; // Set max number of lines allowed for each card before switching to generate cards by line
  const result = parsed.filter(item => {
    if (Object.keys(item).length > maxSingleItemLength) {
      return true;
    }
  });
  // if no item found to have excceed max length, don't generate cards line by line otherwise generate line by line
  if (result.length < 1) {
    return false;
  } else {
    return true;
  }
  console.log(result);
};

module.exports = checkByLine;
