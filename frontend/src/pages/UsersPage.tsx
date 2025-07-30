import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api'; // Make sure this path is correct for your project
import styles from './UsersPage.module.css'; // Import the CSS module
import Layout from '../components/Layout'; // Import the Layout component

// --- Cloudinary Configuration ---
// These values are now sourced from your .env.local file
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// --- Type Definitions ---
type UserRole = 'OWNER' | 'MANAGER' | 'WORKER';

interface UserType {
    id: number;
    username: string;
    role: UserRole;
    profileImageUrl: string | null;
}

interface AddUserModalProps {
    onClose: () => void;
    onUserAdded: () => void;
}

interface UserCardProps {
    user: UserType;
}

// --- Helper function for uploading image to Cloudinary ---
const uploadImageToCloudinary = async (file: File): Promise<string> => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        throw new Error("Cloudinary configuration is missing. Please check your .env.local file.");
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Image upload failed');
    }

    const data = await response.json();
    return data.secure_url;
};

// --- Add User Modal Component ---
const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onUserAdded }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<UserRole>('WORKER');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            let profileImageUrl: string | null = null;
            if (imageFile) {
                profileImageUrl = await uploadImageToCloudinary(imageFile);
            }

            const newUser = { username, password, role, profileImageUrl };
            await api.post('/users', newUser);

            onUserAdded();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                {/* Modal close button for theme consistency */}
                <button
                    onClick={onClose}
                    className={styles.modalCloseBtn}
                    aria-label="Close"
                    style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: 22, color: '#375534', cursor: 'pointer', zIndex: 3, fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}
                >
                    ×
                </button>
                <h2 className={styles.modalHeader} style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', color: '#375534', fontWeight: 700 }}>
                    Add New User
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className={styles.input}>
                            <option value="WORKER">Cashier</option>
                            <option value="MANAGER">Assistant</option>
                            <option value="OWNER">Manager</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={styles.fileInputHidden}
                            ref={fileInputRef}
                        />
                        <button
                            type="button"
                            className={styles.fileUploadBtn}
                            onClick={handleFileButtonClick}
                        >
                            {/* Upload icon SVG */}
                            <svg width="20" height="20" fill="none" viewBox="0 0 20 20" style={{ verticalAlign: 'middle' }}>
                                <path d="M10 14V4M10 4L6 8M10 4l4 4" stroke="#375534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <rect x="3" y="14" width="14" height="3" rx="1.5" fill="#375534"/>
                            </svg>
                            <span>Upload Image</span>
                        </button>
                        {imageFile && <span className={styles.fileName}>{imageFile.name}</span>}
                        {previewImage && <img src={previewImage} alt="Preview" className={styles.previewImage} />}
                    </div>
                    {error && <p className={styles.errorText}>{error}</p>}
                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.buttonSecondary} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className={styles.buttonPrimary} disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- User Card Component ---
const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const fallbackImageUrl = `https://ui-avatars.com/api/?name=${user.username.charAt(0)}&background=AEC3B0&color=fff&size=128`;
    const roleDisplayName: Record<UserRole, string> = {
        OWNER: 'Manager',
        MANAGER: 'Assistant',
        WORKER: 'Cashier'
    };

    return (
        <div className={styles.card} data-role={user.role}>
            <div className={styles.cardHeader}>
                <img
                    src={user.profileImageUrl || fallbackImageUrl}
                    alt={user.username}
                    className={styles.avatar}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src=fallbackImageUrl;
                    }}
                />
                <svg className={styles.wave} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffffff" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
            </div>
            <div className={styles.cardBody}>
                <h3 className={styles.cardName} style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', color: '#0F2A1D', fontWeight: 600 }}>
                    {user.username}
                </h3>
                <p className={styles.cardRole} style={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', color: '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {roleDisplayName[user.role] || 'User'}
                </p>
            </div>
        </div>
    );
};

// --- Main Users Page Component ---
const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<UserType[]>('/users');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (loading) return <Layout><div className={styles.centerMessage}>Loading users...</div></Layout>;
    if (error) return <Layout><div className={styles.centerMessage}>{error}</div></Layout>;

    return (
        <Layout> {/* The user prop is not needed here; Layout gets it from context */}
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.title}>User Management</h1>
                    <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>+ Add User</button>
                </div>
                <div className={styles.grid}>
                    {users.map(userItem => (
                        <UserCard key={userItem.id} user={userItem} />
                    ))}
                </div>
                {isModalOpen && <AddUserModal onClose={() => setIsModalOpen(false)} onUserAdded={fetchUsers} />}
            </div>
        </Layout>
    );
};

export default UsersPage;
