import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    admin: { type: Boolean, required: true, default: false, },
});

userSchema.pre('find', function (next) {
    this.populate("cart.cartId");
    next();
  });

const usersModel = mongoose.model("users", userSchema);

export default usersModel;