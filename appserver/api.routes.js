var express = require('express');
var request = require('request');
var router = express.Router();

var productController = require('./controllers/products.server.controller.js');


router.get('/products/', productController.get);
router.post('/products', productController.post);


module.exports = router;