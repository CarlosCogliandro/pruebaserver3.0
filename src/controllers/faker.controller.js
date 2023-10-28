import { faker } from "@faker-js/faker";

export const fakeUser = (req, res) => {
    let first_name = faker.person.firstName();
    let last_name = faker.person.lastName();
    let email = faker.internet.email();
    let age = faker.number.numeric(2);
    let phone = faker.number.numeric(8);
    let password = faker.internet.password();
    res.send({
        first_name,
        last_name,
        email,
        age,
        phone,
        password
    });
};