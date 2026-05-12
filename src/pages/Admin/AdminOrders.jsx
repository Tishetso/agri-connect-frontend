import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './AdminOrders.css';

const STATUS_META = {
    PENDING:    { cls: 'status-pending',    label: 'Pending'    },
    CONFIRMED:  { cls: 'status-confirmed',  label: 'Confirmed'  },
    PROCESSING: { cls: 'status-processing', label: 'Processing' },
    SHIPPED:    { cls: 'status-shipped',    label: 'Shipped'    },
    DELIVERED:  { cls: 'status-delivered',  label: 'Delivered'  },
    CANCELLED:  { cls: 'status-cancelled',  label: 'Cancelled'  },
};

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PER_PAGE = 10;

export default function AdminOrders() {
    const [orders, setOrders]               = useState([]);
    const [loading, setLoading]             = useState(true);
    const [filter, setFilter]               = useState('ALL');
    const [searchInput, setSearchInput]     = useState('');
    const [search, setSearch]               = useState('');
    const [selected, setSelected]           = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [page, setPage]                   = useState(1);

    useEffect(() => { fetchOrders(); }, []);

    const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/admin/orders', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) setOrders(await res.json());
            else toast.error('Failed to load orders');
        } catch { toast.error('Network error'); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            setActionLoading(id + status);
            const res = await fetch(`http://localhost:8080/api/admin/orders/${id}/status`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
                if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
                toast.success(`Order marked as ${status.toLowerCase()}`);
            } else toast.error('Failed to update order');
        } catch { toast.error('Network error'); }
        finally { setActionLoading(null); }
    };

    const handleSearch = () => { setSearch(searchInput); setPage(1); };

    const filtered = orders.filter(o => {
        const matchFilter = filter === 'ALL' || o.status === filter;
        const q = search.toLowerCase();
        const matchSearch = !search ||
            String(o.id).includes(q) ||
            o.consumerName?.toLowerCase().includes(q) ||
            o.farmerName?.toLowerCase().includes(q);
        return matchFilter && matchSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const counts = FILTERS.reduce((acc, f) => {
        acc[f] = f === 'ALL' ? orders.length : orders.filter(o => o.status === f).length;
        return acc;
    }, {});

    const initials = (name = '') => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const totalRevenue = orders
        .filter(o => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return (
        <div className="ao-page">
            {/* Header */}
            <div className="ao-header">
                <div>
                    <h1>📋 Manage Orders</h1>
                    <p>Track, update, and oversee all platform orders</p>
                </div>
                <button className="ao-back-btn" onClick={() => window.location.href = '/admin'}>
                    ← Back to Dashboard
                </button>
            </div>

            {/* Stats */}
            <div className="ao-stats">
                <div className="ao-stat">
                    <div className="ao-stat-label">Total Orders</div>
                    <div className="ao-stat-val">{counts.ALL}</div>
                </div>
                <div className="ao-stat ao-stat-yellow">
                    <div className="ao-stat-label">Pending</div>
                    <div className="ao-stat-val">{counts.PENDING}</div>
                </div>
                <div className="ao-stat ao-stat-blue">
                    <div className="ao-stat-label">Processing</div>
                    <div className="ao-stat-val">{(counts.CONFIRMED || 0) + (counts.PROCESSING || 0)}</div>
                </div>
                <div className="ao-stat ao-stat-purple">
                    <div className="ao-stat-label">Shipped</div>
                    <div className="ao-stat-val">{counts.SHIPPED}</div>
                </div>
                <div className="ao-stat ao-stat-green">
                    <div className="ao-stat-label">Delivered</div>
                    <div className="ao-stat-val">{counts.DELIVERED}</div>
                </div>
                <div className="ao-stat ao-stat-red">
                    <div className="ao-stat-label">Cancelled</div>
                    <div className="ao-stat-val">{counts.CANCELLED}</div>
                </div>
                <div className="ao-stat ao-stat-green">
                    <div className="ao-stat-label">Revenue</div>
                    <div className="ao-stat-val ao-stat-val-sm">R{totalRevenue.toFixed(2)}</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="ao-toolbar">
                <div className="ao-search-wrap">
                    <span className="ao-search-icon">🔍</span>
                    <input
                        className="ao-search"
                        type="text"
                        placeholder="Search by order ID, consumer, or farmer…"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <select
                    className="ao-select"
                    value={filter}
                    onChange={e => { setFilter(e.target.value); setPage(1); }}
                >
                    {FILTERS.map(f => (
                        <option key={f} value={f}>{f} ({counts[f]})</option>
                    ))}
                </select>
                <button className="ao-search-btn" onClick={handleSearch}>Search</button>
                <button className="ao-search-btn ao-refresh-btn" onClick={fetchOrders}>↻ Refresh</button>
            </div>

            {/* Table */}
            <div className="ao-table-wrap">
                {loading ? (
                    <div className="ao-empty">⏳ Loading orders…</div>
                ) : paginated.length === 0 ? (
                    <div className="ao-empty">📭 No orders found</div>
                ) : (
                    <table className="ao-table">
                        <thead>
                        <tr>
                            <th>Order</th>
                            <th>Consumer</th>
                            <th>Farmer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginated.map(order => {
                            const sm   = STATUS_META[order.status] || { cls: 'status-inactive', label: order.status };
                            const busy = !!actionLoading;
                            return (
                                <tr key={order.id} onClick={() => setSelected(order)} style={{ cursor: 'pointer' }}>
                                    <td>
                                        <div className="ao-order-id">#{order.id}</div>
                                    </td>
                                    <td>
                                        <div className="ao-user-cell">
                                            <div className="ao-avatar ao-avatar-consumer">
                                                {initials(order.consumerName)}
                                            </div>
                                            <span>{order.consumerName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="ao-user-cell">
                                            <div className="ao-avatar ao-avatar-farmer">
                                                {initials(order.farmerName)}
                                            </div>
                                            <span>{order.farmerName}</span>
                                        </div>
                                    </td>
                                    <td>{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</td>
                                    <td><strong>R{order.totalAmount?.toFixed(2)}</strong></td>
                                    <td>
                                        <span className={`ao-badge ${sm.cls}`}>{sm.label}</span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <div className="ao-actions">
                                            {order.status === 'PENDING' && (
                                                <button className="ao-action-btn ao-action-approve" title="Confirm" disabled={busy} onClick={() => updateStatus(order.id, 'CONFIRMED')}>✓</button>
                                            )}
                                            {order.status === 'CONFIRMED' && (
                                                <button className="ao-action-btn ao-action-blue" title="Mark Processing" disabled={busy} onClick={() => updateStatus(order.id, 'PROCESSING')}>⚙</button>
                                            )}
                                            {order.status === 'PROCESSING' && (
                                                <button className="ao-action-btn ao-action-purple" title="Mark Shipped" disabled={busy} onClick={() => updateStatus(order.id, 'SHIPPED')}>🚚</button>
                                            )}
                                            {order.status === 'SHIPPED' && (
                                                <button className="ao-action-btn ao-action-approve" title="Mark Delivered" disabled={busy} onClick={() => updateStatus(order.id, 'DELIVERED')}>📦</button>
                                            )}
                                            {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                                                <button className="ao-action-btn ao-action-danger" title="Cancel" disabled={busy} onClick={() => updateStatus(order.id, 'CANCELLED')}>✕</button>
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
                {!loading && filtered.length > PER_PAGE && (
                    <div className="ao-pagination">
                        <span>Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</span>
                        <div className="ao-page-btns">
                            <button className="ao-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                .reduce((acc, p, i, arr) => {
                                    if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) =>
                                    p === '…'
                                        ? <span key={`e${i}`} style={{ padding: '5px 4px', color: '#9ca3af' }}>…</span>
                                        : <button key={p} className={`ao-page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                                )
                            }
                            <button className="ao-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="ao-overlay" onClick={() => setSelected(null)}>
                    <div className="ao-modal" onClick={e => e.stopPropagation()}>
                        <div className="ao-modal-body">
                            <div className="ao-modal-top">
                                <div>
                                    <h2 className="ao-modal-title">Order #{selected.id}</h2>
                                    <span className={`ao-badge ${STATUS_META[selected.status]?.cls || 'status-inactive'}`} style={{ marginTop: 6, display: 'inline-flex' }}>
                                        {STATUS_META[selected.status]?.label || selected.status}
                                    </span>
                                </div>
                                <button className="ao-modal-close" onClick={() => setSelected(null)}>✕</button>
                            </div>

                            <div className="ao-modal-grid">
                                <div className="ao-modal-field">
                                    <label>Consumer</label>
                                    <span>{selected.consumerName}</span>
                                </div>
                                <div className="ao-modal-field">
                                    <label>Farmer</label>
                                    <span>{selected.farmerName}</span>
                                </div>
                                <div className="ao-modal-field">
                                    <label>Items</label>
                                    <span>{selected.itemCount} item{selected.itemCount !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="ao-modal-field">
                                    <label>Total Amount</label>
                                    <span><strong>R{selected.totalAmount?.toFixed(2)}</strong></span>
                                </div>
                                <div className="ao-modal-field">
                                    <label>Placed On</label>
                                    <span>{new Date(selected.createdAt).toLocaleString()}</span>
                                </div>
                                {selected.deliveryAddress && (
                                    <div className="ao-modal-field">
                                        <label>Delivery Address</label>
                                        <span>{selected.deliveryAddress}</span>
                                    </div>
                                )}
                            </div>

                            {/* Order items list if available */}
                            {selected.items?.length > 0 && (
                                <div className="ao-modal-items">
                                    <div className="ao-modal-items-title">Items Ordered</div>
                                    {selected.items.map((item, i) => (
                                        <div key={i} className="ao-modal-item-row">
                                            <span>{item.productName}</span>
                                            <span>{item.quantity} × R{item.unitPrice?.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Status progression */}
                            <div className="ao-modal-actions">
                                {selected.status === 'PENDING' && (
                                    <button className="ao-modal-btn ao-modal-approve" disabled={!!actionLoading} onClick={() => updateStatus(selected.id, 'CONFIRMED')}>✓ Confirm Order</button>
                                )}
                                {selected.status === 'CONFIRMED' && (
                                    <button className="ao-modal-btn ao-modal-blue" disabled={!!actionLoading} onClick={() => updateStatus(selected.id, 'PROCESSING')}>⚙ Mark Processing</button>
                                )}
                                {selected.status === 'PROCESSING' && (
                                    <button className="ao-modal-btn ao-modal-purple" disabled={!!actionLoading} onClick={() => updateStatus(selected.id, 'SHIPPED')}>🚚 Mark Shipped</button>
                                )}
                                {selected.status === 'SHIPPED' && (
                                    <button className="ao-modal-btn ao-modal-approve" disabled={!!actionLoading} onClick={() => updateStatus(selected.id, 'DELIVERED')}>📦 Mark Delivered</button>
                                )}
                                {(selected.status === 'PENDING' || selected.status === 'CONFIRMED') && (
                                    <button className="ao-modal-btn ao-modal-cancel" disabled={!!actionLoading} onClick={() => updateStatus(selected.id, 'CANCELLED')}>✕ Cancel Order</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}