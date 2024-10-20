const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ruleRoutes = require('./routes/rules');
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

app.use(bodyParser.json());
app.use(cors())

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/rules', ruleRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
