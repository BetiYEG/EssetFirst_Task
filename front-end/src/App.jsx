import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making API calls
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load users from API on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Handle form submission (Add/Edit user)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please fill in both fields");
      return;
    }

    if (isEditing) {
      // Update user
      axios
        .put(`http://localhost:3000/users/${currentUser.id}`, { name, email })
        .then((response) => {
          const updatedUsers = users.map((user) =>
            user.id === currentUser.id ? response.data : user
          );
          setUsers(updatedUsers);
          setIsEditing(false);
          setCurrentUser(null);
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    } else {
      // Add new user
      axios
        .post("http://localhost:3000/users", { name, email })
        .then((response) => {
          setUsers([...users, response.data]);
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    }
    setName("");
    setEmail("");
  };

  // Handle edit button click
  const handleEdit = (user) => {
    setIsEditing(true);
    setName(user.name);
    setEmail(user.email);
    setCurrentUser(user);
  };

  // Handle delete button click
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <div className="container">
      <h1>User List</h1>

      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">{isEditing ? "Update User" : "Add User"}</button>
      </form>

      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>
            <span>
              {user.name} - {user.email}
            </span>
            <button onClick={() => handleEdit(user)} className="edit">
              Edit
            </button>
            <button onClick={() => handleDelete(user.id)} className="delete">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
