const con = require('./con');
const Users = con.sequelize.define('users', {

    id: {
        type: con.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
	},
	nome: {
        type: con.Sequelize.STRING,
        allowNull: false
	},
    email: {
        type: con.Sequelize.STRING,
        allowNull: false
    },
    user:{
        type: con.Sequelize.STRING,
        allowNull: false
    },
    passw: {
        type: con.Sequelize.STRING,
        allowNull: false
    },
    idAdmin: {
        type: con.Sequelize.INTEGER
    },
    imgPerfil: {
        type: con.Sequelize.STRING
    }
})

module.exports = Users;
//Users.sync({force:true}) 
