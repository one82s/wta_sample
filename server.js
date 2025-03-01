require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const responser = require("responser").default;
const db = require("./lib/db");
const { passport, app } = require("./lib/auth");
const helmet = require('helmet');

const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(__dirname));

app.use(responser);

app.use(  helmet());
// Used for centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

app.get("/", (req, res) => {
  console.log("'Helmet is protecting this app!");
  res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/index");
  }
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.get("/index", async (request, response) => {
  console.log("Connected to Web App");
  response.sendFile(__dirname + "/names.html");
});

// Get list of names from MongoDB
app.get("/names", async (request, response) => {
  console.log("here in get names");
  const names = await db.nameSchema.find();
  response.status(200).json(names);
});

// Fetching the data to insert from External API
app.post("/names", async (request, response) => {
  console.log("here in create user");

  const nameFromRequest = request.body.name;
  const external_API_URL = "https://api.genderize.io?name=";
  let data = "{}";
  //Handling asynchronous errors
  try {
    // Send a GET request to the API
    const response = await fetch(external_API_URL + nameFromRequest);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the JSON response
    data = await response.json();

    // Log the data for now (we will display it later)
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
  const Names = db.nameSchema;
  const name = new Names({
    name: data.name,
    gender: data.gender,
    count: data.count,
    probability: data.probability,
  });

  const newItem = await name.save();
  response.send_created("Item created successfully", newItem.name)
});

// Get id that will be updated
app.get("/name/:id", async (request, response) => {
  console.log("here in get name ");
  const id = request.params.id;
  console.log("Name ID is: ", id);
  const name = await db.nameSchema.findById(id);
  response.send_ok(true, "ID ", name._id, "retreived successfully");
});

// Updated data from the ID that will be passed from UI
app.put("/name/:id", async (request, response) => {
  console.log("here in put name ");
  const nameId = request.params.id;
  // adding validation and handling specific errors
  if (!nameId) {
    const error = new Error("Name ID  is required");
    error.status = 400;
    next(error);
  }

  console.log("Name ID: ", nameId);
  // Fetch the user from the database
  const nameModel = await db.nameSchema.findById(nameId);
  nameModel.name = request.body.name;
  nameModel.gender = request.body.gender;
  nameModel.count = request.body.count;
  nameModel.probability = request.body.probability;
  const updatedItem = await nameModel.save();
  response.send_ok(true, "Item updated successfully")
});

// Delete name based on the ID passed from the UI
app.delete("/name/:id", async (request, response) => {
  console.log("here in delete name ");
  const nameId = request.params.id;
  // Fetch the user from the database
  const nameModel = await db.nameSchema.findById(nameId);
  await nameModel.deleteOne();
  response.send_ok(true, "Item deleted successfully")
});

app.use((req, res, next) => {
  res.send_badRequest("Endpoint not defined");
});
