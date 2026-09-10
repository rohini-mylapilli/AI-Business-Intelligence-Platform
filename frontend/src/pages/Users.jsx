import { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css";

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

  // Get logged-in admin ID
  const getCurrentUserId = () => {
    const username = localStorage.getItem("username");

    const currentUser = users.find(
      (user) => user.username === username
    );

    return currentUser ? currentUser.id : null;
  };

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem("access");
      console.log("ACCESS TOKEN:", accessToken);

      const response = await axios.get(
        "http://127.0.0.1:8000/api/auth/users/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("USER RESPONSE:", response.data);

      setUsers(response.data);

    } catch (error) {
      console.error("USER ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open Add User form
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

  // Open Edit form
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

  // Create / Update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("access");

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      if (editingUser) {

        // UPDATE
        const updateData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          email: formData.email,
          role: formData.role,
        };

        // Password only if entered
        if (formData.password.trim() !== "") {
          updateData.password = formData.password;
        }

        await axios.patch(
          `http://127.0.0.1:8000/api/auth/users/${editingUser.id}/`,
          updateData,
          { headers }
        );

        alert("User updated successfully");

      } else {

        // CREATE
        await axios.post(
          "http://127.0.0.1:8000/api/auth/users/",
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

      fetchUsers();

    } catch (error) {
      console.error("Save user error:", error);

      if (error.response) {
        console.error("Backend error:", error.response.data);
        alert("Operation failed. Check console.");
      }
    }
  };

  // Delete user
  const handleDelete = async (user) => {

    // Prevent deleting current admin
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
        `http://127.0.0.1:8000/api/auth/users/${user.id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("User deleted successfully");

      fetchUsers();

    } catch (error) {
      console.error("Delete user error:", error);

      if (error.response) {
        console.error("Backend error:", error.response.data);
        alert(
          error.response.data.error ||
          "Unable to delete user"
        );
      }
    }
  };

  return (
    <div className="users-page">

      <h1>Users Management</h1>

      <p>
        Manage Admins, Managers and Employees
      </p>

      {/* Add User Button */}
      <button onClick={openAddForm}>
        Add User
      </button>


      {/* Add / Edit Form */}
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
            <option value="ADMIN">
              Admin
            </option>

            <option value="MANAGER">
              Manager
            </option>

            <option value="EMPLOYEE">
              Employee
            </option>
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


      {/* Users Table */}
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

                <td>
                  {user.id}
                </td>

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