// --experimental-module--es-module-specifier-resolution=node
// const express = require('express');
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/user-routes';
import blogRouter from './routes/blog-routes';
// import routes from '';


const app = express();
app.use(express.json());
app.use("/api/user",router);
app.use("/api/blog",blogRouter);
mongoose.connect('mongodb+srv://sherazahmad720:11223344@cluster0.vnby7f0.mongodb.net/Blog?retryWrites=true&w=majority').then(() =>
    app.listen(5000)).then(() =>
        console.log('Connect to Database and listening on port 5000')
    ).catch((err) =>
        console.log(err)
    );




