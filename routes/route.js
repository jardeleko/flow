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
const bcrypt = require('bcryptjs')
const {	score, rate, average } = require('average-rating');
const passport = require('passport')
require('../config/auth')(passport) 
router.use(session({
	secret:'smartsky',
	resave: true,
	saveUninitialized: true
}));
router.use(require('body-parser').urlencoded({ extended: true }));
router.use(require('cookie-parser')());
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'))
router.use(express.urlencoded({extended: true})) 	//atual bodyparser
router.use(express.json()) 
router.use(flash())


//função para inicio de validação com node javascript 
router.use(function(req, res, next)  {
	res.locals.success_msg = req.flash("success_msg") //insere mensagens de sucesso geradas no array erros em uma variavel local na pagina html
	res.locals.error_msg = req.flash("error_msg") //   msg de error atribuidas no locals do html 
	res.locals.error = req.flash("error")
	res.locals.users = req.user 
	next() //atualiza pagina
})	

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
        res.redirect("/login");
    }
}


router.get('/', checkAuthentication, (req, res) => {
	var admin = req.user.idAdmin;
	if(admin == 1){
		res.render('index')
	}
	else res.redirect('/showdata');	
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

router.get('/profile', (req, res) => {
	var dados = req.user;
	Users.findAll({where: {'id': dados.id}}).then((users) => {
		res.render('profile', {dados:dados})
	})
})

router.get('/showdata',checkAuthentication, (req, res) => {
	Filme.findAll({order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

})

router.get('/terror',checkAuthentication, (req, res) => {
	Filme.findAll({where:{'categoria':'Terror'},order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

})
router.get('/drama',checkAuthentication, (req, res) => {
	Filme.findAll({where:{'categoria':'Drama'},order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

})

router.get('/suspense',checkAuthentication, (req, res) => {
	Filme.findAll({where:{'categoria':'Suspense'},order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

})
router.get('/romance',checkAuthentication, (req, res) => {
	Filme.findAll({where:{'categoria':'Romance'},order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

})
router.get('/animacao',checkAuthentication, (req, res) => {
	Filme.findAll({where:{'categoria':'Animacao'},order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

})
router.get('/comedia',checkAuthentication, (req, res) => {
	Filme.findAll({where:{'categoria':'Comedia'},order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

})
router.get('/aventura',checkAuthentication, (req, res) => {
	Filme.findAll({where:{'categoria':'Aventura'},order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

})
router.get('/ficcao',checkAuthentication, (req, res) => {
	Filme.findAll({where:{'categoria':'Ficcao'},order:[['nota', 'DESC']]}).then((filmeseries) => {
		res.render('showdata', {filmeseries: filmeseries})
	})

})

router.get('/netflix',checkAuthentication, (req, res) =>{
	Filme.findAll({where:{'netflix':1}, order:[['nota', 'DESC']]}).then((filmeseries) =>{
		res.render('showdata', {filmeseries: filmeseries})
	})
})

router.get('/primevideos',checkAuthentication, (req, res) =>{
	Filme.findAll({where:{'prime':1}, order:[['nota', 'DESC']]}).then((filmeseries) =>{
		res.render('showdata', {filmeseries: filmeseries})
	})
})

router.get('/gplay',checkAuthentication, (req, res) =>{
	Filme.findAll({where:{'globo':1}, order:[['nota', 'DESC']]}).then((filmeseries) =>{
		res.render('showdata', {filmeseries: filmeseries})
	})
})

router.get('/filmes',checkAuthentication, (req, res) =>{
	Filme.findAll({where:{'tipo':1}, order:[['nota', 'DESC']]}).then((filmeseries) =>{
		res.render('showdata', {filmeseries: filmeseries})
	})
})

router.get('/series',checkAuthentication, (req, res) =>{
	Filme.findAll({where:{'tipo':2}, order:[['nota', 'DESC']]}).then((filmeseries) =>{
		res.render('showdata', {filmeseries: filmeseries})
	})
})
router.get('/logs', checkAuthentication, (req, res) => {
	var comp = req.user.id;
	Avaliacao.findAll({where: {'idUser': comp}}).then((result) => {
		res.render('logs', {result: result})
	}).catch((err) => {
		console.log(err)
	})
})

router.get('/filefilter/:id',checkAuthentication, (req, res) => {
	var idteste = req.params.id
	var user = req.user
	let len = 0;
	let a = 0;
	let b = 0;
	let c = 0;
	let d = 0;
	let e = 0;
	Avaliacao.findAll({where: {'idFilm': idteste}}).then((result) => {
		for (let index = 0; index < result.length; index++) {
			if(result[index].nota === 1) a++;
			else if(result[index].nota === 2) b++;
			else if(result[index].nota === 3) c++;
			else if(result[index].nota === 4) d++;
			else if(result[index].nota === 5) e++;
			len++;
		}
		const rating = [a, b, c, d, e];
		var total = average(rating); // --> 4.4
		Filme.update({
			nota: total,
			idCommmit: len
			},
			{where: {'id': idteste}}).then(() => {
				console.log('que bom que atualizou esta tarefa')
			}).catch((err) => {
				console.log(err);
		})

	}).catch((err) => {
		console.log('problema no countners and conutners')
	})

	Avaliacao.findAll({where: {'idFilm': idteste}}).then((avaliacao) => {
		Filme.findAll({where: {'id': idteste}}).then((filmeseries) => {			
			res.render('file', {filmeseries: filmeseries, avaliacao: avaliacao, user:user})	
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
	var sinc = req.body.since;
	var splita = String(sinc).split("-");
	let ano = splita[0]
	let mes = splita[1]
	let dia = splita[2] 
	var pformat = dia+'/'+mes+'/'+ano
	
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
		res.render('/', {erros:erros})
	}
	else {
		Filme.create({ 
			nome: req.body.titulo,
			data: pformat,
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
			user: req.body.username,
			passw: password,
			iAdmin: 0,
			imgPerfil: 'default.png'
		}).then(()=>{
			req.flash("success_msg", "Bem vindo! agora é só você logar")
			res.redirect('/login')			
		}).catch((err) =>{
			req.flash("error_msg", "Falha, username ou email ja cadastrado")
			res.redirect('/create')
		})
	}

})

router.post('/commits/:id', checkAuthentication, (req, res) => {
	var idfilm = req.params.id;
	let aux = 1;
	var erros_commit = [];
	if(req.body.rate1) aux = req.body.rate1
	else if(req.body.rate2) aux = req.body.rate2
	else if(req.body.rate3) aux = req.body.rate3
	else if(req.body.rate4) aux = req.body.rate4
	else if(req.body.rate5) aux = req.body.rate5
	Filme.update({idUser: req.user.id}, {where:{'id': idfilm}});
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
			nomeUser:req.user.user,
			idUser: req.user.id,
			imgUser: req.user.imgPerfil,
			nota: aux,
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


router.post('/search', checkAuthentication, (req, res) => {
	var compare = req.body.search;
	var filmeseries = []
	console.log(compare)
	Filme.findAll().then((result) => {
		for (let i = 0; i < result.length; i++) {
			if(result[i].nome.toLowerCase() == compare.toLowerCase())
				filmeseries.push(result[i])
			else console.log('nenhum filme encontrado')
		}
		res.render('showdata', {filmeseries: filmeseries})
	}).catch((err) => {
		req.flash("error_msg", "nenhum filme encontrado com este titulo")
		filmeseries = result
		res.render('showdata', {filmeseries: filmeseries})
	})
})

router.put('/putprofile/:id', uploads.single('imgperfil'), (req, res) => {
	var newnome, newmail, newuser, newimg;
	if(!req.body.nomeatl || req.body.nomeatl == undefined)
		newnome = req.user.nome
	else 
		newnome = req.body.nomeatl
	if(!req.body.emailatl || req.body.emailatl == undefined)
		newmail = req.user.email
	else 
		newmail = req.body.emailatl
	if(!req.body.usernameatl || req.body.usernameatl == undefined)
		newuser = req.user.user
	else 
		newuser = req.body.usernameatl
	if(!req.file || req.file == 'undefined' || req.file == null)
		newimg = 'default.png'
	else 
		newimg = req.file.filename 

	Users.update({
		nome: newnome,
		email: newmail,
		user: newuser,
		imgPerfil: newimg},
		{where: {'id': req.params.id}}).then((users) => {
			req.flash("success_msg", "Dados atualizados com sucesso!")
			res.redirect('/profile')
		}).catch((err) => {
			req.flash("error_msg", "Algo deu errado, tente novamente")
			res.redirect('/profile')			
	})
})

router.delete('/deletecommit/:id', checkAuthentication, (req, res) => {
	Avaliacao.destroy({where: {'id': req.params.id}}).then(() => {
		req.flash("success_msg", "Comentário deletado com sucesso!")
		res.redirect('/showdata')
	}).catch((err) => {
		req.flash("error_msg", "Erro ao deletar o comentário")
		res.redirect('/showdata')
	})
})

router.delete('/deleteacc/:id', checkAuthentication, (req, res) => {
	var buffer = []
	Avaliacao.destroy({where: {'idUser': req.params.id}}).then(() => {
		Filme.update({idUser: 0}, {where:{'idUser': req.user.id}});
		res.redirect('/logs')	
	}).catch((err) => {
			req.flash("error_msg", "Upss, ocorreu um erro")
			res.redirect('/login')
		})
			
	
})
module.exports = router;

/*

router.get('/deleteuser', (req, res) =>{

	})


*/