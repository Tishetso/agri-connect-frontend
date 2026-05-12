import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './AdminListings.css';

const STATUS_COLORS = {
    ACTIVE:   { cls: 'status-active' },
    PENDING:  { cls: 'status-pending' },
    REJECTED: { cls: 'status-rejected' },
    INACTIVE: { cls: 'status-inactive' },
};

const FILTERS = ['ALL', 'ACTIVE', 'PENDING', 'REJECTED', 'INACTIVE'];

export default function AdminListings() {
    const [listings, setListings]           = useState([]);
    const [loading, setLoading]             = useState(true);
    const [filter, setFilter]               = useState('ALL');
    const [search, setSearch]               = useState('');
    const [searchInput, setSearchInput]     = useState('');
    const [selected, setSelected]           = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [page, setPage]                   = useState(1);
    const PER_PAGE = 10;

    useEffect(() => { fetchListings(); }, []);

    const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

    const fetchListings = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/admin/listings', {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) setListings(await res.json());
            else toast.error('Failed to load listings');
        } catch { toast.error('Network error'); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            setActionLoading(id + status);
            const res = await fetch(`http://localhost:8080/api/admin/listings/${id}/status`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
                if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
                toast.success(`Listing marked as ${status.toLowerCase()}`);
            } else toast.error('Failed to update status');
        } catch { toast.error('Network error'); }
        finally { setActionLoading(null); }
    };

    const deleteListing = async (id) => {
        if (!window.confirm('Delete this listing permanently?')) return;
        try {
            setActionLoading(id + 'DELETE');
            const res = await fetch(`http://localhost:8080/api/admin/listings/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) {
                setListings(prev => prev.filter(l => l.id !== id));
                setSelected(null);
                toast.success('Listing deleted');
            } else toast.error('Failed to delete');
        } catch { toast.error('Network error'); }
        finally { setActionLoading(null); }
    };

    const handleSearch = () => { setSearch(searchInput); setPage(1); };

    const filtered = listings.filter(l => {
        const matchFilter = filter === 'ALL' || l.status === filter;
        const matchSearch = !search ||
            l.product?.toLowerCase().includes(search.toLowerCase()) ||
            l.farmerName?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const counts = FILTERS.reduce((acc, f) => {
        acc[f] = f === 'ALL' ? listings.length : listings.filter(l => l.status === f).length;
        return acc;
    }, {});

    const initials = (name = '') => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="al-page">
            {/* Header */}
            <div className="al-header">
                <div>
                    <h1>📦 Manage Listings</h1>
                    <p>Review, approve, and moderate farmer product listings</p>
                </div>
                <button className="al-back-btn" onClick={() => window.location.href = '/admin'}>
                    ← Back to Dashboard
                </button>
            </div>

            {/* Stats */}
            <div className="al-stats">
                <div className="al-stat">
                    <div className="al-stat-label">Total</div>
                    <div className="al-stat-val">{counts.ALL}</div>
                </div>
                <div className="al-stat al-stat-green">
                    <div className="al-stat-label">Active</div>
                    <div className="al-stat-val">{counts.ACTIVE}</div>
                </div>
                <div className="al-stat al-stat-yellow">
                    <div className="al-stat-label">Pending</div>
                    <div className="al-stat-val">{counts.PENDING}</div>
                </div>
                <div className="al-stat al-stat-red">
                    <div className="al-stat-label">Rejected</div>
                    <div className="al-stat-val">{counts.REJECTED}</div>
                </div>
                <div className="al-stat">
                    <div className="al-stat-label">Inactive</div>
                    <div className="al-stat-val">{counts.INACTIVE}</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="al-toolbar">
                <div className="al-search-wrap">
                    <span className="al-search-icon">🔍</span>
                    <input
                        className="al-search"
                        type="text"
                        placeholder="Search by product or farmer…"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <select
                    className="al-select"
                    value={filter}
                    onChange={e => { setFilter(e.target.value); setPage(1); }}
                >
                    {FILTERS.map(f => (
                        <option key={f} value={f}>{f} ({counts[f]})</option>
                    ))}
                </select>
                <button className="al-search-btn" onClick={handleSearch}>Search</button>
                <button className="al-search-btn al-refresh-btn" onClick={fetchListings}>↻ Refresh</button>
            </div>

            {/* Table */}
            <div className="al-table-wrap">
                {loading ? (
                    <div className="al-empty">⏳ Loading listings…</div>
                ) : paginated.length === 0 ? (
                    <div className="al-empty">📭 No listings found</div>
                ) : (
                    <table className="al-table">
                        <thead>
                        <tr>
                            <th>Product</th>
                            <th>Farmer</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginated.map(listing => {
                            const sc   = STATUS_COLORS[listing.status] || STATUS_COLORS.INACTIVE;
                            const busy = !!actionLoading;
                            return (
                                <tr key={listing.id} onClick={() => setSelected(listing)} style={{ cursor: 'pointer' }}>
                                    <td>
                                        <div className="al-product-cell">
                                            <img
                                                className="al-product-img"
                                                src={listing.imageUrls?.[0]
                                                    ? `http://localhost:8080/uploads/${listing.imageUrls[0]}`
                                                    : '/placeholder-produce.png'}
                                                alt={listing.product}
                                                onError={e => e.target.src = '/placeholder-produce.png'}
                                            />
                                            <div>
                                                <div className="al-product-name">{listing.product}</div>
                                                <div className="al-product-id">#{listing.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="al-user-cell">
                                            <div className="al-avatar al-avatar-farmer">
                                                {initials(listing.farmerName)}
                                            </div>
                                            <span>{listing.farmerName}</span>
                                        </div>
                                    </td>
                                    <td><strong>R{listing.price}</strong></td>
                                    <td>{listing.quantity}</td>
                                    <td>
                                            <span className={`al-badge ${sc.cls}`}>
                                                {listing.status}
                                            </span>
                                    </td>
                                    <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <div className="al-actions">
                                            {listing.status === 'PENDING' && (<>
                                                <button
                                                    className="al-action-btn al-action-approve"
                                                    title="Approve"
                                                    disabled={busy}
                                                    onClick={() => updateStatus(listing.id, 'ACTIVE')}
                                                >✓</button>
                                                <button
                                                    className="al-action-btn al-action-danger"
                                                    title="Reject"
                                                    disabled={busy}
                                                    onClick={() => updateStatus(listing.id, 'REJECTED')}
                                                >✕</button>
                                            </>)}
                                            {listing.status === 'ACTIVE' && (
                                                <button
                                                    className="al-action-btn al-action-warn"
                                                    title="Deactivate"
                                                    disabled={busy}
                                                    onClick={() => updateStatus(listing.id, 'INACTIVE')}
                                                >⏸</button>
                                            )}
                                            {listing.status === 'INACTIVE' && (
                                                <button
                                                    className="al-action-btn al-action-approve"
                                                    title="Activate"
                                                    disabled={busy}
                                                    onClick={() => updateStatus(listing.id, 'ACTIVE')}
                                                >▶</button>
                                            )}
                                            <button
                                                className="al-action-btn al-action-danger"
                                                title="Delete"
                                                disabled={busy}
                                                onClick={() => deleteListing(listing.id)}
                                            >🗑</button>
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
                    <div className="al-pagination">
                        <span>
                            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                        </span>
                        <div className="al-page-btns">
                            <button className="al-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
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
                                        : <button key={p} className={`al-page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                                )
                            }
                            <button className="al-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="al-overlay" onClick={() => setSelected(null)}>
                    <div className="al-modal" onClick={e => e.stopPropagation()}>
                        <img
                            className="al-modal-img"
                            src={selected.imageUrls?.[0]
                                ? `http://localhost:8080/uploads/${selected.imageUrls[0]}`
                                : '/placeholder-produce.png'}
                            alt={selected.product}
                            onError={e => e.target.src = '/placeholder-produce.png'}
                        />
                        <div className="al-modal-body">
                            <div className="al-modal-top">
                                <div>
                                    <h2 className="al-modal-title">{selected.product}</h2>
                                    <span className={`al-badge ${STATUS_COLORS[selected.status]?.cls}`} style={{ marginTop: 6, display: 'inline-flex' }}>
                                        {selected.status}
                                    </span>
                                </div>
                                <button className="al-modal-close" onClick={() => setSelected(null)}>✕</button>
                            </div>

                            <div className="al-modal-grid">
                                <div className="al-modal-field">
                                    <label>Farmer</label>
                                    <span>{selected.farmerName}</span>
                                </div>
                                <div className="al-modal-field">
                                    <label>Price</label>
                                    <span>R{selected.price}</span>
                                </div>
                                <div className="al-modal-field">
                                    <label>Quantity</label>
                                    <span>{selected.quantity}</span>
                                </div>
                                <div className="al-modal-field">
                                    <label>Listing ID</label>
                                    <span style={{ fontFamily: 'monospace' }}>#{selected.id}</span>
                                </div>
                                <div className="al-modal-field">
                                    <label>Created</label>
                                    <span>{new Date(selected.createdAt).toLocaleString()}</span>
                                </div>
                                {selected.category && (
                                    <div className="al-modal-field">
                                        <label>Category</label>
                                        <span>{selected.category}</span>
                                    </div>
                                )}
                            </div>

                            {selected.description && (
                                <div className="al-modal-desc">{selected.description}</div>
                            )}

                            <div className="al-modal-actions">
                                {selected.status === 'PENDING' && (<>
                                    <button className="al-modal-btn al-modal-approve" disabled={!!actionLoading} onClick={() => updateStatus(selected.id, 'ACTIVE')}>✓ Approve</button>
                                    <button className="al-modal-btn al-modal-reject"  disabled={!!actionLoading} onClick={() => updateStatus(selected.id, 'REJECTED')}>✕ Reject</button>
                                </>)}
                                {selected.status === 'ACTIVE' && (
                                    <button className="al-modal-btn al-modal-warn" disabled={!!actionLoading} onClick={() => updateStatus(selected.id, 'INACTIVE')}>⏸ Deactivate</button>
                                )}
                                {selected.status === 'INACTIVE' && (
                                    <button className="al-modal-btn al-modal-approve" disabled={!!actionLoading} onClick={() => updateStatus(selected.id, 'ACTIVE')}>▶ Activate</button>
                                )}
                                <button className="al-modal-btn al-modal-delete" disabled={!!actionLoading} onClick={() => deleteListing(selected.id)}>🗑 Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}