const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('../middleware/errorHandler');
const authRoutes = require('../routes/authRoutes');
// const userRoutes = require('../routes/userRoutes');
// const roleRoutes = require('../routes/roleRoutes');
// const inviteRoutes = require('../routes/inviteRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/roles', roleRoutes);
// app.use('/api/invites', inviteRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
