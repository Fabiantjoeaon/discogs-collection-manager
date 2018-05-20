const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const helmet = require("helmet");
const errorHandlers = require("./helpers/errorHandlers");
const { getCamelotIndex, getKey } = require("./helpers/camelotWheel");

const routes = require("./routes");

const app = express();

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.locals.getCamelotIndex = getCamelotIndex;
    res.locals.getKey = getKey;
    next();
});

app.use(routes);

if (app.get("env") === "development") {
    /* Development Error Handler - Prints stack trace */
    app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
