const express = require('express');
const cors = require("cors");
const report = require("./reports");
const fs = require("node:fs");
const userModel = require("./modelUser");
const articleModel = require("./modelarticle");

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cors());

let formattedLogsObjectList = []

function checkDate(date) {
    if (date.at(4) == "/" && date.at(7) == "/" && date.at(13) == ":" && date.at(16) == ":" && date.at(19) == ":") {
        return true
    } else {
        return false
    }
}

function logObjectGenerator(unfixedLogSubString) {
    if (unfixedLogSubString.length > 20) {
        date = unfixedLogSubString.substr(0, 20)
        
        if (checkDate(date)){
            description = unfixedLogSubString.slice(21)
            description = description.replaceAll("\r", "")
            formattedLogsObjectList.push(
                {
                    id: formattedLogsObjectList.length,
                    date: date,
                    description: description
                }
            )
        }
    }
    
}

function parseLogs(unfixedLogString) {
    seperatedLogList = unfixedLogString.split("\n")
    for (let i = 0; i < seperatedLogList.length; i++) {
        logObjectGenerator(seperatedLogList[i]);
    }
}


app.get('/reports', function (req, res) {
    res.json(report.generateReports(formattedLogsObjectList))
})

app.post('/reports', function (req, res) {
    console.log("Parsing logs.")
    parseLogs(req.body.logs)
    res.status(200).send("Logs parsed sucessfully.")

})

app.post("/user", function(req, res) {
            let user = new userModel.User({
                email: req.body.email,
                password: req.body.password
            });
            user.save()
            .then(() => {
                res.status(201).send("User created successfully");
            })
            .catch((err) => {
                res.status(500).send("Error creating user");
                console.log(err);
            });
    })

app.get("/user", function (req, res) {
    userModel.User.find({}).then((users) => {
        res.json(users);
    })
})

app.get("/articles", function (req, res) {
    articleModel.Article.find({}).then((articles) => {
        res.json(articles);
    })
})

app.post("/articles", function (req, res) {
    let article = new articleModel.Article({
        title: req.body.title,
        description: req.body.description,
        explanation: req.body.explanation
    })
    article.save().then(() => {
        res.status(201).send("Article created successfully")
    }). catch((err) => {
        res.status(500).send("Error creating article")
        console.log(err)
    })
})

app.listen(8080, function() {
    console.log("Server ready. listening on port 8080")
})

