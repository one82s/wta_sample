require("dotenv").config();

const mongoose = require("mongoose");

const uri = process.env.CONNECTIONSTRING;

mongoose.connect(process.env.CONNECTIONSTRING);

const connect = mongoose.connection;

connect.on("error", console.error.bind(console, "MongoDB connection error:"));

connect.once("open", () => {
  console.log("Connected to MongoDB");
});

const namesSchema = new mongoose.Schema({
  name: String,
  gender: String,
  count: Number,
  probability: mongoose.Schema.Types.Decimal128,
});

namesSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.probability = ret.probability.toString();
    return ret;
  },
});

module.exports.nameSchema = mongoose.model("names", namesSchema);
