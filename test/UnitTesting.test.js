import UserDAO from '../src/dao/mongo/UserDAO.js';
import mongoose from 'mongoose';
import { strict as assert } from 'assert';

mongoose.connect('mongodb+srv://carloscogliandro:backendcarlos@cluster0.ng7biv3.mongodb.net/ecommerce?retryWrites=true&w=majority');
const userService = new UserDAO();

describe('Tests generales del DAO de usuarios', () => {

    describe('Pruebas de Get', () => {
        it('El DAO debe obtener a los usuarios en formato de Array', async function () {
            const result = await userService.getUsers();
            assert.ok(result);
            assert.strictEqual(Array.isArray(result), true);
        });
    })

    describe('Pruebas de Escritura', () => {
        before(async function () {
            await userService.drop();
        })
        it('El DAO debe poder insertar un usuario correctamente', async function () {
            const mockUser = {
                first_name: 'TestUser',
                last_name: 'User',
                email: 'TestUser@user.com',
                password: '123'
            };

            const result = await userService.createUser(mockUser);
            assert.ok(result._id);
        })
    })

});