import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
});

// compile model from schema
export default mongoose.model("user", UserSchema);
