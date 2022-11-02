import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  uuid: String,
  name: String,
  monthlyBudget: Number,
  color: String,
  type: String,
});

// compile model from schema
export default mongoose.model("category", CategorySchema);
