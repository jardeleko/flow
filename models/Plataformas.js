const con = require('./con')

const Plataformas = con.sequelize.define('plataformas',{
    id: {
        type: con.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    netflix: {
        type: con.Sequelize.BOOLEAN
    },
    primevideos:{
        type: con.Sequelize.BOOLEAN
    },
    gbplay:{
        type: con.Sequelize.BOOLEAN
    }
})

//module.exports = Plataformas;
//Plataformas.sync({force:true});