const express = require('express')
const router = express()
const Filme = require("../models/Filme")
const multer = require('multer')
const multerConfig = require("../config/multer")
const uploads = multer(multerConfig)
const methodOverride = require("method-override")
const session = require('express-session')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
	router.use(methodOverride('_method'))

	//atual bodyparser
	router.use(express.urlencoded({extended: true}))
	router.use(express.json())

router.use(flash())
router.use(session({
	secret:'smartsky',
	resave: true,
	saveUninitialized: true
}));

//função para inicio de validação com node javascript 
router.use(function(req, res, next)  {
	res.locals.success_msg = req.flash("success_msg") //insere mensagens de sucesso geradas no array erros em uma variavel local na pagina html
	res.locals.error_msg = req.flash("error_msg") //   msg de error atribuidas no locals do html 
	res.locals.error = req.flash("error")
	res.locals.users = req.user || null
	next() //atualiza pagina
})	


router.get('/', (req, res) => { 
		res.render('index')
})

router.post('/addfilm', uploads.single('send_img'), (req, res) => {
	let erros = []
	let tmpTipo


	if(!req.body.filme || req.body.filme == null || req.body.filme === undefined)
		tmpTipo = req.body.serie
	else 
		tmpTipo = req.body.filme

	if(!req.body.amazon)
		var aprime = 0;
	else 
		aprime = 1;
	if(!req.body.globo)
		var gplay = 0;
	else 
		gplay = 1;

	if(!req.body.netflix)
		var netflix = 0;
	else 
		netflix = 1;

	
	if(!req.body.titulo || req.body.titulo == undefined || req.body.titulo == null)
		erros.push({message:"O título está vazio"})
	if(!req.body.since || req.body.since == undefined || req.body.since == null)
		erros.push({message:"O campo data precisa ser preenchido"})
	if(!req.body.categ || req.body.categ == undefined || req.body.categ == null)
		erros.push({message:"Preencha o campo de categorias e tente novamente"})
	if(!req.file || req.file == undefined || req.file == null)
		erros.push({message:"Quase lá, faltou anexar uma imagem"})
	
	if(erros.length > 0){
		req.flash("error_msg", "Preencha todos os campos com atenção")
		res.redirect('/')
	}

	else {
		Filme.create({ 
			nome: req.body.titulo,
			data: req.body.since,
			tipo: tmpTipo,
			categoria: req.body.categ,
			nota: req.body.nota,
			faixaetaria: req.body.faixaet,
			netflix: netflix,
			prime: aprime,
			globo: gplay,
			comentario: 0,
			img: req.file.filename
		}).then(() => {
			req.flash("success_msg", "Documento enviado com sucesso!")
			res.redirect('/')
		}).catch((err) => {
			req.flash("error_msg", "Erro ao enviar os dados!")
			res.redirect('/')
		})	
	}
})

router.get('/netflix', (req, res) =>{
	Filme.findAll({where:{'netflix':1}, order:[['nota', 'DESC']]}).then((filmeseries) =>{
		res.render('showdata', {filmeseries: filmeseries})
	})
})

router.get('/primevideos', (req, res) =>{
	Filme.findAll({where:{'prime':1}, order:[['nota', 'DESC']]}).then((filmeseries) =>{
		res.render('showdata', {filmeseries: filmeseries})
	})
})

router.get('/gplay', (req, res) =>{
	Filme.findAll({where:{'globo':1}, order:[['nota', 'DESC']]}).then((filmeseries) =>{
		res.render('showdata', {filmeseries: filmeseries})
	})
})

router.get('/filmes', (req, res) =>{
	Filme.findAll({where:{'tipo':1}, order:[['nota', 'DESC']]}).then((filmeseries) =>{
		res.render('showdata', {filmeseries: filmeseries})
	})
})

router.get('/series', (req, res) =>{
	Filme.findAll({where:{'tipo':2}, order:[['nota', 'DESC']]}).then((filmeseries) =>{
		res.render('showdata', {filmeseries: filmeseries})
	})
})

router.get('/filefilter/:id', (req, res) => {
	var idteste = req.params.id;
	Filme.findAll({where: {'id': idteste}}).then((filmeseries) => {
		var json = JSON.stringify(filmeseries);
		alert(json);
		if(filmeseries.comentario){
			console.log("existe comentarios nesse filme")
		}	
		else {
			console.log("pelo menos não deu warni")
		}
		res.render('file', {filmeseries: filmeseries})	
	}).catch((err) => {
		req.flash("error_msg", "Algo deu errado! escolha outra opção :(");
		res.redirect('showdata')
	})
})

router.post('/commits/:id', (req, res) => {
	var idfilm = req.params.id;
	res.render('index');
})

router.get('/showdata', (req, res) => {
	Filme.findAll({order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

})

module.exports = router;