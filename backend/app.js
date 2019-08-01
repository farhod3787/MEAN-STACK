const path = require('path');
const express  = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/post');
const Post = require ('./models/posts');

const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb://localhost:27017/online-pharmacy").then( () => {
    console.log('Connected to database')
})
.catch( () =>{
    console.log('Error in connected database')
});
module.exports = {mongoose};



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use('/images', express.static(path.join("backend/images")));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Request-Width, Content-Type, Accept, Authorization" 
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next()
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);
 
module.exports = app;