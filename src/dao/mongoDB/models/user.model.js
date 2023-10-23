import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    avatar: { type: String},
    age: Number,
    password: String,
    cart: { type: String, ref: "carts" },
    rol: { type: String, default: 'user'},
});

const usersModel = mongoose.model("users", userSchema);

export default usersModel;