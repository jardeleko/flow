const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
//include users
const Users = require("../models/Users")

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'username', passwordField: 'senha'}, (username, senha, done) => {
       
        Users.findOne({
           where:{
                username: [username]
            }}).then((user) => {

                if(!user) {
                    return done(null, false, {message: "Usuario não encontrado"})
                }
        
                bcrypt.compare(senha, user.senha, (err, login) => {
                    if(login){
                        return done(null, user)
                    }
                    else{
                        return done(null, false, {message: "senha errada"})
                    }
                })
                
            })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
     
    });
    // deserialize user 
    passport.deserializeUser(function(id, done) {
    Users.findByPk(id).then(function(user) {
 
        if (user) {
            done(null, user.get());
 
        } else {
            done(user.errors, null);
 
        }
 
      });
 
    });

}