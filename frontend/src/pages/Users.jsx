import { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css";
import { API_BASE_URL } from "../api";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const getCurrentUserId = () => {
    const username = localStorage.getItem("username");

    const currentUser = users.find(
      (user) => user.username === username
    );

    return currentUser ? currentUser.id : null;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem("access");

      const response = await axios.get(
        `${API_BASE_URL}/api/auth/users/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setUsers(userData);
    } catch (error) {
      console.error("USER ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditingUser(null);

    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
    });

    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);

    setFormData({
      first_name: user.name
        ? user.name.split(" ")[0]
        : "",
      last_name: user.name
        ? user.name.split(" ").slice(1).join(" ")
        : "",
      username: user.username || "",
      email: user.email || "",
      password: "",
      role: user.role || "EMPLOYEE",
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("access");

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      if (editingUser) {
        const updateData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          email: formData.email,
          role: formData.role,
        };

        if (formData.password.trim() !== "") {
          updateData.password = formData.password;
        }

        await axios.patch(
          `${API_BASE_URL}/api/auth/users/${editingUser.id}/`,
          updateData,
          { headers }
        );

        alert("User updated successfully");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/auth/users/`,
          formData,
          { headers }
        );

        alert("User created successfully");
      }

      setShowForm(false);
      setEditingUser(null);

      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        role: "EMPLOYEE",
      });

      await fetchUsers();
    } catch (error) {
      console.error("Save user error:", error);

      if (error.response) {
        alert(
          error.response.data?.error ||
          "Operation failed. Check console."
        );
      } else {
        alert("Unable to save user.");
      }
    }
  };

  const handleDelete = async (user) => {
    const currentUserId = getCurrentUserId();

    if (currentUserId === user.id) {
      alert("You cannot delete your own account.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.username}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const accessToken = localStorage.getItem("access");

      await axios.delete(
        `${API_BASE_URL}/api/auth/users/${user.id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("User deleted successfully");

      await fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);

      if (error.response) {
        alert(
          error.response.data?.error ||
          "Unable to delete user"
        );
      } else {
        alert("Unable to delete user");
      }
    }
  };

  return (
    <div className="users-page">

      <h1>Users Management</h1>

      <p>
        Manage Admins, Managers and Employees
      </p>

      <button onClick={openAddForm}>
        Add User
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>

          <h2>
            {editingUser
              ? "Edit User"
              : "Add New User"}
          </h2>

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder={
              editingUser
                ? "New Password (optional)"
                : "Password"
            }
            value={formData.password}
            onChange={handleChange}
            required={!editingUser}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="EMPLOYEE">Employee</option>
          </select>

          <button type="submit">
            {editingUser
              ? "Update User"
              : "Create User"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingUser(null);
            }}
          >
            Cancel
          </button>

        </form>
      )}

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td colSpan="7">
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="7">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>

                <td>{user.id}</td>

                <td>
                  {user.name || "-"}
                </td>

                <td>
                  {user.username}
                </td>

                <td>
                  {user.role}
                </td>

                <td>
                  {user.email || "-"}
                </td>

                <td>
                  {user.status}
                </td>

                <td>
                  <button
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Users;