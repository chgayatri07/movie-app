var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
var path = require('path');
//var asset = require('asset');
var MongoClient = require('mongodb').MongoClient;
var multer = require('multer');
var config = require('./config/config.js');
//Connecting to mongodb
var db

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

MongoClient.connect(config.connect.dbConnectString,(err,database)=>
{
    if(err) throw err;
    db=database.db('movieapp');
    app.listen(config.connect.port,()=>
    {
        console.log('Listening to port = '+config.connect.port);
    })
})

app.set('views', path.join(__dirname, 'views/'));
app.set('view engine','ejs');

//movie list
app.get('/',function(req,res){
    var cursor = db.collection('movies').find({});
    cursor.toArray(function(err,i){
        if(err) throw err;
        res.render('index.ejs',{movies:i});
    })
});

app.get('/moviepage', function(req, res) {

    var cursor = db.collection('movies').find({});

    cursor.toArray(function(err, movies) {

        if (err) throw err;

        db.collection('reviews').find({}).toArray(function(err, reviews) {

            if (err) throw err;

            movies.forEach(function(movie) {

                movie.reviewCount = reviews.filter(function(review) {

                    return review.movieId.toString() === movie._id.toString();

                }).length;

            });

            res.render('moviepage.ejs', {

                title: 'Movie Page',

                movies: movies

            });

        });

    });

});

app.get('/movie/:id', function(req, res) {

    var ObjectId = require('mongodb').ObjectId;

    var movieId = new ObjectId(req.params.id);

    db.collection('movies').findOne(
        { _id: movieId },
        function(err, movie) {

            if (err) throw err;

            db.collection('reviews').find(
                { movieId: movieId }
            ).toArray(function(err, reviews) {

                if (err) throw err;

                res.render('moviedetails.ejs', {
                    movie: movie,
                    reviews: reviews
                });

            });

        }
    );

});
//add movie
app.get('/add', function(req, res) {

    res.render('addmoviepage.ejs');

});

app.post('/addmovie', upload.single('movieImage'), function(req, res) {

    var movie = {
        movieName: req.body.movieName,
        year: req.body.year,
        production: req.body.production,
        genre: req.body.genre,
        rating: req.body.rating,
        runtime: req.body.runtime,
        director: req.body.director,
        description: req.body.description,
        img: req.file.filename,
        contenttype: req.body.contenttype
    };

    db.collection('movies').insertOne(movie, function(err, result) {

        if (err) throw err;

        res.redirect('/');

    });

});
//Edit movie
// Edit movie list
app.get('/edit/:id', function(req, res) {

    var ObjectId = require('mongodb').ObjectId;

    db.collection('movies').findOne(
        { _id: new ObjectId(req.params.id) },
        function(err, movie) {

            if (err) throw err;

            res.render('editmovie.ejs', { movie: movie });

        }
    );

});


// Update movie
app.post('/editmovie/:id', upload.single('movieImage'), function(req, res) {

    var ObjectId = require('mongodb').ObjectId;

    var updatedMovie = {
        movieName: req.body.movieName,
        year: req.body.year,
        production: req.body.production,
        genre: req.body.genre,
        rating: req.body.rating,
        runtime: req.body.runtime,
        director: req.body.director,
        description: req.body.description,
        contenttype: req.body.contenttype
    };

    if (req.file) {
        updatedMovie.img = req.file.filename;
    }

    db.collection('movies').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updatedMovie },
        function(err, result) {

            if (err) throw err;

            res.redirect('/');

        }
    );

});

// Delete movie
app.post('/delete/:id', function(req, res) {

    var ObjectId = require('mongodb').ObjectId;

    db.collection('movies').deleteOne(
        { _id: new ObjectId(req.params.id) },
        function(err, result) {

            if (err) throw err;

            res.redirect('/');

        }
    );

});

app.post('/addreview/:id', function(req, res) {

    var ObjectId = require('mongodb').ObjectId;

    var review = {

        movieId: new ObjectId(req.params.id),

        userName: req.body.userName,

        rating: req.body.rating,

        review: req.body.review

    };

    db.collection('reviews').insertOne(
        review,
        function(err, result) {

            if (err) throw err;

            res.redirect('/movie/' + req.params.id);

        }
    );

});

app.get('/admin/reviews', function(req, res) {

    db.collection('movies').find({}).toArray(function(err, movies) {

        if (err) throw err;

        if (!req.query.movieId) {

            res.render('adminreviews.ejs', {
                movies: movies,
                selectedMovie: null,
                reviews: []
            });

            return;
        }

        var ObjectId = require('mongodb').ObjectId;

        var movieId = new ObjectId(req.query.movieId);

        db.collection('movies').findOne(
            { _id: movieId },
            function(err, movie) {

                if (err) throw err;

                db.collection('reviews').find(
                    { movieId: movieId }
                ).toArray(function(err, reviews) {

                    if (err) throw err;

                    res.render('adminreviews.ejs', {
                        movies: movies,
                        selectedMovie: movie,
                        reviews: reviews
                    });

                });

            }
        );

    });

});