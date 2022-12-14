const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.user_sign_up = (req,res,next)=> {
    User.find({email:req.body.email}).exec()
    .then(doc=>{
        if(doc.length >= 1){
            return res.status(409).json({
                message : "Email Existed !!"
            });
    
        }else {
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    res.status(500).json({
                        error : err
                    });
                }else {
                    const user = User(
                        {
                         _id : mongoose.Types.ObjectId(),
                         email: req.body.email,
                         password :hash
                        });
                        user.save()
                        .then((result) => {
                            res.status(201).json({
                                message: "User Created !!"
                            })
                        }).catch((err) => {
                            res.status(500).json({
                                error : err
                            })
                        });
                }
            });
            
        }
    })  
};
exports.user_login = (req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(
        user => {
            if(user.length < 1){
                return res.status(401).json({
                    message : "Authentication Failed"
                });
            }else {
                bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                    if(err){
                        return res.status(401).json({
                            message : "Authentication Failed"
                        });
                    }
                    if(result){
                        const token =  jwt.sign(
                            {
                            email:user[0].email,
                            userId : user[0]._id,
                        },
                        'secret',
                        {
                            expiresIn : "1h"
                        },);
                        return res.status(200).json({
                            message : "Authentication is successful",
                            token: token
                        })
                    }
                    res.status(401).json({
                        message : "Authentication Failed"
                    })
                })
            }
        }
    )
    .catch(err => {
        res.status(500).json({
            error :err
        });
    })
};
exports.user_delete = (req,res,next)=>{
    User.remove({_id:req.params.userId})
    .exec()
    .then(
        result => 
        {
        res.status(200).json({
            message : "User Deleted Successfully !!"
        });
    })
    .catch(err => {
        res.status(500).json({
            error :err
        });
    })
};