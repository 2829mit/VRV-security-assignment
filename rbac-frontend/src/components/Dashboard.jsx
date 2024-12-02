import { useState, useEffect } from 'react';
import api from '../utils/axios';
import LogoutButton from './LogoutButton';

function Dashboard() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/users/current-user');
                setUserData(response.data.data);
            } catch (err) {
                console.error("Error:", err);
            }
        };
        fetchUserData();
    }, []);

    if (!userData) {
        return <div className="text-center p-4">Loading dashboard...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <LogoutButton />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                {/* User Info Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">
                        Welcome, {userData.fullName}!
                    </h2>
                    <p className="text-gray-600">
                        Username: {userData.username}
                    </p>
                </div>

                {/* Role-Based Access Section */}
                <div className={`p-4 rounded-lg ${
                    userData.role === 'admin' 
                        ? 'bg-purple-100 border-2 border-purple-300' 
                        : 'bg-blue-100 border-2 border-blue-300'
                }`}>
                    <h3 className={`text-lg font-bold mb-2 ${
                        userData.role === 'admin' 
                            ? 'text-purple-800' 
                            : 'text-blue-800'
                    }`}>
                        {userData.role === 'admin' ? 'Admin Access' : 'User Access'}
                    </h3>
                    
                    <p className={`${
                        userData.role === 'admin' 
                            ? 'text-purple-700' 
                            : 'text-blue-700'
                    }`}>
                        {userData.role === 'admin' 
                            ? "Data shown to Admin: Full access to all features and user management" 
                            : "Data shown to User: Limited access to basic features"
                        }
                    </p>

                    {/* Permissions List */}
                    <div className="mt-4">
                        <h4 className="font-semibold">Your Permissions:</h4>
                        <ul className="list-disc list-inside mt-2">
                            {userData.permissions.map((permission, index) => (
                                <li key={index} className="text-gray-700">
                                    {permission.replace(/_/g, ' ')}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;