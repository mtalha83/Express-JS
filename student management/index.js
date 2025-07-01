const express = require("express");
const app = express();
const fs = require("fs");
const {readFile, writeFile} = require("fs/promises"); 
const path = require("path");
const fileName= "data.json"; 
const filePath = path.join(__dirname, fileName);
const logName = "log.txt";
const logPath = path.join(__dirname, logName);
const session = require("express-session");
let users;

app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));

app.set("view engine", "ejs");

app.use(session({
    secret: "my_session_secret",
    resave: true,
    saveUninitialized: false,
    name: "lima"
}));

app.use((req, res, next)=>{
    const msg = `Request Time: ${ new Date() } :::: Request Path: ${ req.path } \n`;

    fs.appendFile(logPath, msg, "utf-8", (err)=>{
        if(err){
            console.error(err);
        }
    });
    next();
});

app.use((req,res,next)=>{
    res.locals.user = req.session.user;
    next();
});

function checkLoggedIn (req,res,next){
    if(req.session.user){
        next();
    }else{
        res.redirect("/login");
    }
};

function bypassLogin(req,res,next){
    if(!req.session.user){
        next();
    }else{ 
        res.redirect("/");
    }
};

function Validator(req,res,next){
    if(!req.body.username || !req.body.age || !req.body.gender || !req.body.firstname || !req.body.lastname){
        return res.status(400).send({message: "All fields are required"});
    };
    next();
};

app.get("/", checkLoggedIn, (req,res) => {
    res.render("home");
});

app.get("/login", bypassLogin, (req,res)=>{
    res.render("login", {error: null});
});

app.post("/login", (req,res)=>{
    if(req.body.username === "mtalha" && req.body.password === "123"){
        req.session.user = {id: 1, username: "mtalha", name: "Talha"};
        res.redirect("/");
    }else if(req.body.username === "zakir" && req.body.password === "1234"){
        req.session.user = {id: 2, username: "zakir", name: "Zakir"};
        res.redirect("/");

    }else {
        res.render("login", {error: "wrong credentials"});
    }
});

app.get("/logout", (req,res)=>{
    req.session.destroy();
    res.clearCookie("lima");
    res.redirect("/");
});

app.get("/users", checkLoggedIn, async (req,res)=>{

    users = await readFile(filePath, "utf-8");
    users = users? JSON.parse(users) : [];

    if("users/{:id}"){
            const requiredUser = users.find((user) => user.id == req.query.id);
            if(requiredUser){
                res.status(200).send(JSON.stringify(requiredUser));
            }else{
                res.status(200).send(JSON.stringify(users));
            }
        }
});

app.post("/users", Validator, checkLoggedIn, async (req,res)=>{
    
    users = await readFile(filePath, "utf-8");
    users = users? JSON.parse(users) : [];

    const createUser = {
                        id: Date.now(),
                        username: req.body.username,
                        age: req.body.age,
                        gender: req.body.gender,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                        };

    users.push(createUser);
    console.log(users);
    fs.writeFile(filePath, JSON.stringify(users), "utf-8", (err)=>{
        if(err){
            console.error(err);
        }else{
            res.status(201).send("created-new-user" + JSON.stringify(createUser));            
        }
    });
})

app.put("/users", Validator, checkLoggedIn, async (req,res)=>{
            users = await readFile(filePath, "utf-8");
            users = JSON.parse(users);
            const requiredUser = users.find((user) => user.id == req.query.id);
            const newUpdatedUser=
                        {
                        id: req.query.id,
                        username: req.body.username,
                        age: req.body.age,
                        gender: req.body.gender,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname
                        };

            if(requiredUser){
                const requiredUserIndex = users.findIndex((user) => user.id == req.query.id);
                users.splice(requiredUserIndex,1,newUpdatedUser);
                fs.writeFile(filePath, JSON.stringify(users), "utf-8", (err) => {
                    if(err){
                        console.error(err);
                    }else{
                        res.status(200).send("User-updated" + JSON.stringify(newUpdatedUser));
                    }
                })
            }else{
                res.status(404).send("user not found");
            };
});

app.delete("/users", checkLoggedIn, async (req,res)=>{
            users = await readFile(filePath, "utf-8");
            users = JSON.parse(users);
            const requiredUser = users.find((user) => user.id == req.query.id);
            if(requiredUser){
                const requiredUserIndex = users.findIndex((user) => user.id == req.query.id);
                users.splice(requiredUserIndex,1);
                fs.writeFile(filePath, JSON.stringify(users), "utf-8", (err) => {
                    if(err){
                        console.error(err);
                    }else{
                        res.status(200).send("User deleted");
                    }
                });
            }else{
                res.status(404).send("user not found");
            }
});

app.listen(8000, (req,res) =>{
    console.log("server started at port 8000");
});

