import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Manageuser.css';
import { FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="manage-users-container" style={{ paddingTop: '80px' }}>
      <h2 className="page-title">Manage Users</h2>
      {error && <p className="text-danger">{error}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="action-buttons">
                  <button className="view-btn" title="View User">
                    <FaEye />
                  </button>
                  <button className="edit-btn" title="Edit User">
                    <FaRegEdit />
                  </button>
                  <button className="delete-btn" title="Delete User">
                    <MdDeleteForever />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
