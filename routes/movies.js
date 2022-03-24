var express = require('express');
var router = express.Router();
var Movie = require('../models/MovieSchema');
var moment = require('moment');
const { cekAuth } = require('../config/auth');

//Get all movies
router.get('/', cekAuth,function(req, res, next) {
    let ListMovies=[];
    Movie.find(function(err, movies){
        if(movies){
            for(let data of movies){                
                ListMovies.push({
                    id:data._id,
                    name:data.name,
                    release_on:data.release_on,
                });
            }
            res.render("movie/allMovies",{ListMovies});
        }else{
            ListMovies.push({
                id:"",
                name:"",
                release_on:"",
            });
            res.render("movie/allMovies",{ListMovies});
        }
    })
    
});

//Create Movies
router.get('/create', cekAuth,function(req, res, next) {
    res.render('movie/createMovies', { title: 'Create Movies' });
});

//Update Movie
router.get('/update/:movieId', cekAuth,function(req, res, next) {    
    Movie.findById(req.params.movieId, function(err, movieInfo){

        var newDate = moment(movieInfo.release_on).format('YYYY-MM-DD');

        if(movieInfo){
            console.log(movieInfo);
            res.render("movie/updateMovies",{
                movie: movieInfo, 
                newDate               
            })
        }
    })
});

//Action Create
router.post('/create', cekAuth,function(req, res) {
    const {name,date} = req.body;
    let errors = [];

    if(!name || !date) {
        errors.push({msg: 'Please enter all fields'});
    }

    if(errors.length > 0) {
        res.render('movie/createMovies', {errors});
    }else{
        const newMovie = new Movie({
            name,
            release_on : date
        });
        newMovie.save().then(movie => {
            errors.push({msg: 'Movie created successfully'});            
            res.render('movie/createMovies', {errors});
        }).catch(err => {
            console.log(err);
        });
    }
});

router.post("/update", cekAuth,function(req,res){
    let errors = [];

    Movie.findByIdAndUpdate(req.body.id, {name:req.body.name,release_on:req.body.date},
        function(err){
            if(err){
                console.log(err);
            }
            else{
                errors.push({msg: 'Movie updated successfully'});
                var newMovies = {
                    _id:req.body.id,
                    name:req.body.name
                };
                var newDate = moment(req.body.date).format('YYYY-MM-DD');
                res.render('movie/updateMovies', {
                    movie:newMovies,
                    newDate,
                    errors                
                });
            }
        }
        )
})

//Action Delete
router.get('/delete/:movieId', cekAuth,function(req, res) {
    Movie.findByIdAndRemove(req.params.movieId, function(err, movie){
        if(err){
            console.log(err);
        }else{
            res.redirect('/movies');
        }
    });
});

module.exports = router;