const express = require('express');
const cors = require("cors");
const report = require("./reports");
const fs = require("node:fs");
const userModel = require("./modelUser");
const articleModel = require("./modelarticle");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: 'https://jsnowpiano.github.io/PrinterLogicClientLogAnalyzerClient/', 
    credentials: true
}));

app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

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
    if(unfixedLogString == null) {
        console.log("No logs to parse.")
        return
    }
    seperatedLogList = unfixedLogString.split("\n")
    for (let i = 0; i < seperatedLogList.length; i++) {
        logObjectGenerator(seperatedLogList[i]);
    }
}

app.get('/reports', function (req, res) {
    res.json(report.generateReports(formattedLogsObjectList))
})

app.post('/reports', function (req, res) {
    console.log("Parsing logs: ", req.body.logs)
    parseLogs(req.body.logs)
    res.status(200).send("Logs parsed successfully.")
})

app.post("/user", function(req, res) {
    try {
        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(req.body.password, salt);

        let user = new userModel.User({
            email: req.body.email,
            password: hashedPassword
        });

        user.save()
            .then(() => {
                res.status(201).json({ message: "User created successfully" });
            })
            .catch((err) => {
                res.status(500).json({ message: "Error creating user" });
                console.log(err);
            });
    } catch (err) {
        res.status(500).json({ message: "Error creating user" });
        console.log(err);
    }
})

app.post("/login", function(req, res) {
    try {
        const user = userModel.User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const validPassword = bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        req.session.user = user;
        res.status(200).json({ success: true, message: "Logged in successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error logging in" });
        console.log(err);
    }
});

app.post("/logout", function(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error logging out" });
        }
        res.status(200).json({ success: true, message: "Logged out successfully" });
    });
});

app.get("/user", function (req, res) {
    userModel.User.find({}).then((users) => {
        res.json(users);
    })
})

app.get("/articles", function (req, res) {
    console.log("Getting articles")
    
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
    article.save().then((savedArticle) => {
        res.status(201).json(savedArticle);
    }). catch((err) => {
        res.status(500).json({ message: "Error creating article" });
        console.log(err)
    })
})

app.delete("/articles", function (req, res) {
    articleModel.Article.deleteOne({ description: req.body.description }).then(() => {
 res.status(200).json({ message: "Article deleted successfully" });
    }).catch((err) => { 
        res.status(500).json({ message: "Error deleting article" });
        console.log(err);
    });
}); 

app.patch("/articles/:id", function (req, res) {
    articleModel.Article.updateOne(
        { _id: req.params.id },
        { title: req.body.title, description: req.body.description, explanation: req.body.explanation }
    ).then(() => {
        res.status(200).json({ message: "Article updated successfully" });   
    }).catch((err) => {
        res.status(500).json({ message: "Error updating article" });
        console.log(err);
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log(`Server ready. Listening on port ${PORT}`);
});