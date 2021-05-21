const con = require('./con');

const Avaliacao = con.sequelize.define('avaliacao', {
    id: {
        type: con.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
	},
    nomeUser: {
        type: con.Sequelize.STRING,
        allowNull: false
    },
	idUser: {
        type: con.Sequelize.INTEGER,
        allowNull: false
	},
    imgUser:{
        type: con.Sequelize.STRING
    },
    nota: {
        type: con.Sequelize.DOUBLE
    },
    comentario:{
        type: con.Sequelize.STRING
    },
    idFilm: {
        type: con.Sequelize.INTEGER
    },
    createdAt:{
        type: con.Sequelize.DATE
    }

})
module.exports = Avaliacao;
//Avaliacao.sync({force:true})
