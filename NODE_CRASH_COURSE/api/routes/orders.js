const { request } = require('express');
const express = require('express');
const orderController = require('../controllers/orders');

const router = express.Router();
const mongoose = require('mongoose');
const error = require('mongoose/lib/error');
const Order  = require('../models/orders');
const Product = require('../models/products')
const checkAuth = require('../middleware/check-auth');
router.get('/',checkAuth,orderController.order_get_all);
router.get('/:orderId',checkAuth,orderController.order_get_one);
router.patch('/:orderId',checkAuth,orderController.order_update);
router.post('/',checkAuth,orderController.order_post);
router.delete('/:orderId',checkAuth,orderController.order_delete);

module.exports = router;