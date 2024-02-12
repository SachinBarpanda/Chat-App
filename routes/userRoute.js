const express = require('express')
const app = express();
const path = require('path');
const session = require('express-session')

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'))

app.use(session({
    secret:"secretSessionkey",
    resave:false,
    saveUninitialized: false,

}))

const userController = require('../controllers/userController')

const auth = require('../middlewares/auth')

app.get('/register',auth.isLogout,userController.registerLoad)
app.post('/register',userController.register)

app.get('/',auth.isLogout,userController.loginLoad)
app.post('/',userController.login)

app.get('/logout',auth.isLogin,userController.logout)
app.get('/dashboard',auth.isLogin,userController.dashboard)
app.get('/*',(req,res)=>{
    res.redirect('/')
})

module.exports = app;