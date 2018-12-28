try {
  if (process.env.NODE_ENV === "production") {
    // Set static folder
    module.exports = require("./keys_prod");
    console.log("production environment detected");
  } else {
    console.log("dev env detected");
    module.exports = require("./keys_dev");
  }
} catch (err) {
  console.log("dev env detected");
  module.exports = require("./keys_dev");
}
