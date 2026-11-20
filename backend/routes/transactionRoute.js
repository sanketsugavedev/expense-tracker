const router = require('express').Router();
const {getTransactions,createTransaction, deleteTransaction, editTransaction} = require('../controllers/transactionControllers');

router.get('/', getTransactions);
router.post('/', createTransaction);
router.put('/:id', editTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;