var express = require('express');
var request = require('request');
var router = express.Router();

var taskController = require('./controllers/task.server.controller.js');


router.get('/tasks/', taskController.get);
router.post('/tasks', taskController.post);
router.put('/tasks/:id', taskController.put);
router.post('/tasks/updatestate/:id', taskController.updateState);



module.exports = router;