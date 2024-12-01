const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({
  name: String,
  description: String,
  uploadDate: Date,
  url: String,
});

const Model = mongoose.model("3DModel", modelSchema);

module.exports = Model;
