const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 8000;
const DATA_PATH = path.join(__dirname, "MOCK_DATA.json");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const getUsers = () => JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

app.get("/users", (req, res) => {
  const users = getUsers();
  const html = `
    <ul>
      ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});

// GET user data 
app.get("/api/users", (req, res) => {
  const users = getUsers();
  const search = req.query.search?.toLowerCase();

  if (search) {
    const seen = new Set();

    const filtered = users.filter((user) => {
      const idMatch = user.id.toString() === search;
      const fieldMatch =
        user.first_name.toLowerCase().includes(search) ||
        user.last_name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.job_title.toLowerCase().includes(search);

      const matched = idMatch || fieldMatch;

      // check duplicates
      if (matched && !seen.has(user.id)) {
        seen.add(user.id);
        return true;
      }

      return false;
    });

    return res.json(filtered);
  }

  return res.json(users);
});

// Create a new user
app.post("/api/users", (req, res) => {
  const users = getUsers();
  const newUser = { ...req.body, id: users.length + 1 };
  users.push(newUser);

  fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Failed to create user" });
    return res.json({ status: "User created successfully", id: newUser.id });
  });
});

// Update a user by ID
app.patch("/api/users/:id", (req, res) => {
  const users = getUsers();
  const id = Number(req.params.id);
  const updates = req.body;

  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users[userIndex] = { ...users[userIndex], ...updates };

  fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Failed to update user" });
    return res.json({ status: "User updated successfully", user: users[userIndex] });
  });
});

// Remove a user by ID
app.delete("/api/users/:id", (req, res) => {
  let users = getUsers();
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);

  fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete user" });
    return res.json({ status: "User deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
