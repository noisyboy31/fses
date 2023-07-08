# Welcome to FIRST STAGE EVALUATION SYSTEM

Hello everyone, In this project, we are going to create ** FSES**.
We will take a look at how to create login, registration, profile, reset password route, send Mail, 
upload file for Assistant, Supervisor add information and Program Coodinator add chairperson from the Typescript Frontend and  Node.js backend application.

## Working with the Project

Download this project from above link. Create two configaration files into the project.
First in the client and second in the server.

In the Client Folder create .env file and put this code inside it.

.env

```
REACT_APP_SERVER_DOMAIN='<server_domain>' # example 'http://localhost:8080'
```
## External Mail
After that create a file in the Server Folder with the name config.js and put the below code inside it.
https://ethereal.email/create


## Create a file called config.js to add the database server

```
export default {
    JWT_SECRET : "<secret>",
    EMAIL: "steve.franecki@ethereal.email", // testing email & password
    PASSWORD : "sMf46xCzrvdrxvuagc",
    ATLAS_URI: "<MONGODB_ATLAS_URI>"
}
```

> **Note:** The **ATLAS_URI** is important to work this project.

Now, create all these variables in the project and make sure you set ATLAS_URI variable.
Otherwise, the project will not work.


# Project Information 
Step one      => open new terminal => cd client > npm install 
Step two      => npm run client
Step three    => open new terminal => cd server > npm install
Step four     => npm run server




# fses
FIRST STAGE EVALUATION SYSTEM

## Register 

API => POST http://localhost:8080/api/register

Payload => 
{
  "username": "example123",
  "password": "example123",
  "email": "example@example.com",
  "position": "Office Assistant"
  "profile": "",
}

# RegisterMail

API => POST http://localhost:8080/api/registerMail

Payload => 
{
  "username" : "example123",
  "userEmail" : "example@example.com",
  "text" : "Testing Mail",
  "subject" : "Backend Mail"
}

# Login Authenticate

API => POST http://localhost:8080/api/authenticate

Payload => 
{
  "username" : "example123"
}

# Login

API => POST http://localhost:8080/api/login

Payload => 
{
  "username" : "example123",
  "password" : "example123",
  "position" : "Office Assistant"
}

# Generate OTP

//example123 is the username

API => GET http://localhost:8080/api/generateOTP?username=example123
Payload => 
{
  "username" : "example123"
}

# VerifyOTP

// example123 is the username, 639247 token number

API =>  GET http://localhost:8080/api/verifyOTP?username=example123&code=639247 
{
    "code": "639247"
}


# CreateResetSession

API =>  GET http://localhost:8080/api/createResetSession

Payload => 
{
    "flag" : "true"
}

# ResetPassword

API =>  PUT http://localhost:8080/api/resetPassword

Payload => 
{
    password : "example1234"
    username : "example123"
}


### Assistance Officer 

# Upload Excel File

API => POST http://localhost:8080/api/list

Payload => 
{
    file :  "uploads/1688739790478-978798982-Book2.xlsx" // Excel File 
    name :  "Student Record"
}

Response => 
{
  "items": [
    {
      "_id": "64a81fceab9d9bc94f75eb2e",                     // record unique id given by mongoDB
      "name": "Karthik",
      "file": "uploads/1688739790478-978798982-Book2.xlsx",
      "status": false,
      "__v": 0                                               // value from mongoDB
    }
  ]
}

# Get Excel File

API => GET http://localhost:8080/api/list
Payload =>  No need 


# Export Excel File Detail

API => GET http://localhost:8080/api/items/_id or http://localhost:8080/api/items/64a81fceab9d9bc94f75eb2e
Payload => No Need


# Download Excel Specific File based on _id
API => GET http://localhost:8080/api/download/64a55ca6a5ea443840697e14
Payload => No Need


### Supervisor 

# Add Student Information
API => GET http://localhost:8080/api/examiners/check-eligibility
Payload => No Need


API => POST http://localhost:8080/api/examiners/check-eligibility
Payload =>
{
  "researchTitle": "THE EFFECTIVENESS OF USE CASE DIAGRAMS IN SOFTWARE PROJECT DEVELOPMENT",
  "examiners": [
    {
      "name": "PM TS DR SURIAYATI BT CHUPRAT",
      "designation": "PROFESSOR"
    },
    {
      "name": "DR OTHMAN BIN MOHD YUSOP",
      "designation": "ASSISTANT PROFESSOR"
    },
    {
      "name": "TS DR HASLINA BINTI MD. SARKAN",
      "designation": "ASSISTANT PROFESSOR"
    }
  ],
  "supervisor": {
    "name": "TS DR NORZIHA BINTI MEGAT MOHD ZAINUDDIN",
    "designation": "PROFESSOR"
  },
  "coSupervisor": {
    "name": "DR HAZLIFAH BINTI MOHD RUSLI",
    "designation": "ASSISTANT PROFESSOR"
  },
  "chairperson": {
    "name": "PM TS DR NOR ZAIRAH BINTI AB RAHIM",
    "designation": "ASSISTANT PROFESSOR"
  }
}

# Submit Student Information
API => GET http://localhost:8080/api/submitData
Payload => No Need