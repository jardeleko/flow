const con = require('./con');

const Avaliacao = con.sequelize.define('avaliacao', {
    id: {
        type: con.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false		
	},
	idUser: {
        type: con.Sequelize.INTEGER
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
