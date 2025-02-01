

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


// Get list of names from MongoDB
app.get('/names', async (request, response) => {
    console.log('here in get names');
    const names = await Names.find();
    response.status(200).json(names);
});

// Fetching the data to insert from External API
app.post('/names', async (request, response) => {
    console.log('here in create user');
    
    
    const nameFromRequest = request.body.name
    const external_API_URL = 'https://api.genderize.io?name='
    let data = '{}';
    try {
        // Send a GET request to the API
        const response = await fetch(external_API_URL+nameFromRequest);
    
    
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
    
    
        // Parse the JSON response
        data = await response.json();
    
    
        // Log the data for now (we will display it later)
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
    const name = new Names({
        name : data.name,
        gender : data.gender,
        count : data.count,
        probability : data.probability,
    });
    
    const newItem = await name.save();
    response.status(201).json({scuccess:true});
});


// Get id that will be updated
app.get('/name/:id', async (request, response) => {
    console.log('here in get name ');
    const id = request.params.id;
    console.log('Name ID is: ', id);
    const name = await Names.findById(id);
    response.status(200).json(name);
});

// Updated data from the ID that will be passed from UI
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

// Delete name based on the ID passed from the UI
app.delete('/name/:id', async (request, response) => {
    console.log('here in delete name ');
    const nameId = request.params.id;
    // Fetch the user from the database
    const nameModel = await Names.findById(nameId);
    await nameModel.deleteOne();
    response.status(200).json({ message : 'Deleted item' });
});