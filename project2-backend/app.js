const express=require('express');
const authRoute = require('./routes/auth');
const fileRoute = require('./routes/file');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if(err) console.error(err)
        else console.log('DB Connected');
    });

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const app = express();

app.use(express.json());

app.use('/user', authRoute);
app.use('/file', fileRoute);

app.listen(PORT,HOST);
console.log(`Running on http://${HOST}:${PORT}`);