import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './AdminDriverVerification.css';
import { requestJson } from '../../utils/requestJson';

function AdminDriverVerification() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [allDrivers, setAllDrivers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));

            const [pendingRes, allRes] = await Promise.all([
                fetch('http://localhost:8080/api/admin/drivers/pending', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }),
                fetch('http://localhost:8080/api/admin/drivers', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                })
            ]);

            if (pendingRes.ok) setDrivers(await pendingRes.json());
           /* if (allRes.ok) setAllDrivers(await allRes.json());*/
            if (allRes.ok){
                const data = await allRes.json();
                setAllDrivers(data.content || []);
            }
        } catch (err) {
            toast.error('Failed to load drivers');
        } finally {
            setLoading(false);
        }
    };


    const approveDriver = async (driverId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await requestJson(`http://localhost:8080/api/admin/drivers/${driverId}/approve`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            toast.success('Driver approved!');
            setSelectedDriver(null);
            await fetchData();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const rejectDriver = async (driverId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await requestJson(`http://localhost:8080/api/admin/drivers/${driverId}/reject`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: 'Documents unclear or invalid' })
            });

            toast.success('Driver rejected — they will be asked to resubmit');
            setSelectedDriver(null);
            await fetchData();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const DocImage = ({ url, label }) => (
        <div className="doc-item">
            <p className="doc-label">{label}</p>
            {url ? (
                <a href={`http://localhost:8080/uploads/${url}`} target="_blank" rel="noreferrer">
                    <img
                        src={`http://localhost:8080/uploads/${url}`}
                        alt={label}
                        className="doc-img"
                        onError={e => e.target.src = '/placeholder.png'}
                    />
                    <span className="doc-view">Click to view full size</span>
                </a>
            ) : (
                <div className="doc-missing">Not uploaded</div>
            )}
        </div>
    );

    const displayDrivers = activeTab === 'pending'
        ? drivers
        : allDrivers.filter(d => d.verificationStatus === 'VERIFIED');

    if (loading) return <div className="avd-page"><div className="loading-state">Loading...</div></div>;

    return (
        <div className="avd-page">
            <div className="avd-header">
                <h1>Driver Verification</h1>
                <p>{drivers.length} driver{drivers.length !== 1 ? 's' : ''} pending review</p>
                <button className="au-back-btn" onClick={() => window.location.href = '/admin'}>
                    ← Back to Dashboard
                </button>
            </div>

            <div className="avd-tabs">
                <button
                    className={`avd-tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending ({drivers.length})
                </button>
                <button
                    className={`avd-tab ${activeTab === 'verified' ? 'active' : ''}`}
                    onClick={() => setActiveTab('verified')}
                >
                    Verified ({allDrivers.filter(d => d.verificationStatus === 'VERIFIED').length})
                </button>
            </div>

            <div className="avd-layout">
                {/* Driver list */}
                <div className="avd-list">
                    {displayDrivers.length === 0 ? (
                        <div className="empty-state">
                            <p>{activeTab === 'pending' ? 'No drivers pending verification' : 'No verified drivers yet'}</p>
                        </div>
                    ) : (
                        displayDrivers.map(driver => (
                            <div
                                key={driver.id}
                                className={`avd-driver-card ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
                                onClick={() => setSelectedDriver(driver)}
                            >
                                <div className="avd-driver-info">
                                    <div className="avd-avatar">
                                        {driver.selfieUrl ? (
                                            <img
                                                src={`http://localhost:8080/uploads/${driver.selfieUrl}`}
                                                alt={driver.name}
                                            />
                                        ) : (
                                            <span>{driver.name?.[0]}{driver.surname?.[0]}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="avd-name">{driver.name} {driver.surname}</p>
                                        <p className="avd-meta">{driver.vehicleType} · {driver.email}</p>
                                    </div>
                                </div>
                                <span className={`avd-badge ${driver.verificationStatus === 'VERIFIED' ? 'verified' : 'pending'}`}>
                                    {driver.verificationStatus === 'VERIFIED' ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Document viewer */}
                {selectedDriver && (
                    <div className="avd-detail">
                        <div className="avd-detail-header">
                            <h2>{selectedDriver.name} {selectedDriver.surname}</h2>
                            <button className="avd-close" onClick={() => setSelectedDriver(null)}>✕</button>
                        </div>

                        <div className="avd-driver-meta-row">
                            <span>📧 {selectedDriver.email}</span>
                            <span>📞 {selectedDriver.phoneNumber}</span>
                            <span>🚗 {selectedDriver.vehicleType}</span>
                            <span>📍 {selectedDriver.address}</span>
                        </div>

                        <div className="avd-docs">
                            <h3>Submitted Documents</h3>
                            <div className="avd-docs-grid">
                                <DocImage url={selectedDriver.idDocumentUrl} label="SA ID Document" />
                                <DocImage url={selectedDriver.selfieUrl} label="Selfie" />
                                <DocImage url={selectedDriver.vehiclePhotoUrl} label="Vehicle Photo" />
                                <DocImage url={selectedDriver.licenseDiskUrl} label="License Disk" />
                                {selectedDriver.vehicleType !== 'bicycle' && (
                                    <DocImage url={selectedDriver.driversLicenseUrl} label="Driver's License" />
                                )}
                            </div>
                        </div>

                        {selectedDriver.verificationStatus !== 'VERIFIED' && (
                            <div className="avd-actions">
                                <button
                                    className="btn-reject"
                                    onClick={() => rejectDriver(selectedDriver.id)}
                                >
                                    ✗ Reject & Request Resubmission
                                </button>
                                <button
                                    className="btn-approve"
                                    onClick={() => approveDriver(selectedDriver.id)}
                                >
                                    ✓ Approve Driver
                                </button>
                            </div>
                        )}

                        {selectedDriver.verificationStatus === 'VERIFIED' && (
                            <div className="avd-verified-notice">
                                ✅ This driver has been verified and approved
                            </div>
                        )}
                    </div>
                )}

                {!selectedDriver && (
                    <div className="avd-empty-detail">
                        <p>Select a driver to review their documents</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDriverVerification;