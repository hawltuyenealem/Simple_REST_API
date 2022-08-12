const Order  = require('../models/orders');

exports.order_get_all = (req,res,next)=>{
    Order.find()
    .select("product quantity _id")
    .populate('product','name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count :docs.length,
            order: docs.map(doc => {
               return{
                _id : doc._id,
                productId: doc.productId,
                quantity :doc.quantity,
                request :{
                    method : "GET",
                    url : "localhost:3000/orders/" + doc._id
                }
               }
            }),
           
        });
    })
    .catch(err => {
        res.status(500).json({
            error :err
        })
    })
  
};
exports.order_post = (req,res,next)=>{
    Product.findById(req.body.productId)
    .then(
        product =>{
            if(!product){
                res.status(404).json({
                    message: "Product Not found !!"
                });
            }
            const order = new Order({
                _id : mongoose.Types.ObjectId(),
                productId: req.params.productId,
                quantity: req.params.quantity,
            });
           return  order
            .save()
            .then(result => {
                res.status(201).json({
                    message : "Created Successfully !!",
                    createdOrder :{
                        productId : result.productId,
                        quantity:result.quantity,
                        _id : result._id,
                        request : {
                            type : 'POST',
                            url : 'localhost:3000/orders/' + result._id,
                        }
                    },
                });
            }).catch(err => {
                res.status(500).json({
                    error : err
                })
            })
           
        }
    )
   
};
exports.order_delete  = (req,res,next)=>{
    Order.remove({_id:req.params._id})
    .exec()
    .then(doc =>{
        res.status(200).json({
            message : "Order Deleted Successfully !!",
            request : {
                type : 'DELETE',
                url : "localhost:3000/orders/" + doc._id
            }
        });
    })
    .catch(err => {
        error :err
    })
};

exports.order_get_one = (req,res,next)=>{
    /*const id  = req.params.orderId;
    if (id === 'special'){
        res.status(200).json({
            message : "Get The Special id order",
            id : id
        });
    }else {
        res.status(200).json({
            message : `get order with ${id}`,
        });
    }*/
    
    Order.findById(req.params.orderId)
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                order : doc,
                request: {
                    type : 'GET',
                    url : 'localhost:3000/orders/' + doc._id,
                }
            });
        }else {
            res.status(404).json({message : "No Valid Product for thid ID"});
        }
        
    })
    .catch(err => {
        res.status(500).json({
            error :err
        });
    })
};
exports.order_update = (req,res,next)=>{
    const id = req.params.orderId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Order.updateOne({_id:id},{$set:updateOps})
    .exec()
    .then(
        result =>{
            console.log(result);
            res.status(200).json({
               message : 'Order Updated !!',
                request : {
                    type : 'PATCH',
                    url : 'localhost:3000//' + result._id,
                }
            })
        }
    )
    .catch(
        err => {
            res.status(500).json({
                error : err
            });
        }
    )

    res.status(200).json({
        message : "Updated Order !!",
    });
};