const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://d00419226:CTm9h4qVJPNHGZ7Y@cluster0.h6fp6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
        dbName: "testusers1"
    }
);

const UserSchema = new mongoose.Schema({
    email: {type: String, 
        unique: true
    },
    password: {type: String}
    
})

const User = mongoose.model("User", UserSchema)

module.exports = {
    User
}