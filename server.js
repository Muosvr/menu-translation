const express = require("express");
const app = express();

const cards = require("./routes/api/cards");

// initiate test routes
const annotation_test = require("./routes/api/annotation_test");
const imageSearch_test = require("./routes/api/imageSearch_test");
const translate_test = require("./routes/api/translate_test");
const labeling_test = require("./routes/api/labeing_test");

// Testing routes
app.get("/", (req, res) => res.send("Hello!!!"));
app.use("/search", imageSearch_test);
app.use("/annotate", annotation_test);
app.use("/translate", translate_test);
app.use("/label", labeling_test);

// Get cards
app.use("/cards", cards);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
