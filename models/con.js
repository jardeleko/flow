const Sequelize = require('sequelize');
const sequelize = new Sequelize('flow', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};

sequelize.authenticate().then(function(){
console.log("conectado com sucesso!")
}).catch(function(erro){
catchonsole.log("Falha ao se conectar! " + erro)
}) 
