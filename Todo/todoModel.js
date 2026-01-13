const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const todoSchema = new Schema({
    task: {
        type: String,
        required: true
    },
    deadLine: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'pending'],
        default: 'pending'
    }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;