const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const routes = require("./Routes/routes");
const ForgotPasswordRoutes = require("./Routes/ForgotPasswordRoutes");

const PORT = 8000;

const app = express();

const MONGO_URI =
  "mongodb+srv://iamfaridullah:srwatson33@cluster0.u6woc.mongodb.net/InternProjectDB?retryWrites=true&w=majority";

app.use(cors());
app.use(bodyParser.json());

//ROUTES
app.use(ForgotPasswordRoutes);
app.use(routes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening for requests on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database.");
  });
