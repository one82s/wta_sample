# Prerequisites:

1. Node.js
2. MongoDB


## Initialize a new Node.js project using npm.
npm init -y

## Installing Dependencies
npm install express mongoose body-parser

## Run the server
 node server.js

## URL of the application
http://localhost:3000/

## URL of External API used
https://api.genderize.io?name=


## OAuth requirements
1. Installs the libraries necessary to handle OAuth authentication, user sessions, and Google API interactions.
    - npm install passport passport-google-oauth20 express-session
2. Using environment variables
    - npm install dotenv 
3. URL to test Google OAuth authentication
http://localhost:3000/auth/google

