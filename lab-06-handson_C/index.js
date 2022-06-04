const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on')

const app = express()
app.set('view engine','hbs')
//static file
app.use(express.static('public'))


wax.on(hbs.handlebars)
wax.setLayoutPath('views/layouts')


app.use(express.urlencoded({
    'extended':false
}))


//app route
app.get('/',function(req,res){
    res.send("Hello Friend")
})


app.get('/login',function(req,res){
    res.render('login')
})


app.post('/login', function(req,res){
    let email = req.body.email
    let password = req.body.password
    let haserror = false

    if(!email){
        haserror=true
    }

    if ( !email && email.includes('@')) {
        haserror = true;
    }

 
    if (!password && password.length > 3) {
        haserror = true;
    }

    if (haserror) {
        res.sendStatus(406)
    } else {
        res.send("Excellent")
    }
})


//to start
app.listen(3000,function(){
    console.log('server started')
})