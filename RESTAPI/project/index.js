const express = require('express');
const users = require("./MOCK_DATA.json");
const fs =  require('fs');
const cors = require('cors');

const app = express();
const PORT = 8000;
app.use(cors());

app.use(express.urlencoded({extended: false}));
app.use(express.json()); 

app.get("/users", (req,res) => {
    const html = `
    <ul>
    ${users.map((user) =>`<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

//ROUTES
app.get("/api/users", (req, res) => {
    //GET ALL USERS
    return res.json(users);
});

app.route("/api/users/:id")

    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
        })

    .patch((req, res) => {
        //EDIT USER WITH ID
        const id = Number(req.params.id);
        const body = req.body;

        const userIndex = users. findIndex((user) => user.id === id);
        if (userIndex === -1){
            return res.status(404).json({error: "User not found"});
        }
        // Update the user
        users[userIndex] = {...users[userIndex], ...body};

        //write the updated users to the file
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
            if(err){
                return res.status(500).json({error: "Failed to update user"});
            }
            return res.json({status: "user updated suceessfully", user : users[userIndex]});
        })
    })
    .delete((req, res) => {
        //DELETE USER WITH ID
        const id = Number(req.params.id);

        const userIndex = users.findIndex((user) => user.id === id);
        if (userIndex === -1){
            return res.status(404).json({error: "User not found"});
        }

        // Remove the user  
        users.splice(userIndex, 1);
        //write the updated users to the file
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
            if(err){
                return res.status(500).json({error: "Failed to delete user"});
            }
            return res.json({status: "user deleted successfully"});
        });
    }); 

app.post("/api/users", (req, res) => {
    //CREATE USER
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) =>{
        return res.json({status:"successful creation", id: users.length});
    })
});



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));