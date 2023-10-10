const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors')
const Item = require('../models/item');
const { findOneAndUpdate } = require('../models/user');


// Crud functionalities
//create an item
const createItem = async (req, res)=> {
    req.body.createdBy = req.user.userID;
    const item = await Item.create(req.body)
    res.status(StatusCodes.CREATED).json({item})
}

//get all item
const getItems = async (req, res)=> {
    const items = await Item.find({createdBy: req.user.userID}).sort('createdAt')
    res.status(StatusCodes.OK).json({items, count: items.length})
}

//get a single item
const getItem = async(req, res)=> {
    const {user: {userID}, params:{id:itemID}} = req;
    const item = await Item.findOne({_id: itemID, createdBy:userID})
    if(!item) {
        throw new NotFoundError(`No item with id ${itemID}`)
    }
    res.status(StatusCodes.OK).json({item})
}

//update an item
const updateItem = async (req, res)=> {
    const {user: {userID}, params:{id: itemID}, body: {company, name, price}} = req;
    if(company === '' || price === null || name === '') {
        throw new BadRequestError('company, name and price cant be empty')
    }
    const item = await Item.findOneAndUpdate({_id: itemID, createdBy: userID}, req.body, {new:true, runValidators: true})
    if(!item) {
        throw new NotFoundError(`No item with id ${itemID}`)
    }
    res.status(StatusCodes.OK).json({item})
}

//delete an item
const deleteItem = async (req, res)=> {
    const {user: {userID}, params: {id: itemID}} = req;
  const item = await Item.findOneAndRemove({_id: itemID, createdBy: userID})
  if (!item) {
    throw NotFoundError(`No item with id ${jobID}`);
  }
  res.status(StatusCodes.OK).send();
}

module.exports = {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
}
