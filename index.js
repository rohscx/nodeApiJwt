const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');



dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT,
{useNewUrlParser: true },() => 
console.log('connected to db!')
);


// Middleware
app.use(express.json());
// Route Middlewares
app.use('/api/v1/user', authRoute);
app.use('/api/v1/posts', postRoute);

// Unknown Routes
app.use((req, res, next) => {
    res.status(404).send('ノಠ益ಠノ彡┻━┻  404 page')
});

app.listen(8080, () => console.log('Server Up and running'));