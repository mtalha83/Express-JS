const express = require("express");
const app = express();
const fs = require("fs");
const {readFile, writeFile} = require("fs/promises"); 
const path = require("path");
const fileName= "data.json"; 
const filePath = path.join(__dirname, fileName);
const logName = "log.txt";
const logPath = path.join(__dirname, logName);
let users;

app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));

app.use((req, res, next)=>{
    const msg = `Request Time: ${ new Date() } :::: Request Path: ${ req.path } \n`;

    fs.appendFile(logPath, msg, "utf-8", (err)=>{
        if(err){
            console.error(err);
        }
    });
    next();
});

function Validator(req,res,next){
    if(!req.body.username || !req.body.age || !req.body.gender || !req.body.firstname || !req.body.lastname){
        return res.status(400).send({message: "All fields are required"});
    };
    next();
};

app.get("/users", async (req,res)=>{

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

app.post("/users", Validator, async (req,res)=>{
    
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

app.put("/users", Validator, async (req,res)=>{
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

app.delete("/users", async (req,res)=>{
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
    console.log("server started");
})

