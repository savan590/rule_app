

const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'operator' or 'operand'
  left: { type: mongoose.Schema.Types.ObjectId, ref: 'Node', default: null }, // Reference to another Node
  right: { type: mongoose.Schema.Types.ObjectId, ref: 'Node', default: null }, // Reference to another Node
  value: { type: String } // Optional value for operands
});

module.exports = mongoose.model('Node', NodeSchema);
