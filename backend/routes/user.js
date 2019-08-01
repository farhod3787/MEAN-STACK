const express = require('express');
const router = express.Router();
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


router.post('/signup', (req, res, next) =>{
    bcryp.hash(req.body.password, 10, )
    .then( hash =>{
        const user = new User({
            email : req.body.email,
            password: hash
        });
        user.save().then( result =>{
            res.status(201).json({
                message: "User Created",
                result: result
            });

        }).catch( err =>{
            res.status(500).json({
                error: err
            });
        } )
    })   
} ) 

router.post('/login', (req, res, next) =>{
    let userone;
    User.findOne({email: req.body.email})
    .then( user =>{
        if(!user) {
            return response.status(400).json({message:"User Not found"})
        }
        userone = user;
       return bcryp.compare(req.body.password, user.password);
    })
    .then(result =>{
        if(!result) {
            return res.status(401).json({
                message: "User Not found"
            });  
        }
        const token = jwt.sign({email: userone.email, userId: userone._id}, 'asd', {expiresIn: '1h'});
             res.status(200).json({token: token});    
    } )
    .catch( err =>{
        return res.status(401).json({
            message: "User not found"           
        })
    })
})


module.exports = router;