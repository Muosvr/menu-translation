const express = require("express");
const fileUpload = require("express-fileupload");
const cards = require("./routes/api/cards");
const path = require("path");
const mongoose = require("mongoose");

// DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const app = express();

// initiate fileUpload middleware
app.use(fileUpload());

// initiate test routes
const ocr_test = require("./routes/api/ocr_test");
const imageSearch_test = require("./routes/api/imageSearch_test");
const translate_test = require("./routes/api/translate_test");
const labeling_test = require("./routes/api/labeing_test");
const getSupportedLanguages = require("./routes/api/supportedLanguages");
const imageSearchFromDB_test = require("./routes/api/imageSearchFromDB_test");

// Server static assets if in production
// ToDo: refactoring
try {
  if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }
} catch (err) {
  console.log("dev env detected");
}

// Testing routes
app.get("/", (req, res) => res.send("Hello!!!"));
app.use("/search", imageSearch_test);
app.use("/ocr", ocr_test);
app.use("/translate", translate_test);
app.use("/label", labeling_test);
app.use("/supportedLanguages", getSupportedLanguages);
app.use("/searchDB", imageSearchFromDB_test);

// Get cards
app.use("/cards", cards);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
