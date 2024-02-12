const User = require('../models/userModel')
const bcrypt = require('bcrypt')


const registerLoad = async(req,res)=>{
    try{
        res.render('register')
    }catch(err){
        console.log(err.message);
    }
}
const register = async(req,res)=>{
    try{
        const hash = await bcrypt.hash(req.body.pass,10)

        const newUser = new User({
            name : req.body.name,
            password :hash,
        });

        await newUser.save();

        res.render('register',{message:'success'});


    }catch(err){
        console.log(err.message);
    }
}

const loginLoad = async(req,res)=>{
    try{
        res.render('login')

    }catch(err){
        console.log(err.message);
    }
}
const login = async(req,res)=>{
    try{
        const {name,password} = req.body;
        const userData = await User.findOne({name})
        if(userData){
            const isAMatch = await bcrypt.compare(password,userData.password)
            if(isAMatch){
                req.session.user = userData;
                res.redirect('/dashboard');
            }else{
                res.render('login',({message:"Wrong password"}))
            }
        }else{
            res.render('login',({message:"Wrong username"}))
        }
    }catch(err){
        console.log(err.message);
    }
}
const logout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/');
    }catch(err){
        console.log(err.message);
    }
}
const dashboard = async(req,res)=>{
    try{
        const users = await User.find({_id:{$nin:[req.session.user._id]}})
        res.render('dashboard',{user:req.session.user , users : users})
    }catch(err){
        console.log(err.message);
    }
}

module.exports = {
    register,
    registerLoad,
    loginLoad,
    login,
    dashboard,
    logout
}