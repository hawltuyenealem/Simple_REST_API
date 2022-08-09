
const express = require('express')
const router = express.Router();
const Product = require('../models/products');
const mongoose = require('mongoose');
const { Mongoose } = require('mongoose/lib');

router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
    
    .exec()
    .then(doc =>{
        console.log("From databse ",doc);
        if(doc){
            res.status(200).json({
                product : doc,
                request: {
                    type : 'GET',
                    url : 'localhost:3000/products/' + id,
                }
            });
        }else {
            res.status(404).json({message : "No Valid Product for thid ID"});
        }
       
    }).catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    });
    /*if(id === "special"){
        res.status(200).json({
            message : "You got The Special Id",
            id : id,
        });
    }else {
        res.status(200).json({
            message : "you passed id "
        });
    }*/
});
router.get('/',(req,res,next)=>{
    Product
    .find()
    .exec()
    .then(
        docs =>{
        console.log(docs)
        const response = {
            count : docs.length,
            product : docs.map(
                doc =>{
                return {
                    name : doc.name,
                    _id : doc._id,
                    price: doc.price,
                    request : {
                        type : 'GET',
                        url : 'localhost:3000/products/' + doc._id,
                    }
                }
            })
        }
        res.status(200).json(response);
    }).catch(err =>{
        console.log(err);
        res.status(500).json({error :err});
    });
    
});
router.post('/',(req,res,next)=>{
  
    const product = Product({
        _id : mongoose.Types.ObjectId(),
        name :req.body.name,
        price : req.body.price,
    });
    product
    .save()
    .then(
        result => {
        console.log(result);
        res.status(201).json({
            message : "Created Product Successfully",
            createdProduct :{
                name : result.name,
                price:result.price,
                _id : result._id,
                request : {
                    type : 'POST',
                    url : 'localhost:3000/products/' + result._id,
                }
            },
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    }); 
   
});


router.patch('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id :id},{$set :updateOps})
    .exec()
    .then(
        result => {
        console.log(result);
        res.status(200).json({
           message : 'Product Updated !!',
            request : {
                type : 'PATCH',
                url : 'localhost:3000/products/' + id,
            }
        })
    }).catch(
        err => {
            res.status(500).json({
                error : err
            });
        }
    );
});
router.delete('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id:id})
    .exec()
    .then(doc => {

        res.status(200).json({
            message : "Product Deleted Successfully !!",
            request : {
                type : 'DELETE',
                url : "localhost:3000/products/" + id
            }
        });
    })
    .catch(
        err => {
            res.status(500).json({
                error : err
            });
        }
    )
 
});
module.exports = router;