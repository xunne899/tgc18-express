const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on')

const fruitPrices ={
    'apple': 3,
    'durian' : 15,
    'orange' : 6,
    'banana' : 4
}

const app = express(); // create express
app.set('view engine', 'hbs')// inform express using hbs as view engine
wax.on(hbs.handlebars)// enable template inheritance
wax.setLayoutPath('views/layouts')//Layoutpath ...// inform wax where to find layouts

// forms 
app.use(express.urlencoded({
    'extended':false
}))


// routes
app.get ('/', function(req,res){
    res.send("hello world")
})


// one route to display the form
app.get('/fruits',function(req,res){
    res.render('fruit-form')
})

app.post('/fruits',function(req,res){
    // res.send(req.body) // for visual inspection
fruits = [];

if(Array.isArray(req.body.items)){
    fruits = req.body.items
  } else {
      // if single item convert to array
      if(req.body.items){
          fruits = [req.body.items]
      } else {
          fruits = []
      }
  }

  let total = 0

//   for (let eachfruit of fruits){
//     if (eachfruit == 'apple'){
//           total += 3
//       }
//     if (eachfruit == 'durian'){
//         total += 15
//     }
//     if (eachfruit == 'orange'){
//         total += 6
//     }
//     if (eachfruit == 'banana'){
//         total += 4
//     }
//   }

   // for (let eachFruit of fruits) {
    //     switch(eachFruit) {
    //         case 'apple':
    //             total += 3
    //             breakl
    //         case 'durian':
    //             total += 15;
    //             break;
    //         case 'orange':
    //             total += 6
    //             break;
    //         case 'banana':
    //             total += 4;
    //             break;
    //     }
    // }


for (let eachFruit of fruits){
    let price = fruitPrices[eachFruit];
    total += price
}

  res.render('total',{
      'total': total
  })
})



app.listen(3000, function(){
    console.log("server started")
})