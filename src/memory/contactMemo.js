class ContactsMemo {
    constructor(){
        this.contacts = []
    };

    get =()=>{
        return this.contacts;
    };

    push (name, lastname, email, age, avatar, password, phone){
        let contact = {name, lastname, email, age, avatar, password, phone};
        this.contacts.push(contact);
        return contact;
    };

    edit (email, contact){
        let contactDB = this.contacts.find(item => item.email === email);
        contactDB.name =contact.first_name;
        contactDB.lastname = contact.last_name;
        contactDB.email = contact.email;
        contactDB.age = contact.age;
        contactDB.avatar = contact.avatar;
        contactDB.phone= contact.phone;
        contactDB.password = contact.password;
        return contactDB;
    };

    delete (email){
        this.contacts = this.contacts.filter(item => item.email !== email);
        return this.contacts;
    };
};

export default ContactsMemo;