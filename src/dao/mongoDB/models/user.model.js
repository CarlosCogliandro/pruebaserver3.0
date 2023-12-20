import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  avatar: { type: String },
  age: Number,
  phone: Number,
  address: String,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  rol: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  documents: [{
    name: { type: String, unique: true, },
    reference: String,
    status: { type: String, default: "Pending", },
  }],
  last_connection: Date,
});

const usersModel = mongoose.model("users", userSchema);

export default usersModel;