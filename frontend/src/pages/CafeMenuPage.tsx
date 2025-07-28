import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import styles from './CafeMenuPage.module.css';
import Layout from '../components/Layout';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface Item {
    id: number;
    name: string;
    price: number;
    imageUrl: string | null;
    available: boolean;
}

interface AddItemModalProps {
    onClose: () => void;
    onItemAdded: () => void;
}

interface ItemCardProps {
    item: Item;
    onToggleAvailability: (itemId: number, available: boolean) => void;
    onDelete: (itemId: number) => void;
    onPriceUpdate: (itemId: number, newPrice: number) => void;
}

const compressImageToTargetSize = async (
    file: File,
    maxWidth = 1200,
    minSizeKB = 500,
    maxSizeKB = 1000
): Promise<Blob> => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = dataUrl;
    });

    const canvas = document.createElement('canvas');
    const scale = maxWidth / img.width;
    canvas.width = Math.min(img.width, maxWidth);
    canvas.height = img.height * (img.width > maxWidth ? scale : 1);

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let quality = 0.95;
    let blob: Blob | null = null;

    while (quality >= 0.1) {
        blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
        );
        if (!blob) throw new Error('Compression failed');

        const sizeKB = blob.size / 1024;
        if (sizeKB >= minSizeKB && sizeKB <= maxSizeKB) break;

        quality -= 0.05;
    }

    if (!blob) throw new Error('Could not compress to target size');
    return blob;
};

const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const compressedBlob = await compressImageToTargetSize(file);
    const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type });

    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to upload to Cloudinary');
    }

    return data.secure_url;
};

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onItemAdded }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !price || Number(price) <= 0) {
            setError('A valid name and price are required.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            let imageUrl: string | null = null;
            if (imageFile) {
                imageUrl = await uploadImageToCloudinary(imageFile);
            }

            const newItem = { name, price: Number(price), imageUrl };
            await api.post('/items', newItem);

            onItemAdded();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create item.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.modalHeader}>Add New Menu Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Dish Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={styles.input} required min="0" step="0.01" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Item Photo</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
                        {previewImage && <img src={previewImage} alt="Preview" className={styles.previewImage} />}
                    </div>
                    {error && <p className={styles.errorText}>{error}</p>}
                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.buttonSecondary} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className={styles.buttonPrimary} disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ItemCard: React.FC<ItemCardProps> = ({ item, onToggleAvailability, onDelete, onPriceUpdate }) => {
    const fallbackImageUrl = '/default-dish.png';
    const [price, setPrice] = useState(item.price);
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) {
            onDelete(item.id);
        }
    };

    const handlePriceBlur = () => {
        if (price !== item.price) {
            onPriceUpdate(item.id, price);
        }
        setIsEditing(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img
                    src={item.imageUrl || fallbackImageUrl}
                    alt={item.name}
                    className={styles.itemImage}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== fallbackImageUrl) {
                            target.onerror = null;
                            target.src = fallbackImageUrl;
                        }
                    }}
                />
            </div>
            <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{item.name}</h3>
                {isEditing ? (
                    <input
                        type="number"
                        value={price}
                        min="0"
                        step="0.01"
                        onChange={(e) => setPrice(Number(e.target.value))}
                        onBlur={handlePriceBlur}
                        autoFocus
                        className={styles.priceInput}
                    />
                ) : (
                    <p className={styles.cardPrice} onClick={() => setIsEditing(true)}>
                        ₹{item.price.toFixed(2)} ✏️
                    </p>
                )}
            </div>
            <div className={styles.availabilityToggleBottomRight}>
                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={item.available}
                        onChange={() => onToggleAvailability(item.id, !item.available)}
                    />
                    <span className={styles.slider}></span>
                </label>
                <span className={styles.availabilityLabel}>
                    {item.available ? 'Available' : 'Unavailable'}
                </span>
            </div>
        </div>
    );
};

const CafeMenuPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const refreshItems = useCallback(async () => {
        try {
            const response = await api.get<Item[]>('/items');
            setItems(response.data);
        } catch (err) {
            console.error("Failed to refresh items", err);
            setError('Could not refresh the menu.');
        }
    }, []);

    useEffect(() => {
        const fetchInitialItems = async () => {
            setLoading(true);
            try {
                const response = await api.get<Item[]>('/items');
                setItems(response.data);
            } catch (err) {
                setError('Failed to fetch menu items.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialItems();
    }, []);

    const handleDeleteItem = async (itemId: number) => {
        try {
            await api.delete(`/items/${itemId}`);
            refreshItems();
        } catch (err: any) {
            console.error("Failed to delete item", err);
            const errorMessage = err.response?.data?.message || "Could not delete the item. It may be part of an existing order.";
            alert(errorMessage);
        }
    };

    const handleToggleAvailability = async (itemId: number, available: boolean) => {
        try {
            await api.put(`/items/${itemId}/availability`, available, {
                headers: { 'Content-Type': 'application/json' },
            });
            await refreshItems();
        } catch (err) {
            console.error("Failed to update availability", err);
            alert("Could not update item availability.");
        }
    };

    const handlePriceUpdate = async (itemId: number, newPrice: number) => {
        try {
            await api.patch(`/items/${itemId}/price`, newPrice, {
                headers: { 'Content-Type': 'application/json' },
            });
            refreshItems();
        } catch (err) {
            console.error("Failed to update price", err);
            alert("Could not update item price.");
        }
    };

    if (loading) return <Layout><div className={styles.centerMessage}>Loading menu...</div></Layout>;
    if (error) return <Layout><div className={styles.centerMessage}>{error}</div></Layout>;

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.title}>Cafe Menu Management</h1>
                    <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>+ Add Item</button>
                </div>
                <div className={styles.grid}>
                    {items.map(item => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            onToggleAvailability={handleToggleAvailability}
                            onDelete={handleDeleteItem}
                            onPriceUpdate={handlePriceUpdate}
                        />
                    ))}
                </div>
                {isModalOpen && <AddItemModal onClose={() => setIsModalOpen(false)} onItemAdded={refreshItems} />}
            </div>
        </Layout>
    );
};

export default CafeMenuPage;
