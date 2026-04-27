import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './DriverKycPage.css';

function DriverKycPage() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [previews, setPreviews] = useState({});
    const [files, setFiles] = useState({
        idDocument: null,
        selfie: null,
        vehiclePhoto: null,
        licenseDisk: null,
        driversLicense: null
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const isBicycle = user?.vehicleType === 'bicycle';

    const handleFileChange = (field, e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFiles(prev => ({ ...prev, [field]: file }));
        setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!files.idDocument || !files.selfie || !files.vehiclePhoto) {
            toast.error('Please upload all required documents');
            return;
        }

        if (!isBicycle && !files.licenseDisk) {
            toast.error("Please upload your license disk");
            return;
        }


        if (!isBicycle && !files.driversLicense) {
            toast.error("Please upload your driver's license");
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('idDocument', files.idDocument);
            formData.append('selfie', files.selfie);
            formData.append('vehiclePhoto', files.vehiclePhoto);
            formData.append('licenseDisk', files.licenseDisk);
            if (files.driversLicense) {
                formData.append('driversLicense', files.driversLicense);
            }

            const response = await fetch('http://localhost:8080/api/driver/kyc', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` },
                body: formData
            });

            if (response.ok) {
                toast.success('Documents submitted! Pending admin verification.');
                // mark kyc done in localStorage
                const updatedUser = { ...user, kycSubmitted: true };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                navigate('/driver/dashboard');
            } else {
                const err = await response.json();
                toast.error(err.error || 'Submission failed');
            }
        } catch (err) {
            toast.error('Failed to submit documents');
        } finally {
            setSubmitting(false);
        }
    };

    const UploadField = ({ field, label, hint, required = true }) => (
        <div className="upload-field">
            <label className="upload-label">
                {label} {required && <span className="required">*</span>}
            </label>
            {hint && <p className="upload-hint">{hint}</p>}
            <div
                className={`upload-box ${previews[field] ? 'has-preview' : ''}`}
                onClick={() => document.getElementById(field).click()}
            >
                {previews[field] ? (
                    <img src={previews[field]} alt={label} className="preview-img" />
                ) : (
                    <div className="upload-placeholder">
                        <span className="upload-icon">📎</span>
                        <span>Click to upload</span>
                        <span className="upload-sub">JPG, PNG or PDF</span>
                    </div>
                )}
            </div>
            <input
                id={field}
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(field, e)}
            />
            {files[field] && (
                <p className="file-name">✓ {files[field].name}</p>
            )}
        </div>
    );

    return (
        <div className="kyc-page">
            <div className="kyc-container">
                <div className="kyc-header">
                    <h1>Complete Your Verification</h1>
                    <p>Upload your documents to start accepting deliveries. All documents are securely stored.</p>
                    <div className="kyc-steps">
                        <span className="kyc-step">🪪 ID</span>
                        <span className="kyc-divider">→</span>
                        <span className="kyc-step">🤳 Selfie</span>
                        <span className="kyc-divider">→</span>
                        <span className="kyc-step">🚗 Vehicle</span>
                        <span className="kyc-divider">→</span>
                        <span className="kyc-step">✅ Done</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="kyc-form">

                    <section className="kyc-section">
                        <h2>Identity Documents</h2>
                        <UploadField
                            field="idDocument"
                            label="South African ID Document"
                            hint="Upload a clear photo or scan of your SA ID book or smart card"
                        />
                        <UploadField
                            field="selfie"
                            label="Selfie Photo"
                            hint="Take a clear selfie of your face — no sunglasses or hats"
                        />
                    </section>

                    <section className="kyc-section">
                        <h2>Vehicle Documents</h2>
                        <UploadField
                            field="vehiclePhoto"
                            label={isBicycle ? "Bicycle Photo" : "Vehicle Photo"}
                            hint={isBicycle
                                ? "Clear photo of you bicycle"
                                : "Clear photo of your vehicle showing the full exterior"}
                        />
                        {/*Only show these for non bicycle drivers*/}
                        {!isBicycle && (
                            <>
                                <UploadField
                                    field="licenseDisk"
                                    label="License Disk"
                                    hint="Photo of your vehicle's license disk (windscreen disc)"
                                />
                                <UploadField
                                    field="driversLicense"
                                    label="Driver's License"
                                    hint="Both sides of your driver's license card"
                                />
                            </>

                        )}
                    </section>

                    <div className="kyc-notice">
                        <p>⏳ After submission, your account will be reviewed within 24 hours. You'll be notified once verified.</p>
                    </div>

                    <button
                        type="submit"
                        className="btn-submit-kyc"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Documents'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DriverKycPage;