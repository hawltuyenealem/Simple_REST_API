const Product = require('../models/products');
exports.product_get_all = (req,res,next)=>{
    Product
    .find()
    .select("name price _id productImage")
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
                    productImage :doc.productImage,
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
    
}

exports.product_get_one  = (req,res,next)=>{

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
}

exports.product_post  = (req,res,next)=>{
  
    const product = Product({
        _id : mongoose.Types.ObjectId(),
        name :req.body.name,
        price : req.body.price,
        productImage : req.file.path
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
                productImage:result.productImage,
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
   
};

exports.product_update = (req,res,next)=>{
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
};
exports.product_delete = (req,res,next)=>{
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
 
};