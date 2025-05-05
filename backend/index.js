require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const authRoutes = require('./routes/auth');
const assistantshipRoutes = require('./routes/assistantship');
const applicationRoutes = require('./routes/application');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/assistantships', assistantshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/user', userRoutes);

app.use('/uploads', express.static('uploads'));

app.listen(4898, () => console.log('Server running on port 4898'));
