// Call modules
const { validateJWT , genJWT } = require('./component/auth.js');
const express = require('express');
//Get schema
const mongoose = require('mongoose');
const userList = require('./models/user')
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

//Endpoint1 - Get users data by JWT
app.get("/", validateJWT, (req, res) => {
    const user = {username:req.user.username, name:req.user.name,role:req.user.role,iat:req.user.iat,exp:req.user.exp}
    user.role = user.role.charAt(0).toUpperCase()+user.role.slice(1);
    res.json("Welcome! Mr./ Mrs.: "+user.name+"("+user.username+"), user_right : "+user.role+", JWT_issued :"+user.iat+", JWT_expire :"+user.exp)
  })

//Endpoint2 - Login to generate JWT
app.post("/login", async (req, res) => {
    const {username, password} = req.body
    const getUser = await userList.find({username: username});
    if (!getUser.length || getUser[0].password !== password ) {return res.status(401).send('Invalid username or password')}
    try { 
    const access_token = genJWT(getUser[0]) 
    return res.json({ id:getUser[0].id,name:getUser[0].name,username, role:getUser[0].role ,access_token});
    } catch (err) { return res.sendStatus(500);}

  })

  // Port Listen
  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })