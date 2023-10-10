const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name must be provided'],
    minlength: 3,
    maxlength: 50,
  },
  company: {
    type: String,
    required: [true, 'company must be provided'],
    minlength: 3,
    maxlength: 50,
  },
  condition: {
    type: String,
    enum: ['used', 'brand-new', 'partially used'],
    default: 'brand-new'
  },
  price: {
    type: Number,
    required: [true, 'please provide price']
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'please provide user']
  }
}, {timestamps: true});

module.exports = mongoose.model('Item', ItemSchema)