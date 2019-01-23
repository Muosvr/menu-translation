const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const SearchSchema = new Schema({
  keywords: {
    type: String,
    required: true
  },
  images: [
    {
      url: {
        type: String
      }
    }
  ],
  isFood: {
    type: Boolean,
    required: true
  }
});

module.exports = Search = mongoose.model("searchs", SearchSchema);
