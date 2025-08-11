import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import End_Points from '../../api/End_Points';
import styles from './ProfileUpdate.module.css';

function ProfileUpdate() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, GIF allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be < 5MB");
            return;
        }
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpdate = async () => {
        if (!selectedFile) {
            toast.warning("Please select an image");
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append("imageName", selectedFile);

        try {
            const res = await axios.post(End_Points.PROFILE_UPDATE, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            const updatedUser = JSON.parse(sessionStorage.getItem("Social-User"));
            updatedUser.profile.imageName = res.data.imageName;
            sessionStorage.setItem("Social-User", JSON.stringify(updatedUser));

            toast.success("Profile updated successfully!");
            navigate("/profile");
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles['pu-container']}>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <h2 className={styles['pu-title']}>Update Profile Picture</h2>

            <div className={styles['pu-preview']}>
                {preview ? (
                    <img src={preview} alt="Preview" className={styles['pu-image']} />
                ) : (
                    <div className={styles['pu-placeholder']}>No Image Selected</div>
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className={styles['pu-file-input']}
            />

            {selectedFile && (
                <p className={styles['pu-file-name']}>{selectedFile.name}</p>
            )}

            <div className={styles['pu-buttons']}>
                <button onClick={() => navigate("/profile")} disabled={isUploading}>
                    Cancel
                </button>
                <button
                    onClick={handleUpdate}
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? "Updating..." : "Update"}
                </button>
            </div>

            <p className={styles['pu-note']}>
                Supported formats: JPG, PNG, GIF | Max size: 5MB
            </p>
        </div>
    );
}

export default ProfileUpdate;
