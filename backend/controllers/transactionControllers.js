const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch transactions',
            error: error.message
        });
    }
};



const createTransaction = async (req, res) => {
    try {
        const { title, amount, type, category, date, description } = req.body;

        // Validate required fields
        if (!title || !amount || !type || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create transaction
        const newTransaction = new Transaction({
            title,
            amount,
            type,
            category,
            date,
            description
        });

        await newTransaction.save();

        return res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: newTransaction
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create transaction',
            error: error.message
        });
    }
};


const editTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid transaction ID'
            });
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTransaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            data: updatedTransaction
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update transaction',
            error: error.message
        });
    }
};



const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid transaction ID'
            });
        }

        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
            data: deletedTransaction
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete transaction',
            error: error.message
        });
    }
};



module.exports = {getTransactions,createTransaction,editTransaction,deleteTransaction};