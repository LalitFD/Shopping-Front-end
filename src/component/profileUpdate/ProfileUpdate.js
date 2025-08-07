import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './ProfileUpdate.css';
import styles from './ProfileUpdate.module.css';

import { useNavigate } from 'react-router-dom';
import End_Points from '../../api/End_Points';

function ProfileUpdate() {
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        if (!selectedFile) {
            toast.warning("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("imageName", selectedFile);

        try {
            const response = await axios.post(End_Points.PROFILE_UPDATE, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });



            const updatedUser = JSON.parse(sessionStorage.getItem("Social-User"));
            updatedUser.profile.imageName = response.data.imageName;
            sessionStorage.setItem("Social-User", JSON.stringify(updatedUser));

            toast.success("Profile updated successfully!");
            navigate("/profile");


        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile.");
        }
    };

    return <>


        <h2 style={{ marginLeft: "100px" }}>Profile Update</h2>

        <div className={styles['profile-update-container']}>
            <ToastContainer />
            <input type="file" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Preview" className={styles['image-preview']} />}
            <button className={styles.button} onClick={handleUpdate}>Update</button>
        </div>

    </>

}

export default ProfileUpdate;
