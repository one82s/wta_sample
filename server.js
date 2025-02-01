

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

app.listen(PORT, ()=>{console.log('Server is running on port', PORT);});
	
const namesSchema = new mongoose.Schema({
    name : String,
    gender : String,
    count: Number,
    probability: mongoose.Schema.Types.Decimal128,
});


namesSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.probability = ret.probability.toString();
      return ret;
    },
  });

const Names = mongoose.model('names', namesSchema);

app.get('/', async (request, response) => {
    console.log('Connected to Web App');
    response.sendFile(__dirname + '/names.html');
});

// app.get('/names/:id', async (request, response) => {
//     const id = request.params.id;
//     console.log('Name ID is: ', id);
//     const name = await Names.findById(id);
//     response.status(200).json(name);
// });


app.get('/names', async (request, response) => {
    console.log('here in get names');
    const names = await Names.find();
    response.status(200).json(names);
});

app.post('/names', async (request, response) => {
    console.log('here in create user');
    const name = new Names({
        name : request.body.name,
        gender : request.body.gender,
        count : request.body.count,
        probability : request.body.probability,
    });
    const newItem = await name.save();
    response.status(201).json({scuccess:true});
});



app.get('/name/:id', async (request, response) => {
    console.log('here in get name ');
    const id = request.params.id;
    console.log('Name ID is: ', id);
    const name = await Names.findById(id);
    response.status(200).json(name);
});

app.put('/name/:id', async (request, response) => {
    console.log('here in put name ');
    const nameId = request.params.id;
    console.log('Name ID: ', nameId);
    // Fetch the user from the database
    const nameModel = await Names.findById(nameId);
    nameModel.name = request.body.name;
    nameModel.gender = request.body.gender;
    nameModel.count = request.body.count;
    nameModel.probability = request.body.probability;
    const updatedItem = await nameModel.save();
    response.status(200).json(updatedItem);
});


app.delete('/name/:id', async (request, response) => {
    console.log('here in delete name ');
    const nameId = request.params.id;
    // Fetch the user from the database
    const nameModel = await Names.findById(nameId);
    await nameModel.deleteOne();
    response.status(200).json({ message : 'Deleted item' });
});