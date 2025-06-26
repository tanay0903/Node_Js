import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    job_title: ""
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:8000/api/users";

  const fetchUsers = async () => {
    const res = await axios.get(API_URL);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.patch(`${API_URL}/${editingId}`, formData);
    } else {
      await axios.post(API_URL, formData);
    }
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      job_title: ""
    });
    setEditingId(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      job_title: user.job_title
    });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchUsers();
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
      <h2>CRUD User Manager</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} />
        <input type="text" name="job_title" placeholder="Job Title" value={formData.job_title} onChange={handleChange} />
        <input type="text" name="job_title" placeholder="Job Title" value={formData.job_title} onChange={handleChange} />

        <div style={{ marginTop: "1rem" }}>
          <button type="submit">
            {editingId ? "Update User" : "Add User"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  first_name: "",
                  last_name: "",
                  email: "",
                  gender: "",
                  job_title: ""
                });
              }}
              style={{ marginLeft: "1rem" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: "1rem" }}>
            <strong>{user.first_name} {user.last_name}</strong> <br />
            {user.email} | {user.gender} | {user.job_title}
            <br />
            <button onClick={() => handleEdit(user)} style={{ marginRight: "1rem" }}>Edit</button>
            <button onClick={() => handleDelete(user.id)} style={{ color: "red" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
