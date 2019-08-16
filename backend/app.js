const express = require("express");
const path = require("path");
const quiz = require("./routes/quizbe");

const port = process.env.PORT || 9000;
const app = express();

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

app.use(express.static(path.join(__dirname, "..", "/frontend/build")));

app.get("/", (req, res) => {
  console.log(path.join(__dirname, "..", "/frontend/build"));
});

quiz(app);
