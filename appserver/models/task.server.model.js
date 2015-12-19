
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    name: String,
    description: String,
    owner: String,
    responsible: String,

    state: {type: Number, default: 1},

    createdBy: String,
    updatedBy: String,

    plannedWeek: {type: Number},
    CompletedWeek: {type: Number},
    completedDate: {type: Date},
    deadline : {type: Date},

    priority: {type: Number, default: 3}, // 1 : High, 2: Medium, 3: Low

    createdDate : {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Task', taskSchema);
