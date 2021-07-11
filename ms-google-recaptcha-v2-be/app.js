const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const index = require("./routes/index");
const cors = require("cors");
const bodyParser = require("body-parser");
const BRANDNAME = process.env.BRAND_NAME;
const app = express();
app.use(cors());
app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8097;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(function (err, req, res, next) {
  try {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    console.error(res.locals.error);
    res.status(err.status || 500);
  } catch (e) {
    console.error(e);
  }
});

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/app", index);

app.use("/health", function (req, res) {
  res.status(200).json({
    success: true,
    message: `${BRANDNAME} ms-${BRANDNAME}-emailer API v1.0`,
  });
});

app.listen(PORT, () => {
  console.log("Server started on port:", PORT);
});

module.exports = app;
