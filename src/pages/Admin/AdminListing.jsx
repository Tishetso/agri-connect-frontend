import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    ACTIVE:   { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
    PENDING:  { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
    REJECTED: { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
    INACTIVE: { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' },
};

const FILTERS = ['ALL', 'ACTIVE', 'PENDING', 'REJECTED', 'INACTIVE'];

export default function AdminListings() {
    const [listings, setListings]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [filter, setFilter]           = useState('ALL');
    const [search, setSearch]           = useState('');
    const [selected, setSelected]       = useState(null); // listing detail modal
    const [actionLoading, setActionLoading] = useState(null);

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
                toast.success(`Listing ${status.toLowerCase()}`);
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

    const filtered = listings.filter(l => {
        const matchFilter = filter === 'ALL' || l.status === filter;
        const matchSearch = !search ||
            l.product?.toLowerCase().includes(search.toLowerCase()) ||
            l.farmerName?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const counts = FILTERS.reduce((acc, f) => {
        acc[f] = f === 'ALL' ? listings.length : listings.filter(l => l.status === f).length;
        return acc;
    }, {});

    return (
        <>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .al-page {
                    min-height: 100vh;
                    background: #f8f7f4;
                    font-family: 'Georgia', serif;
                    color: #1a1a1a;
                }

                /* ── Header ── */
                .al-header {
                    background: #1a1a1a;
                    color: #fff;
                    padding: 0 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 64px;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                .al-header-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .al-back {
                    background: none;
                    border: 1px solid #444;
                    color: #ccc;
                    padding: 6px 14px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all .2s;
                }
                .al-back:hover { background: #333; color: #fff; }
                .al-header h1 {
                    font-size: 18px;
                    font-weight: 400;
                    letter-spacing: .5px;
                }
                .al-header-badge {
                    background: #e8f5e9;
                    color: #2e7d32;
                    font-size: 11px;
                    font-family: monospace;
                    padding: 3px 8px;
                    border-radius: 20px;
                    font-weight: 700;
                    margin-left: 8px;
                }

                /* ── Body ── */
                .al-body { padding: 2rem; max-width: 1300px; margin: 0 auto; }

                /* ── Controls ── */
                .al-controls {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }
                .al-search {
                    flex: 1;
                    min-width: 220px;
                    padding: 10px 16px 10px 40px;
                    border: 1.5px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 14px;
                    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z'/%3E%3C/svg%3E") no-repeat 13px center;
                    transition: border-color .2s;
                    font-family: inherit;
                }
                .al-search:focus { outline: none; border-color: #1a1a1a; }

                .al-filters {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                }
                .al-filter-btn {
                    padding: 8px 14px;
                    border: 1.5px solid #e0e0e0;
                    border-radius: 20px;
                    background: #fff;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all .18s;
                    font-family: inherit;
                    color: #555;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .al-filter-btn:hover { border-color: #aaa; color: #1a1a1a; }
                .al-filter-btn.active {
                    background: #1a1a1a;
                    border-color: #1a1a1a;
                    color: #fff;
                }
                .al-filter-count {
                    background: rgba(255,255,255,.2);
                    border-radius: 10px;
                    padding: 1px 7px;
                    font-size: 11px;
                    font-family: monospace;
                }
                .al-filter-btn:not(.active) .al-filter-count {
                    background: #f0f0f0;
                    color: #666;
                }

                /* ── Refresh ── */
                .al-refresh {
                    padding: 9px 16px;
                    background: #fff;
                    border: 1.5px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 18px;
                    transition: all .2s;
                    line-height: 1;
                }
                .al-refresh:hover { background: #f0f0f0; transform: rotate(30deg); }

                /* ── Table ── */
                .al-table-wrap {
                    background: #fff;
                    border-radius: 12px;
                    border: 1.5px solid #e8e8e8;
                    overflow: hidden;
                    box-shadow: 0 1px 4px rgba(0,0,0,.04);
                }
                .al-table { width: 100%; border-collapse: collapse; }
                .al-table thead { background: #fafafa; border-bottom: 1.5px solid #ebebeb; }
                .al-table th {
                    padding: 13px 16px;
                    text-align: left;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #888;
                    font-family: 'Georgia', serif;
                }
                .al-table td {
                    padding: 14px 16px;
                    border-bottom: 1px solid #f2f2f2;
                    font-size: 14px;
                    vertical-align: middle;
                }
                .al-table tr:last-child td { border-bottom: none; }
                .al-table tbody tr {
                    transition: background .15s;
                    cursor: pointer;
                }
                .al-table tbody tr:hover { background: #fafaf8; }

                /* product cell */
                .al-product-cell {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .al-product-img {
                    width: 44px;
                    height: 44px;
                    border-radius: 8px;
                    object-fit: cover;
                    background: #f0f0f0;
                    border: 1px solid #eee;
                    flex-shrink: 0;
                }
                .al-product-name { font-weight: 600; color: #1a1a1a; }
                .al-product-id   { font-size: 11px; color: #aaa; margin-top: 2px; font-family: monospace; }

                /* status badge */
                .al-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: .3px;
                    white-space: nowrap;
                }
                .al-status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                /* row actions */
                .al-row-actions {
                    display: flex;
                    gap: 6px;
                    opacity: 0;
                    transition: opacity .15s;
                }
                .al-table tbody tr:hover .al-row-actions { opacity: 1; }
                .al-row-btn {
                    padding: 5px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    border: 1.5px solid transparent;
                    transition: all .15s;
                    font-family: inherit;
                    white-space: nowrap;
                }
                .al-row-btn.approve  { background: #d1fae5; color: #065f46; border-color: #6ee7b7; }
                .al-row-btn.approve:hover  { background: #10b981; color: #fff; }
                .al-row-btn.reject   { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
                .al-row-btn.reject:hover   { background: #ef4444; color: #fff; }
                .al-row-btn.deactivate { background: #f3f4f6; color: #374151; border-color: #d1d5db; }
                .al-row-btn.deactivate:hover { background: #6b7280; color: #fff; }
                .al-row-btn.delete   { background: #fff; color: #dc2626; border-color: #fca5a5; }
                .al-row-btn.delete:hover   { background: #dc2626; color: #fff; }
                .al-row-btn:disabled { opacity: .5; cursor: not-allowed; }

                /* empty / loading */
                .al-empty {
                    text-align: center;
                    padding: 60px 20px;
                    color: #aaa;
                }
                .al-empty-icon { font-size: 48px; margin-bottom: 12px; }
                .al-empty p { font-size: 15px; }

                /* ── Detail Modal ── */
                .al-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,.45);
                    z-index: 200;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn .2s ease;
                }
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

                .al-modal {
                    background: #fff;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 560px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,.2);
                    animation: slideUp .25s ease;
                }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: none; opacity: 1 } }

                .al-modal-img {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    border-radius: 16px 16px 0 0;
                    background: #f0f0f0;
                    display: block;
                }
                .al-modal-body { padding: 1.5rem; }
                .al-modal-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }
                .al-modal-title { font-size: 22px; font-weight: 700; }
                .al-modal-close {
                    background: #f3f4f6;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: background .15s;
                }
                .al-modal-close:hover { background: #e5e7eb; }

                .al-modal-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 1.25rem;
                }
                .al-modal-field label {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #9ca3af;
                    display: block;
                    margin-bottom: 3px;
                }
                .al-modal-field span {
                    font-size: 15px;
                    color: #1a1a1a;
                    font-weight: 500;
                }

                .al-modal-desc {
                    background: #fafaf8;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 12px;
                    font-size: 14px;
                    color: #555;
                    line-height: 1.6;
                    margin-bottom: 1.25rem;
                }

                .al-modal-actions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .al-modal-btn {
                    flex: 1;
                    min-width: 100px;
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all .18s;
                    font-family: inherit;
                    letter-spacing: .3px;
                }
                .al-modal-btn.approve  { background: #10b981; color: #fff; }
                .al-modal-btn.approve:hover  { background: #059669; }
                .al-modal-btn.reject   { background: #ef4444; color: #fff; }
                .al-modal-btn.reject:hover   { background: #dc2626; }
                .al-modal-btn.deactivate { background: #6b7280; color: #fff; }
                .al-modal-btn.deactivate:hover { background: #4b5563; }
                .al-modal-btn.delete   { background: #fff; color: #dc2626; border-color: #fca5a5; }
                .al-modal-btn.delete:hover   { background: #dc2626; color: #fff; }
                .al-modal-btn:disabled { opacity: .5; cursor: not-allowed; }

                /* result count */
                .al-result-count {
                    font-size: 13px;
                    color: #888;
                    margin-bottom: 10px;
                    font-family: monospace;
                }

                @media (max-width: 768px) {
                    .al-body { padding: 1rem; }
                    .al-controls { flex-direction: column; align-items: stretch; }
                    .al-search { width: 100%; }
                    .al-modal-grid { grid-template-columns: 1fr; }
                    .al-table th:nth-child(4),
                    .al-table td:nth-child(4),
                    .al-table th:nth-child(6),
                    .al-table td:nth-child(6) { display: none; }
                }
            `}</style>

            <div className="al-page">
                {/* Header */}
                <header className="al-header">
                    <div className="al-header-left">
                        <button className="al-back" onClick={() => window.location.href = '/admin'}>
                            ← Back
                        </button>
                        <h1>📦 Manage Listings</h1>
                        <span className="al-header-badge">{listings.length} total</span>
                    </div>
                    <button className="al-refresh" title="Refresh" onClick={fetchListings}>↻</button>
                </header>

                <div className="al-body">
                    {/* Controls */}
                    <div className="al-controls">
                        <input
                            className="al-search"
                            type="text"
                            placeholder="Search by product or farmer…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <div className="al-filters">
                            {FILTERS.map(f => (
                                <button
                                    key={f}
                                    className={`al-filter-btn ${filter === f ? 'active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f}
                                    <span className="al-filter-count">{counts[f]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="al-result-count">
                        Showing {filtered.length} of {listings.length} listings
                    </div>

                    {/* Table */}
                    <div className="al-table-wrap">
                        {loading ? (
                            <div className="al-empty">
                                <div className="al-empty-icon">⏳</div>
                                <p>Loading listings…</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="al-empty">
                                <div className="al-empty-icon">📭</div>
                                <p>No listings found</p>
                            </div>
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
                                {filtered.map(listing => {
                                    const s = STATUS_COLORS[listing.status] || STATUS_COLORS.INACTIVE;
                                    return (
                                        <tr key={listing.id} onClick={() => setSelected(listing)}>
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
                                            <td>{listing.farmerName}</td>
                                            <td><strong>R{listing.price}</strong></td>
                                            <td>{listing.quantity}</td>
                                            <td>
                                                    <span className="al-status" style={{ background: s.bg, color: s.color }}>
                                                        <span className="al-status-dot" style={{ background: s.dot }} />
                                                        {listing.status}
                                                    </span>
                                            </td>
                                            <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                                            <td onClick={e => e.stopPropagation()}>
                                                <div className="al-row-actions">
                                                    {listing.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                className="al-row-btn approve"
                                                                disabled={!!actionLoading}
                                                                onClick={() => updateStatus(listing.id, 'ACTIVE')}
                                                            >✓ Approve</button>
                                                            <button
                                                                className="al-row-btn reject"
                                                                disabled={!!actionLoading}
                                                                onClick={() => updateStatus(listing.id, 'REJECTED')}
                                                            >✕ Reject</button>
                                                        </>
                                                    )}
                                                    {listing.status === 'ACTIVE' && (
                                                        <button
                                                            className="al-row-btn deactivate"
                                                            disabled={!!actionLoading}
                                                            onClick={() => updateStatus(listing.id, 'INACTIVE')}
                                                        >Deactivate</button>
                                                    )}
                                                    {listing.status === 'INACTIVE' && (
                                                        <button
                                                            className="al-row-btn approve"
                                                            disabled={!!actionLoading}
                                                            onClick={() => updateStatus(listing.id, 'ACTIVE')}
                                                        >Activate</button>
                                                    )}
                                                    <button
                                                        className="al-row-btn delete"
                                                        disabled={!!actionLoading}
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
                    </div>
                </div>
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
                                    <div className="al-modal-title">{selected.product}</div>
                                    <span
                                        className="al-status"
                                        style={{
                                            background: STATUS_COLORS[selected.status]?.bg,
                                            color: STATUS_COLORS[selected.status]?.color,
                                            marginTop: 6,
                                            display: 'inline-flex'
                                        }}
                                    >
                                        <span className="al-status-dot" style={{ background: STATUS_COLORS[selected.status]?.dot }} />
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
                                {selected.status === 'PENDING' && (
                                    <>
                                        <button
                                            className="al-modal-btn approve"
                                            disabled={!!actionLoading}
                                            onClick={() => updateStatus(selected.id, 'ACTIVE')}
                                        >✓ Approve</button>
                                        <button
                                            className="al-modal-btn reject"
                                            disabled={!!actionLoading}
                                            onClick={() => updateStatus(selected.id, 'REJECTED')}
                                        >✕ Reject</button>
                                    </>
                                )}
                                {selected.status === 'ACTIVE' && (
                                    <button
                                        className="al-modal-btn deactivate"
                                        disabled={!!actionLoading}
                                        onClick={() => updateStatus(selected.id, 'INACTIVE')}
                                    >Deactivate</button>
                                )}
                                {selected.status === 'INACTIVE' && (
                                    <button
                                        className="al-modal-btn approve"
                                        disabled={!!actionLoading}
                                        onClick={() => updateStatus(selected.id, 'ACTIVE')}
                                    >Activate</button>
                                )}
                                <button
                                    className="al-modal-btn delete"
                                    disabled={!!actionLoading}
                                    onClick={() => deleteListing(selected.id)}
                                >🗑 Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}