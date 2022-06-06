const express = require ('express')
const hbs = require('hbs')
const wax = require('wax-on')
const axios = require('axios')


// app.use(express.static('public'));

const app = express()

app.set('view engine', 'hbs')
app.use(express.static('public'))

wax.on(hbs.handlebars)
wax.setLayoutPath('./views/layouts')

app.use(express.urlencoded({
    'extended':false
}))

const BASE_API_URL="https://ckx-movies-api.herokuapp.com/"


app.get('/', function(req,res){
    res.send("hello world")
})



app.get('/movies',async function (req,res){
    try {
    let response = await axios.get(BASE_API_URL + 'movies')
    res.render('index',{
        'movies': response.data
    })
} catch(e){
    console.log(e);
    res.send('Error')
}
})
 


app.get('/movies/create', function(req,res){
    res.render('create-movie')
})


// app.post('/movies/create', async function(req,res){
//     // the payload contains the data that we want to save
//     let data = {
//         // 'id':req.body.id,
//         'plot': req.body.plot,
//         'title': req.body.title
//     }
//     await axios.post(BASE_API_URL + '/movie/create', data);
//     res.redirect('/movies')
// })


// app.post('/movies/create', async function(req,res){
    //     let movieTitle = req.body.movie_title;
    //     let moviePlot = req.body.movie_plot;
    
    //     await axios.post(BASE_API_URL + "movie/create",{
    //         'title': movieTitle,
    //         'plot':moviePlot
    //     })
    //     res.redirect('/movies');
    // })
    
    app.post('/movies/create', async function(req,res){
        let title = req.body.title;
        let plot = req.body.plot;
        await axios.post(BASE_API_URL  + "movies/create",{
            'title': title,
            'plot': plot
        })
        res.redirect('/movies');
    })


    app.get('/movies/update/:movie_id', async function(req,res){
        let movieId = req.params.movie_id;
        let response = await axios.get(BASE_API_URL + 'movie/' + movieId );
        res.render('update-movies', {
            'movie':response.data
        })
    })
    
    app.post('/movies/update/:movie_id', async function(req,res){
        let movieId = req.params.movie_id;
        let payload = {
            // 'id':req.body.id,
            'title': req.body.title,
            'plot': req.body.plot
        }
        await axios.patch(BASE_API_URL + "movie/" + movieId, payload);
        res.redirect('/movies')
    })



app.listen(3000,function(){
    console.log("server started")
})

