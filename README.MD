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


### Week 7 
## Implementing Google OAuth
Step 1: Create a Google Developer Console Project
Go to the Google Cloud Console.
Log in with your Google account.
Click Create Project and:
Provide a Project Name (e.g., "My Web App").
Set an Organization (optional).
Click Create.
Once created, navigate to your project by selecting it from the project dropdown menu.


Step 2: Enable the Google OAuth API
In the Google Cloud Console:
Go to APIs & Services > Library.
Search for "Google OAuth 2.0 API."
Click on the API and select Enable.
This enables OAuth for your project, allowing you to use Google's authentication services.


Step 3: Set Up OAuth Consent Screen
Navigate to APIs & Services > OAuth Consent Screen.
Choose External for user type (if your app is accessible to any Google account).
Configure the following:
App Name: The name users will see during authentication.
User Support Email: An email address for user inquiries.
Authorized Domains: Add domains your app will use (e.g., localhost during development or your production domain).
Developer Contact Information: Provide an email for Google to contact you about your app.
Save and continue through the remaining steps, adding scopes if necessary (e.g., access to the user's email or profile).
Publish your app (required if using "External").


Step 4: Create OAuth Credentials
Go to APIs & Services > Credentials.
Click Create Credentials and choose OAuth 2.0 Client ID.
Configure the following:
Application Type: Select Web Application.
Name: Enter a name for the client ID (e.g., "My Web App Client").
Authorized Redirect URIs:
Add http://localhost:3000/auth/google/callback for development.
Add your production callback URL for deployment.
Save your credentials and copy the Client ID and Client Secret. These will be used in your application.


## OAuth requirements
1. Installs the libraries necessary to handle OAuth authentication, user sessions, and Google API interactions.
    - npm install passport passport-google-oauth20 express-session
    - npm install google-auth-library
2. Using environment variables
    - npm install dotenv 
3. URL to test Google OAuth authentication
http://localhost:3000/auth/google

