require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const authRoutes = require('./routes/auth');
const assistantshipRoutes = require('./routes/assistantship');
const applicationRoutes = require('./routes/application');

app.use('/api/auth', authRoutes);
app.use('/api/assistantships', assistantshipRoutes);
app.use('/api/applications', applicationRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
