import React, { useState } from 'react';
import axios from 'axios';

const RuleEngine = () => {
  const [rule, setRule] = useState('');
  const [result, setResult] = useState(null);

  const handleCreateRule = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/rules/create_rule', { ruleString: rule });
      setResult(response.data);
      console.log('Rule created successfully:', response.data);
    } catch (error) {
      console.error('Error creating rule', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={rule}
        onChange={(e) => setRule(e.target.value)}
        placeholder="Enter rule"
      />
      <button onClick={handleCreateRule}>Create Rule</button>
      {result && <div>Rule ID: {result.ruleId}</div>}
      
    </div>
  );
};

export default RuleEngine;
