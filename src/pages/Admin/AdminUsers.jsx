import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './AdminUsers.css';

const ROLE_META = {
    FARMER:   { label: 'Farmer',   icon: '🌾', cls: 'role-farmer'   },
    CONSUMER: { label: 'Consumer', icon: '🛒', cls: 'role-consumer'  },
    DRIVER:   { label: 'Driver',   icon: '🚚', cls: 'role-driver'    },
    ADMIN:    { label: 'Admin',    icon: '🛡️', cls: 'role-admin'     },
};

const STATUS_META = {
    ACTIVE:    { label: 'Active',    cls: 'status-active'    },
    INACTIVE:  { label: 'Inactive',  cls: 'status-inactive'  },
    SUSPENDED: { label: 'Suspended', cls: 'status-suspended' },
};

function getInitials(name = '') {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = {
    FARMER:   { bg: '#E1F5EE', color: '#0F6E56' },
    CONSUMER: { bg: '#E6F1FB', color: '#185FA5' },
    DRIVER:   { bg: '#FAEEDA', color: '#854F0B' },
    ADMIN:    { bg: '#EEEDFE', color: '#534AB7' },
};

function AdminUsers() {
    const [users, setUsers]               = useState([]);
    const [stats, setStats]               = useState({ total: 0, farmers: 0, consumers: 0, drivers: 0, admins: 0 });
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState('');
    const [roleFilter, setRoleFilter]     = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [page, setPage]                 = useState(1);
    const [totalPages, setTotalPages]     = useState(1);
    const [actionLoading, setActionLoading] = useState(null);

    const PAGE_SIZE = 10;

    useEffect(() => {
        fetchUsers();
    }, [page, roleFilter, statusFilter]);

    const getToken = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.token;
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page - 1,
                size: PAGE_SIZE,
                ...(roleFilter   !== 'ALL' && { role: roleFilter }),
                ...(statusFilter !== 'ALL' && { status: statusFilter }),
                ...(search.trim() && { search: search.trim() }),
            });

            const res = await fetch(`http://localhost:8080/api/admin/users?${params}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();

            console.log(data);

            setUsers(data.content || data.users || []);
            setTotalPages(data.totalPages || Math.ceil((data.total || 0) / PAGE_SIZE));
            setStats({
                total:     data.totalUsers     ?? data.total ?? 0,
                farmers:   data.totalFarmers   ?? 0,
                consumers: data.totalConsumers ?? 0,
                drivers:   data.totalDrivers   ?? 0,
                admins:    data.totalAdmins    ?? 0,
            });
        } catch (err) {
            console.error(err);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleSuspend = async (userId, currentStatus) => {
        const isSuspended = currentStatus === 'SUSPENDED';
        const endpoint    = isSuspended ? 'unsuspend' : 'suspend';
        try {
            setActionLoading(userId);
            const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/${endpoint}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            toast.success(`User ${isSuspended ? 'unsuspended' : 'suspended'} successfully`);
            fetchUsers();
        } catch {
            toast.error('Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        try {
            setActionLoading(userId);
            const res = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error();
            toast.success('User deleted');
            fetchUsers();
        } catch {
            toast.error('Failed to delete user');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter(u =>
        !search.trim() ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="au-page">
            {/* Header */}
            <header className="au-header">
                <div>
                    <h1>Manage Users 👥</h1>
                    <p>View, filter, and manage all registered platform users</p>
                </div>
                <button className="au-back-btn" onClick={() => window.location.href = '/admin'}>
                    ← Back to Dashboard
                </button>
            </header>

            {/* Stats */}
            <div className="au-stats">
                {[
                    { label: 'Total Users',  val: stats.total     },
                    { label: 'Farmers',      val: stats.farmers   },
                    { label: 'Consumers',    val: stats.consumers },
                    { label: 'Drivers',      val: stats.drivers   },
                    { label: 'Admins',       val: stats.admins    },
                ].map(s => (
                    <div className="au-stat" key={s.label}>
                        <p className="au-stat-label">{s.label}</p>
                        <p className="au-stat-val">{s.val}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <form className="au-toolbar" onSubmit={handleSearch}>
                <div className="au-search-wrap">
                    <span className="au-search-icon">🔍</span>
                    <input
                        className="au-search"
                        type="text"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <select className="au-select" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
                    <option value="ALL">All roles</option>
                    <option value="FARMER">Farmer</option>
                    <option value="CONSUMER">Consumer</option>
                    <option value="DRIVER">Driver</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <select className="au-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                    <option value="ALL">All statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                </select>

                <button type="submit" className="au-search-btn">Search</button>
            </form>

            {/* Table */}
            <div className="au-table-wrap">
                {loading ? (
                    <div className="au-empty">Loading users…</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="au-empty">No users found.</div>
                ) : (
                    <table className="au-table">
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map(user => {
                            const role       = ROLE_META[user.role]   || ROLE_META.CONSUMER;
                            const status     = STATUS_META[user.status] || STATUS_META.INACTIVE;
                            const avatarStyle = AVATAR_COLORS[user.role] || AVATAR_COLORS.CONSUMER;
                            const isSuspended = user.status === 'SUSPENDED';
                            const isAdmin     = user.role === 'ADMIN';

                            return (
                                <tr key={user.id}>
                                    <td>
                                        <div className="au-user-cell">
                                            <div className="au-avatar" style={{ background: avatarStyle.bg, color: avatarStyle.color }}>
                                                {getInitials(user.name)}
                                            </div>
                                            <div>
                                                <div className="au-name">{user.name}</div>
                                                <div className="au-email">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                            <span className={`au-badge ${role.cls}`}>
                                                {role.icon} {role.label}
                                            </span>
                                    </td>
                                    <td>
                                            <span className={`au-badge ${status.cls}`}>
                                                {status.label}
                                            </span>
                                    </td>
                                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                                    <td>
                                        <div className="au-actions">
                                            <button
                                                className="au-action-btn"
                                                title="View profile"
                                                onClick={() => window.location.href = `/admin/users/${user.id}`}
                                            >👁️</button>

                                            {!isAdmin && (
                                                <>
                                                    <button
                                                        className={`au-action-btn ${isSuspended ? 'au-action-warn' : 'au-action-danger'}`}
                                                        title={isSuspended ? 'Unsuspend user' : 'Suspend user'}
                                                        disabled={actionLoading === user.id}
                                                        onClick={() => handleSuspend(user.id, user.status)}
                                                    >
                                                        {isSuspended ? '🔓' : '🔒'}
                                                    </button>

                                                    <button
                                                        className="au-action-btn au-action-danger"
                                                        title="Delete user"
                                                        disabled={actionLoading === user.id}
                                                        onClick={() => handleDelete(user.id)}
                                                    >🗑️</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="au-pagination">
                        <span>Page {page} of {totalPages}</span>
                        <div className="au-page-btns">
                            <button className="au-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                return (
                                    <button
                                        key={p}
                                        className={`au-page-btn ${p === page ? 'active' : ''}`}
                                        onClick={() => setPage(p)}
                                    >{p}</button>
                                );
                            })}
                            <button className="au-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsers;