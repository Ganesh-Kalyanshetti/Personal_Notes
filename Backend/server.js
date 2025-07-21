const express = require('express');
require('dotenv').config();
const userroute = require('./Main/routes/RegisterNLogin');
const folder = require('./Main/routes/Folder');
const Contentroutes = require('./Main/routes/content')
const router = express.Router();
const cors =require('cors');
const app = express();
app.use(cors());

const mongoose = require('mongoose');
const mongostring = process.env.DB_url;
app.use(express.json());
const port=3000;

mongoose.connect(mongostring);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

app.use('/', userroute);
app.use('/', folder);
app.use('/', Contentroutes);

app.listen(port, () => {
    console.log(`Server is Started at Port ${port}`);

})