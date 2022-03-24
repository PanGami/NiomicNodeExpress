// Set Up Connection to Mongodb
const mongoose = require("mongoose");

const mongoDB = "mongodb://localhost/firstApp";

mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,    
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

module.exports = mongoose;
