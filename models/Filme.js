const con = require('./con');

const Filme = con.sequelize.define('filmeseries', {

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
    data: {
        type: con.Sequelize.INTEGER,
        allowNull: false		
    },
    tipo:{
        type: con.Sequelize.INTEGER,
        allowNull: false	
    },
	categoria: {
        type: con.Sequelize.STRING,
        allowNull: false		
	},
    faixaetaria: {
        type: con.Sequelize.INTEGER,
        allowNull: false 
    },
    netflix:{
        type: con.Sequelize.BOOLEAN,
    },
    prime:{
        type: con.Sequelize.BOOLEAN,
    },
    globo:{
        type: con.Sequelize.BOOLEAN,
    },
    img:{
        type: con.Sequelize.STRING
    },
    nota: {
        type: con.Sequelize.DOUBLE
    },
    idUser:{
        type: con.Sequelize.INTEGER
    },
    idCommmit: {
        type: con.Sequelize.INTEGER
    }
})
module.exports = Filme;
//Filme.sync({force:true})
