import api from '../utils/axios';
import toast from 'react-hot-toast';

function LogoutButton() {
    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
            toast.success('Logged out successfully');
            window.location.href = '/';
        } catch (err) {
            toast.error('Logout failed: ' + err.message);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
            Logout
        </button>
    );
}

export default LogoutButton; 