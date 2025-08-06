import { useState } from "react";
import "./EditProfile.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function EditProfile() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(
                "http://localhost:3000/update",
                { name, username, bio },
                { withCredentials: true } 
            );

            toast.success("Profile Updated Successfully!");
            console.log("Updated Profile:", res.data.updatedUser);
        } catch (err) {
            // Axios error handling
            const errorMessage = err.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
            console.error(err);
        }
    };

    return (
        <div className="edit-profile-container">
            <h1>Edit Profile</h1>
            <form className="edit-profile-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">Save Changes</button>
            </form>

            {/* Toastify Container */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default EditProfile;
