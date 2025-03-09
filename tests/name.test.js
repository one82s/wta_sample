require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/app");

// Connect to the MongoDB database before all tests
beforeAll(async () => {
  const url = process.env.CONNECTIONSTRING;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Close the connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
  });

// Test retrieving a user by email
it("should get a name", async () => {

  const response = await request(app).get("/names/bob");
  expect(response.status).toBe(200);
  expect(response.body.name).toBe("bob");
  expect(response.body.gender).toBe("male");
  expect(response.body.count).toBe(600);
  expect(response.body.probability).toBe("0.50");
});

// Test returning 404 if user not found
it('should return 404 if name not found', async () => {
    const response = await request(app).get("/names/wendy");
    expect(response.status).toBe(404);
  });
