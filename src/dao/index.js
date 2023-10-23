// import mongoose from "mongoose";
// import { MONGO_URL } from '../config/config.js';

// const persistence = "MONGO";

// export let usersService;
// export let productsService;
// export let cartsService;
// // export let ticketsService;
// // export let historiesService;

// switch (persistence) {

//     case 'FILESYSTEM':
//         const { default: FSUser } = await import('./fs/UsersContainer.js');
//         const { default: FSProducts } = await import('./fs/productContainer.js');
//         const { default: FSCart } = await import('./fs/cartContainer.js');

//         usersService = new FSUser();
//         productsService = new FSProducts();
//         cartsService = new FSCart();
//         break;

//     case 'MONGO':
//         mongoose.set('strictQuery', false)
//         const connection = mongoose.connect(MONGO_URL, ({
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         }))

//         const { default: mongoUsers } = await import('./mongoDB/userContainer.js');
//         const { default: mongoProducts } = await import('./mongoDB/productContainer.js');
//         const { default: mongoCarts } = await import('./mongoDB/cartContainer.js');
//         const { default: mongoMessages } = await import('./mongoDB/messagesContainer.js');
//         // const { default: mongoTickets } = await import('./mongoDB/ticketsContainer.js');
//         // const { default: mongoHistories } = await import('./mongoDB/historiesContainer.js');

//         usersService = new mongoUsers();
//         productsService = new mongoProducts();
//         cartsService = new mongoCarts();
//         messagesService = new mongoMessages();
//         // ticketsService = new mongoTickets();
//         // historiesService = new mongoHistories();
//         break;
// };