const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");

//Import Routes
const userRoute = require("./Routes/UserRoute");
const studentRoute = require("./Routes/StudentRoute");

//Everytime we visit /posts -> it will move to posts route.
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/student", studentRoute);

//Connect to database
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true},
  (err) => {
    if(err) console.log(err) 
    else console.log("mongdb is connected");
   }
);

//Start listening to server.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
