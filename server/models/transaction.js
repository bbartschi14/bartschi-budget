const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  uuid: String,
  name: String,
  amount: Number,
  category: String,
  date: String,
});

// compile model from schema
module.exports = mongoose.model("transaction", TransactionSchema);
