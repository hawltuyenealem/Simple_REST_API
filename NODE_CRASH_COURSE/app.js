const express  = require('express')

const app = express();
const morgan  = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes  = require('./api/routes/orders');
const userRoutes = require('./api/routes/users')
mongoose.Promise = global.Promise;
 var url =  'mongodb+srv://hawltu:0912846672@cluster0.kjeur.mongodb.net/?retryWrites=true&w=majority';
 const options = {
    useMongoClient: true,
   /* autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0*/
  };
mongoose.connect( url 
    /*{
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 30
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }*/
).then().catch(err => console.log(err));
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

/*app.use((req,res,next) => {
    res.header('Acess-Control-Allow-Origin',"*");
    res.header(
        'Acess-Control-Allow-Headers',
        "Origin, X-Requested-With,Content-Type,Accept,Authorization"
    );
    if(req.method === 'OPTIONS' ){
        res.header('Acess-Control-Allow-Methods','GET,PUT,POST,PATCH,DELETE');
        return res.status(200).json({});
    }
});
*/
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

app.use((req,res,next)=> {
    const error = new Error('Not Found');
    error.status = 404 ;
    next(error);

});
app.use((error,req,res,next)=> {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    })
});
/*app.use((req,res,next)=>{
    res.status(200).json({
        message : "Worked !!"
    });
});*/

module.exports = app;