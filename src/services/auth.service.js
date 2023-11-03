import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config/config.js";
import UserContainer from "../dao/mongoDB/userContainer.js";
import userModel from "../dao/mongoDB/models/user.model.js";
import CartService from '../services/cart.service.js'

const cartService = new CartService();

class AuthService {
    constructor() {
        this.userContainer = new UserContainer();
        this.secretKey = JWT_KEY;
    };

    async login(email, password) {
        const user = await this.userContainer.login(email, password);
        if (!user) {
            return null;
        }
        const token = jwt.sign({ id: user._id, email: user.email, rol: user.rol }, this.secretKey, { expiresIn: '10h' });
        return { user, token }
    };

    async githubCallback(profile) {
        try {
            if (!profile || !profile._json) {
                throw new Error("La informacion de perfil esta incompleta");
            }
            if (!profile._json.email) {
                profile._json.email = 'sinemail@ejemplo.com';
            }
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                user = await userModel.create({
                    first_name: profile._json.name || "GitHubUser",
                    last_name: "",
                    email: profile._json.email,
                    age: 99,
                    password: "",
                    rol: "user",
                    admin: false,
                    cart: await cartService.createCart()
                })
            }
            return user;
        } catch (error) {
            console.error("Ocurrio un error", error);
            throw error;
        };
    };

    async googleCallback(req, res) {
        const user = req.user;
        req.session.user = {
            id: user._id,
            email: user.email,
            rol: user.rol,
            admin: false,
            cart: await cartService.createCart()
        };
        res.send({ status: "success", message: "Logueado con Google!" })
    };
};

export default AuthService;