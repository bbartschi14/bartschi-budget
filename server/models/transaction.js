import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  uuid: String,
  user: String,
  name: String,
  amount: Number,
  category: String,
  date: String,
});

// compile model from schema
export default mongoose.model("transaction", TransactionSchema);
