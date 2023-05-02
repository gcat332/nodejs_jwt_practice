const mongoose = require('mongoose');
const Schema = mongoose.Schema

//// Set Schema
const userSchema = new Schema({
    id: {type :Number, required: true} ,
    username : {type : String, required: true, unique: true},
    password: {type :String, required: true},
    name: {type :String, required: true},
    role: {type :String, required: true}
    },{collection:'user',
    versionKey: false //here
    })

// Export Schema
module.exports = mongoose.model('user',userSchema);
