
const express = require('express');
const router = express.Router();
const Rule = require('../models/rule');
const Node = require('../models/node');

router.post('/create_rule', async (req, res) => {
    const { ruleString } = req.body;
    try {
        const rootNode = await parseRuleToAST(ruleString);
        const newRule = new Rule({ ruleString, astRoot: rootNode._id });
        await newRule.save();
        res.status(201).json({ message: 'Rule created successfully', ruleId: newRule._id });
    } catch (error) {
        console.error('Error creating rule:', error);
        res.status(400).json({ message: 'Invalid rule format', error: error.message });
    }
});

router.get('/getrule/:id', async (req, res) => {
    const id = req.params.id
    // Retrieve and populate the entire AST structure for multiple rules
    const rules = await Rule.find({ _id: { $in: id } }).populate({
        path: 'astRoot',
        populate: [
            { path: 'left', populate: { path: 'left right' } },  // Populate recursively
            { path: 'right', populate: { path: 'left right' } }
        ]
    });

    res.status(201).json({ rule: rules });

})
// Combine Rules
router.post('/combine_rules', async (req, res) => {
    const { ruleIds } = req.body;
    try {
        const rules = await Rule.find({ _id: { $in: ruleIds } }).populate('astRoot');
        const combinedAST = combineASTs(rules.map(rule => rule.astRoot));

        res.status(200).json({ message: 'Rules combined', combinedAST });
    } catch (error) {
        res.status(400).json({ message: 'Error combining rules', error });
    }
});

// Evaluate Rule
router.post('/evaluate_rule', async (req, res) => {
    const { ruleId, userData } = req.body;
    try {
        const rule = await Rule.findById(ruleId).populate('astRoot');
        const result = evaluateRule(rule.astRoot, userData);

        res.status(200).json({ result });
    } catch (error) {
        res.status(400).json({ message: 'Error evaluating rule', error });
    }
});

// Helper Functions

async function parseRuleToAST(ruleString) {
    // Simulated parsing logic to handle different rule structures.

    // Example: Splitting by AND/OR (This is very simplified, use a proper parser in production)
    const tokens = ruleString.match(/\((.*?)\)/g); // Match expressions within parentheses

    const rootOperator = ruleString.includes('AND') ? 'AND' : 'OR'; // Determine root operator
    const rootNode = new Node({ type: 'operator', value: rootOperator });

    // Assume two expressions for simplicity, you'd expand this for more complex logic
    const [leftCondition, rightCondition] = tokens;

    // Parse left condition
    const leftNode = new Node({ type: 'operand', value: leftCondition });
    await leftNode.save(); // Save left operand

    // Parse right condition
    const rightNode = new Node({ type: 'operand', value: rightCondition });
    await rightNode.save(); // Save right operand

    // Link left and right operands to the root operator
    rootNode.left = leftNode._id;
    rootNode.right = rightNode._id;

    // Save the root operator node
    await rootNode.save();

    return rootNode; // Return the root node of the AST
}


function combineASTs(astArray) {
    // Combine multiple ASTs using AND operator
    let combinedAST = astArray[0];
    for (let i = 1; i < astArray.length; i++) {
        combinedAST = new Node({
            type: 'operator',
            value: 'AND',
            left: combinedAST,
            right: astArray[i],
        });
    }
    return combinedAST;
}

function evaluateRule(astNode, userData) {
    if (astNode.type === 'operand') {
        return evaluateCondition(astNode.value, userData);
    } else if (astNode.type === 'operator') {
        const leftResult = evaluateRule(astNode.left, userData);
        const rightResult = evaluateRule(astNode.right, userData);
        return astNode.value === 'AND' ? leftResult && rightResult : leftResult || rightResult;
    }
}

function evaluateCondition(condition, userData) {
    // Placeholder for actual condition evaluation
    // For example, parse condition like 'age > 30' and check against userData
    return true; // Dummy return value
}

module.exports = router;
