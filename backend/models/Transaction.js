
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0.01, 'Amount must be greater than zero']
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        required: true
    },
    category: {
        type: String,
        enum: [
            'Food',
            'Shopping',
            'Transportation',
            'Housing',
            'Entertainment',
            'Healthcare',
            'Education',
            'Salary',
            'Business',
            'Investment',
            'Other'
        ],
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
