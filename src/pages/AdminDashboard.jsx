import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/Auth';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // userId of ongoing action

    // ─────────────────────────────────────────
    // Fetch all users on mount
    // ─────────────────────────────────────────
    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/admin/users`, {
                withCredentials: true
            });
            setUsers(res.data.users);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }

    // ─────────────────────────────────────────
    // Promote user → artist
    // ─────────────────────────────────────────
    async function handlePromote(userId, username) {
        if (!confirm(`Promote ${username} to artist?`)) return;
        setActionLoading(userId);
        try {
            const res = await axios.patch(
                `${API}/admin/promote/${userId}`,
                {},
                { withCredentials: true }
            );
            toast.success(res.data.message);
            fetchUsers(); // refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || "Promote failed");
        } finally {
            setActionLoading(null);
        }
    }

    // ─────────────────────────────────────────
    // Demote artist → user
    // ─────────────────────────────────────────
    async function handleDemote(userId, username) {
        if (!confirm(`Demote ${username} to regular user?`)) return;
        setActionLoading(userId);
        try {
            const res = await axios.patch(
                `${API}/admin/demote/${userId}`,
                {},
                { withCredentials: true }
            );
            toast.success(res.data.message);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Demote failed");
        } finally {
            setActionLoading(null);
        }
    }

    // ─────────────────────────────────────────
    // Delete user
    // ─────────────────────────────────────────
    async function handleDelete(userId, username) {
        if (!confirm(`Permanently delete ${username}? This cannot be undone.`)) return;
        setActionLoading(userId);
        try {
            const res = await axios.delete(
                `${API}/admin/user/${userId}`,
                { withCredentials: true }
            );
            toast.success(res.data.message);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete failed");
        } finally {
            setActionLoading(null);
        }
    }

    // ─────────────────────────────────────────
    // Role badge color
    // ─────────────────────────────────────────
    function getRoleBadge(role) {
        const styles = {
            admin: "bg-red-100 text-red-700 border border-red-300",
            artist: "bg-orange-100 text-orange-700 border border-orange-300",
            user: "bg-green-100 text-green-700 border border-green-300",
        };
        return styles[role] || "bg-gray-100 text-gray-700";
    }

    // ─────────────────────────────────────────
    // UI
    // ─────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500">Logged in as 
                        <span className="font-semibold text-red-500"> {user?.username}</span>
                    </p>
                </div>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-semibold"
                >
                    Logout
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <p className="text-3xl font-bold text-gray-800">{users.length}</p>
                        <p className="text-sm text-gray-500 mt-1">Total Users</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <p className="text-3xl font-bold text-orange-500">
                            {users.filter(u => u.role === 'artist').length}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Artists</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                        <p className="text-3xl font-bold text-green-500">
                            {users.filter(u => u.role === 'user').length}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Listeners</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
                        <button
                            onClick={fetchUsers}
                            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading users...</div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">No users found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3 text-left">User</th>
                                        <th className="px-6 py-3 text-left">Email</th>
                                        <th className="px-6 py-3 text-left">Role</th>
                                        <th className="px-6 py-3 text-left">Verified</th>
                                        <th className="px-6 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((u) => (
                                        <tr key={u._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-800">{u.username}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadge(u.role)}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {u.isVerified
                                                    ? <span className="text-green-500 font-medium">✓ Yes</span>
                                                    : <span className="text-red-400">✗ No</span>
                                                }
                                            </td>
                                            <td className="px-6 py-4">

                                                {/* Skip actions for admin accounts */}
                                                {u.role === 'admin' ? (
                                                    <span className="text-xs text-gray-400 italic">Admin account</span>
                                                ) : (
                                                    <div className="flex gap-2">

                                                        {/* Promote — only for regular users */}
                                                        {u.role === 'user' && (
                                                            <button
                                                                onClick={() => handlePromote(u._id, u.username)}
                                                                disabled={actionLoading === u._id}
                                                                className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg font-semibold transition disabled:opacity-50"
                                                            >
                                                                {actionLoading === u._id ? '...' : '⬆ Artist'}
                                                            </button>
                                                        )}

                                                        {/* Demote — only for artists */}
                                                        {u.role === 'artist' && (
                                                            <button
                                                                onClick={() => handleDemote(u._id, u.username)}
                                                                disabled={actionLoading === u._id}
                                                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-semibold transition disabled:opacity-50"
                                                            >
                                                                {actionLoading === u._id ? '...' : '⬇ User'}
                                                            </button>
                                                        )}

                                                        {/* Delete — always shown for non-admin */}
                                                        <button
                                                            onClick={() => handleDelete(u._id, u.username)}
                                                            disabled={actionLoading === u._id}
                                                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-semibold transition disabled:opacity-50"
                                                        >
                                                            {actionLoading === u._id ? '...' : '🗑 Delete'}
                                                        </button>

                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}