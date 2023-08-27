const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = 8000;
const db = require("./config/mongoose");

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require("./routes");
app.use("/", routes);

app.listen(port, () => {
  console.log("server is running at port: ", port);
});
