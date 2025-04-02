const mongoose = require('mongoose');


const  connectDB = async () =>{
    await mongoose.connect('mongodb://127.0.0.1:27017/test_db').then(()=>console.log("MongoDB Connected Successfully!"))
}

module.exports = connectDB;





