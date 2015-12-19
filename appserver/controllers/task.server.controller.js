var Task = require('../models/task.server.model.js');
var authHelper = require('../helpers/auth.helper.js');
var mongoose = require('mongoose');
var moment = require('moment');

var get = function (req, res) {
    var result = {};
    Task.find().exec(function (err, results) {
        result = results;
        res.status(200).json(result);
    });
};

var post = function (req, res) {

    console.log('starting processing post request...');

    var payload = authHelper.getAuthPayload(req);

    if (!payload) {
        res.status(401).json(authHelper.unautorizedMessage);
        return;
    }

    console.log(payload);

    var entry = new Task({
        name: req.body.name,
        description: req.body.description,
        owner: req.body.owner,
        responsible: req.body.responsible,
        state: req.body.state,

        createdBy: payload.sub,
        updatedBy: payload.sub,

        priority: req.body.priority ? req.body.priority : 1

    });

    entry.save();

    res.status(201).json(entry._id);
};

var put = function (req, res) {

    console.log('PUT is started processing');

    var payload = authHelper.getAuthPayload(req);

    if (!payload) {
        res.status(401).json(authHelper.unautorizedMessage);
        return;
    }

    var entry = {
        name: req.body.name,
        description: req.body.description,
        owner: req.body.owner,
        responsible: req.body.responsible,
        state: req.body.state,

        deadline: req.body.deadline,
        updatedBy: payload.sub,
        updatedDate: Date.now(),

        priority: req.body.priority ? req.body.priority : 1

    };

    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);

    Task.update({_id: objectId}, {$set: entry}, function (err, numAffected) {
        if (err) {
            console.log(err);
            res.status(500).json({message: err});
        } else {
            if (numAffected) {
                res.status(200).json({});
            } else {
                console.error('No record updated with for ', entry);
            }

        }
    });
};

var updateState = function (req, res) {
    console.log('Update state started');
    try {
        console.log('Update state started');

        var payload = authHelper.getAuthPayload(req);

        if (!payload) {
            res.status(401).json(authHelper.unautorizedMessage);
            return;
        }

        var updatedState = req.body.state;

        if (updatedState < 1 || updatedState > 3) {
            res.status(400).json({message: 'The state should be in the range [1..3]'});
            return;
        }

        var id = req.params.id;
        var objectId = mongoose.Types.ObjectId(id);

        var updateObject = getUpdateObject(updatedState);
        var unsetObject = getUnsetObject(updatedState);


        Task.update({_id: objectId}, {$set: updateObject, $unset: unsetObject}, function (err, numAffected) {
            if (err) {
                console.log(err);
                res.status(500).json({message: err});
            } else {

                if (numAffected) {
                    res.status(200).json({});
                } else {
                    console.error('No record updated with for ', updatedState);
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
};

function getUpdateObject(updatedState){
    var updateObject = {state: updatedState};
    if(updatedState === 2){

        updateObject.plannedWeek = moment().week();
    }

    if(updatedState === 3){
        updateObject.completedDate = Date.now();
        updateObject.CompletedWeek = moment.week();
    }
}

function getUnsetObject(updatedState){
    var unsetObject = {};
    if(updatedState === 1){

        unsetObject.plannedWeek = "";
        unsetObject.completedDate = "";
        unsetObject.completeWeek = "";

    }else if(updatedState === 2){
        unsetObject.completedDate = "";
        unsetObject.completeWeek = "";
    }

    return unsetObject;
}

var productsController = {
    get: get,
    post: post,
    put: put,
    updateState: updateState
};

module.exports = productsController;






