const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(__dirname));

const uri = 'mongodb+srv://user1:passW0rd@cluster0.51lmx.mongodb.net/testDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri);

const connect = mongoose.connection;

connect.on('error', console.error.bind(console, 'MongoDB connection error:'));

connect.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(PORT, ()=>{console.log('Server is running on port ${PORT}');});
	
const usersSchema = new mongoose.Schema({
    userId : String,
    userName : String,
});

const Users = mongoose.model('users', usersSchema);

app.get('/', async (request, response) => {
    console.log('Connected to Web App');
    response.sendFile(__dirname + '/user.html');
});


app.post('/users', async (request, response) => {
    console.log('here in create user');
    const user = new Users({
        userId : request.body.userId,
        userName : request.body.userName,
    });
    const newItem = await user.save();
    response.status(201).json({scuccess:true});
});

app.get('/users', async (request, response) => {
    console.log('here in get users');
    const users = await Users.find();
    response.status(200).json(users);
});
