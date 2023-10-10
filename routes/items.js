const express = require('express')
const {    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem} = require('../controllers/items')

const router = express.Router()


router.route('/').get(getItems).post(createItem)
router.route('/:id').get(getItem).patch(updateItem).delete(deleteItem)

module.exports = router