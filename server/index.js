const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const quizRoutes = require("./routes/quiz");
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));





const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/quiz", quizRoutes);

app.get("/hello", (rqe, res) => {
  res.json({ message: "Hello World" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
