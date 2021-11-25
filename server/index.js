const express=require("express");
const app=express();

const bodyParser = require('body-parser');

const mongoose = require("mongoose");

const users = require('./routes/api/users');
const lists = require('./routes/api/lists');
const cards = require('./routes/api/cards');

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



const db=require('./config/keys').mongoURI;

mongoose
.connect(db)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err)); 


app.get("/",(req,res)=>{
res.send("server is running");
});

//use routes
app.use('/api/users',users);
app.use('/api/lists',lists);
app.use('/api/cards',cards);




const port = process.env.PORT || 5000;

app.listen(port,() =>console.log('server running on port $ {port}'));

