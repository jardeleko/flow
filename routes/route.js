const express = require('express')
const router = express()
const Filme = require("../models/Filme")
const Avaliacao = require("../models/Avaliacao")
const Users = require('../models/Users')
const multer = require('multer')
const multerConfig = require("../config/multer")
const uploads = multer(multerConfig)
const methodOverride = require("method-override")
const session = require('express-session')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const passport = require('passport');
require('../config/auth')(passport); 

router.use(methodOverride('_method'))
router.use(express.urlencoded({extended: true})) 	//atual bodyparser
router.use(express.json()) 
router.use(passport.initialize())
router.use(passport.session())		
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

router.get('/create', (req, res) => {
	res.render('create')
})
router.get('/login', (req, res) => {
	res.render('login')
})
router.get('/logout', (req, res, next) => {
	req.logout();
	res.redirect('/login');
	next()
})

router.get('/showdata', (req, res) => {
	Filme.findAll({order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

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
	Avaliacao.findAll({where: {'idFilm': idteste}}).then((avaliacao) => {
		Filme.findAll({where: {'id': idteste}}).then((filmeseries) => {	
			res.render('file', {filmeseries: filmeseries, avaliacao: avaliacao})	
		}).catch((err) => {
			req.flash("error_msg", "Algo deu errado! escolha outra opção :(");
			res.redirect('showdata')
		})
	})
})

router.post('/confirm_auth', (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true 
	})(req, res, next)
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

router.post('/createacc', (req, res) => {
	var pgcreate = []

	if(!req.body.nome || req.body.nome == undefined || req.body.nome == '')
		pgcreate.push({message: "Faltou o nome, tente novamente"})
	if(!req.body.username || req.body.username == undefined || req.body.username == '')
		pgcreate.push({message: "Faltou inserir o username"})
	if(!req.body.email || req.body.email == undefined || req.body.email == '')
		pgcreate.push({message: "Necessario um email válido"})
	if(req.body.senha != req.body.confirm)
		pgcreate.push({message: "Senha não confere"})
	if(pgcreate.length > 0){
		req.flash("error_msg", "O formulario precisa ser preenchido corretamente")
		res.redirect('/create')
	}
	else {
		let password = req.body.senha;
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt); 
		password = hash;

		Users.create({ 
			nome: req.body.nome,
			email: req.body.email,
			username: req.body.username,
			senha: password,
			iAdmin: 0
		}).then(()=>{
			req.flash("success_msg", "Bem vindo! agora é só você logar")
			res.redirect('/login')			
		}).catch((err) =>{
			req.flash("error_msg", "Falha, username ou email ja cadastrado")
			res.redirect('/create')
		})
	}

})

router.post('/commits/:id', (req, res) => {
	var idfilm = req.params.id;
	var erros_commit = [];
	if(!req.body.starcommit || req.body.starcommit == undefined || req.body.starcommit == null)
		erros_commit .push({message:"Nenhum comentario inserido"})
	if(!req.body.starnota || req.body.starnota == undefined || req.body.starnota == null)
		erros_commit.push({message:"Necessario classificar!"})

	if(erros_commit > 0){
		console.log(erros_commit)
		res.render('showdata')
	}
	else{
		Avaliacao.create({
			idUser: 1,
			nota: req.body.starnota,
			comentario: req.body.starcommit,
			idFilm: idfilm
		}).then(() => {
			req.flash("success_msg", "Comentário enviado com sucesso!")
			res.redirect('/showdata')
		}).catch((err) => {
			req.flash("error_msg", "Erro ao comentar, verifique se todos os campos foram preenchidos e tente novamente!")
			res.redirect('/showdata')
			console.log(err)
		})
	}
	
})

router.delete('/deletecommit/:id', (req, res) => {
	Avaliacao.destroy({where: {'id': req.params.id}}).then(() => {
		req.flash("success_msg", "Comentário deletado com sucesso!")
		res.redirect('/showdata')
	}).catch((err) => {
		req.flash("error_msg", "Erro ao deletar o comentário")
		res.redirect('/showdata')
	})
})

module.exports = router;