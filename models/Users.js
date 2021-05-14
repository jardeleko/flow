const con = require('./con');
const Users = con.sequelize.define('users', {

    id: {
        type: con.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false		
	},
	nome: {
        type: con.Sequelize.STRING,
        allowNull: false
	},
    email: {
        type: con.Sequelize.STRING,
        allowNull: false

    },
    username:{
        type: con.Sequelize.STRING,
        allowNull: false

    },
    senha: {
        type: con.Sequelize.STRING,
        allowNull: false
    },
    idAv: {
        type: con.Sequelize.INTEGER,
        allowNull: false
    },
    idAdmin: {
        type: con.Sequelize.INTEGER,
        allowNull: false
    }

})
module.exports = Users;
//Users.sync({force:true})
