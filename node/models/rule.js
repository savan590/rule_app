
const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
    ruleString: { type: String, required: true },
    astRoot: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' }, // Reference to the root node of the AST
});

module.exports = mongoose.model('Rule', RuleSchema);
