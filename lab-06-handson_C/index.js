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
        haserror= true
    }

    if (email && email.length < 3) {
        haserror = true;
    }

    if (email && !email.includes('@')) {
        haserror = true;
    }


    if(!password){
        haserror= true
    }
    if (password && !password.length > 3) {
        haserror = true;
    }

    if (haserror) {
        res.sendStatus(406)
    } else {
        res.send("Thanks for your Submission")
    }
})



app.get('/lost&found',function(req,res){
    res.render('lost&found')
})

app.post('/lost&found',function(req,res){
    let item = req.body.item;
    let email =req.body.email;
    let transport = req.body.transport
    let formbox = []
    if (req.body.formbox){
        if(Array.isArray(req.body.formbox)){
          formbox =req.body.formbox;
        } else {
            formbox = [req.body.formbox]
        }
    }
console.log(formbox)
let haserror = false ;

if(!transport){
    haserror = true
}

if(!item){
    haserror = true
}

if(item && item.length < 3 || item.length > 200){
    haserror = true
}

if(!email){
    haserror = true
}

if(email && email.length < 3 || email.length > 200){
    haserror = true
}

if(email && !email.includes('@') && !email.includes('.')){
    haserror = true
}

 
if (formbox && formbox.length> 3 || formbox.length < 1){
    haserror = true;
}

if (haserror) {
    res.sendStatus(406)
} else {
    res.send("Thanks for your Submission");
}



})

//to start
app.listen(3000,function(){
    console.log('server started')
})