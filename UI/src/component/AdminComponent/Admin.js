import React from 'react';
import './Admin.css';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!localStorage.getItem('token') || localStorage.getItem('role') !== 'admin') {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="admin-dashboard">
            <div className="container mt-4">
                <h1 className="text-center mb-4">Admin Dashboard</h1>
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Manage Events</h5>
                                <p className="card-text">View, create, edit, and delete events</p>
                                <button className="btn btn-primary" onClick={() => navigate('/events')}>
                                    Manage Events
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">User Management</h5>
                                <p className="card-text">Manage user accounts and permissions</p>
                                <button className="btn btn-primary" onClick={() => navigate('/users')}>
                                    Manage Users
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Profile Settings</h5>
                                <p className="card-text">Update your admin profile</p>
                                <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
