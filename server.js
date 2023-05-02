// Call modules
const { validateJWT , genJWT} = require('./component/auth_func.js');
const express = require('express');
const mongoose = require('mongoose');
// Call .ENV
const dotenv = require('dotenv');
dotenv.config();
// Create Express App
const app = express()
app.use(express.json())
const port = process.env.PORT

// Create Connection
mongoose.connect(process.env.DB_HOST,{useNewUrlParser: true});
mongoose.connection.once('open', function() {
  console.log("Connection Successful!");
});

//Get schema
const userList = require('./models/user')

//Endpoint1 - Get users data by JWT
app.get("/", validateJWT, (req, res) => {
    let username = req.user.username
    let name = req.user.name
    let role = req.user.role
    role = role.charAt(0).toUpperCase()+role.slice(1);
    let iat = req.user.iat
    let exp = req.user.exp
    res.send("Welcome! Mr./Mrs.:"+name+"("+username+"), user_right : "+role+", JWT_issued :"+iat+", JWT_expire :"+exp)
  })

//Endpoint2 - Login to generate JWT
app.post("/login", async (req, res) => {
    const {username, password} = req.body
    const getUser = await userList.find({username: username});
    if (!getUser.length) {return res.send('Incorrect Username')}
    if (getUser[0].password !== password) {return res.send('Incorrect Password')}
    try { 
    const access_token = genJWT(getUser[0]) 
    let id= getUser[0].id
    let name = getUser[0].name
    let role = getUser[0].role

    return res.json({ id,name,username, role ,access_token});
    } catch (err) { return res.sendStatus(400);}

  })

  // Port Listen
  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })