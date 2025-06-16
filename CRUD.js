const express = require("express");
const app = express();
const users = [];

app.use(express.urlencoded({ extended: true}));
app.use(express.json({ extended: true}));

app.get("/users{/:id}", (req,res)=>{
    if("!req.params.id"){
        return res.send(users);}

    const requiredUser = users.find((user) => user.id === parseInt(req.params.id));
    
    if(!users) return res.status(404).send({message: "user not found"});
    res.send (requiredUser);

});
app.post("/users", (req,res)=>{
    console.log(req.body);
    
    const createUser = {
                        id: Date.now(),
                        username: req.body.username,
                        age: req.body.age,
                        gender: req.body.gender,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
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
