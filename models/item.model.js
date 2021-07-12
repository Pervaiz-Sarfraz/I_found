const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  properties: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['LOST', 'FOUND'],
  },
  private: {
    type: Boolean,
    default: false,
  },
  img: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  dept: {
    type: String,
    required: true,
  },
  regNo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Item', itemSchema);
