const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://d00419226:CTm9h4qVJPNHGZ7Y@cluster0.h6fp6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
        dbName: "testarticles"
    }
);

const ArticleSchema = new mongoose.Schema ({
    title: {
        type: String,
        min: 4
    },
    description: {
        type: String,
        unique: true,
        min: 4
    },
    explanation: {
        type: String
    }
})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = {
    Article
}