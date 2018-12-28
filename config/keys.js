try {
  if (proccess.env.NODE_ENV === "production") {
    // Set static folder
    module.exports = require("./keys_prod");
  } else {
    onsole.log("dev env detected");
    module.exports = require("./keys_dev");
  }
} catch (err) {
  console.log("dev env detected");
  module.exports = require("./keys_dev");
}
