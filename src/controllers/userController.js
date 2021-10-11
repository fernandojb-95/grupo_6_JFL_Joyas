const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../data/users.json');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const userController = {
    login: (req, res) => {
        res.render('./users/login');
    },
    register: (req, res) => {
        res.render('./users/register');
    },
    procesarRegistro: (req,res)=> {

        //Logica para validar los campos recibidos
        let errors = validationResult(req);

        if(errors.isEmpty()){
            //Lógica para almacenar usuarios nuevos
            const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
            const userName = req.body.user,
            lastNameUser = req.body.lastname,
            email = req.body.email,
            userImage = req.files[0].filename;
            password = bcrypt.hashSync(req.body.password,10);

            //Condicion para diferenciar usuarios o administradores
            email.search('@jflbisuteria.com.mx') != -1 ? category = "admin" : category = "user";

                //Creamos el JSON con los datos del nuevo usuario
                const newUser ={
                    id: users[users.length -1].id + 1,
                    first_name: userName,
                    last_name: lastNameUser,
                    email: email,
                    password: password,
                    category: category,
                    image: userImage
                }

                users.push(newUser);

                //Reescribiendo usuarios
                fs.writeFileSync(usersPath, JSON.stringify(users, null, ' '));

                res.redirect('/');
        }
        else{
            res.render('./users/register',{errors: errors.array(),old:req.body});
        }

    },
    logUser: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        const users = JSON.parse(fs.readFileSync(usersPath,'utf-8')); 
        const user = users.find(user => user.email == email);
        if(user === undefined || user.password != password){
            res.render('./users/login', {msg: 'Tu correo o tu contraseña son incorrectos'})
        }
        else {
            req.session.user = user;
            res.redirect('/');
        }
    },
    profile: (req,res) => {
        res.render('./users/profile');
    }
}
module.exports = userController;