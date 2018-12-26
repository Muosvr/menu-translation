const express = require("express");
const app = express();
const main = require("./routes/api/main");

app.get("/", (req, res) => res.send("Hello!!!"));
app.use("/main", main);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
