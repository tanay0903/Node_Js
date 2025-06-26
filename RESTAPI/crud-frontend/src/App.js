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
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const API_URL = "http://localhost:8000/api/users";

  // Fetch users from server (with optional search)
  const fetchUsers = async (query = "") => {
    try {
      const res = await axios.get(`${API_URL}?search=${query}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.patch(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      resetForm();
      fetchUsers(searchTerm);
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  // Set data in form when editing
  const handleEdit = (user) => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      job_title: user.job_title
    });
    setEditingId(user.id);
    setShowForm(true); // Show form when editing
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers(searchTerm);
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // Reset form and editing state
  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      job_title: ""
    });
    setEditingId(null);
    setShowForm(false); // Hide form on cancel or after submission
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchUsers(value);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
      <h2>CRUD User Manager</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by ID, name, email or job title"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "1rem", width: "100%", padding: "0.5rem" }}
      />

      {/* ➕ Toggle Form */}
      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: "1rem" }}>
        {showForm ? "Close Form" : "Add User"}
      </button>

      {/* 📝 User Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} />
          <input type="text" name="job_title" placeholder="Job Title" value={formData.job_title} onChange={handleChange} />

          <div style={{ marginTop: "1rem" }}>
            <button type="submit">{editingId ? "Update User" : "Submit"}</button>
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: "1rem" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* 📃 User List */}
      <ul style={{ paddingLeft: "0" }}>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: "1.5rem", listStyle: "none" }}>
            <strong>{user.first_name} {user.last_name}</strong><br />
            {user.email} <br />
            {user.gender} | {user.job_title}
            <br />
            <button onClick={() => handleEdit(user)} style={{ marginTop: "0.5rem" }}>Edit</button>
            <button onClick={() => handleDelete(user.id)} style={{ marginLeft: "1rem", color: "red" }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
