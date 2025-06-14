const express = require("express");
const app = express();
const users = [];

app.get("/users", (req,res)=>{
    if("users/{:id}"){
            const requiredUser = users.find((user) => user.id == req.query.id);
            if(requiredUser){
                res.status(200).send(JSON.stringify(requiredUser));
            }else{
                res.status(200).send(JSON.stringify(users));
            }
        }
});

app.post("/users", (req,res)=>{
    const createUser = {
                        id: Date.now(),
                        username: "zero",
                        age: 41,
                        gender: "Male",
                        firstname: "Muhammad",
                        lastname: "Talha",
                        };

    users.push(createUser);
    console.log(users);
    
    res.status(201).send("created-new-user" + JSON.stringify(createUser));
})

app.put("/users", (req,res)=>{
            const requiredUser = users.find((user) => user.id == req.query.id);
            const newUpdatedUser=
                        {
                        id: Date.now(),
                        username: "new-user",
                        age: 18,
                        gender: "Male",
                        firstname: "Muhammad",
                        lastname: "Usman",
                        };

            if(requiredUser){
                const requiredUserIndex = users.findIndex((user) => user.id == req.query.id);
                users.splice(requiredUserIndex,1,newUpdatedUser);
                res.status(200).send("User-updated" + JSON.stringify(newUpdatedUser));
            }else{
                res.status(404).send("user not found");
            };
});

app.delete("/users", (req,res)=>{
            const requiredUser = users.find((user) => user.id == req.query.id);
            if(requiredUser){
                const requiredUserIndex = users.findIndex((user) => user.id == req.query.id);
                users.splice(requiredUserIndex,1);
                res.status(200).send("User deleted");
            }else{
                res.status(404).send("user not found");
            }
});

app.listen(8000, (req,res) =>{
    console.log("server started");
})

