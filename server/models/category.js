const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  uuid: String,
  name: String,
  monthlyBudget: Number,
  color: String,
});

// compile model from schema
module.exports = mongoose.model("category", CategorySchema);
