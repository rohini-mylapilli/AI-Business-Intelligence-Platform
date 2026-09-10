import { useEffect, useState } from "react";
import axios from "axios";
import "./Settings.css";

function Settings() {

    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        role: "",
    });

    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
    });

    const [loading, setLoading] = useState(true);


    // =====================================================
    // GET CURRENT USER PROFILE
    // =====================================================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token =
                    localStorage.getItem("access");

                const response = await axios.get(
                    "http://127.0.0.1:8000/api/accounts/profile/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(
                    "PROFILE RESPONSE:",
                    response.data
                );

                setProfile(response.data);

            } catch (error) {

                console.error(
                    "PROFILE ERROR:",
                    error
                );

                console.error(
                    "STATUS:",
                    error.response?.status
                );

                console.error(
                    "DATA:",
                    error.response?.data
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);


    // =====================================================
    // PROFILE INPUT CHANGE
    // =====================================================

    const handleProfileChange = (e) => {

        const { name, value } = e.target;

        setProfile((previousProfile) => ({
            ...previousProfile,
            [name]: value,
        }));

    };


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const handleProfileSubmit = async (e) => {

        e.preventDefault();

        setProfileMessage("");

        try {

            const token =
                localStorage.getItem("access");

            const response = await axios.patch(
                "http://127.0.0.1:8000/api/accounts/profile/",
                {
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    username: profile.username,
                    email: profile.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "PROFILE UPDATE RESPONSE:",
                response.data
            );

            setProfile(
                response.data.user
            );

            setProfileMessage(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(
                "PROFILE UPDATE ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            setProfileMessage(
                error.response?.data?.error ||
                "Unable to update profile."
            );

        }

    };


    // =====================================================
    // PASSWORD INPUT CHANGE
    // =====================================================

    const handlePasswordChange = (e) => {

        const { name, value } = e.target;

        setPasswordData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

    };


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handlePasswordSubmit = async (e) => {

        e.preventDefault();

        setPasswordMessage("");

        try {

            const token =
                localStorage.getItem("access");

            const response = await axios.post(
                "http://127.0.0.1:8000/api/accounts/change-password/",
                passwordData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "PASSWORD RESPONSE:",
                response.data
            );

            setPasswordMessage(
                "Password changed successfully."
            );

            setPasswordData({
                current_password: "",
                new_password: "",
            });

        } catch (error) {

            console.error(
                "PASSWORD CHANGE ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            setPasswordMessage(
                error.response?.data?.error ||
                "Unable to change password."
            );

        }

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {
            return;
        }

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        window.location.href = "/";

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="settings-page">

                <h2>
                    Loading Settings...
                </h2>

            </div>
        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="settings-page">

            <h1>
                Settings
            </h1>

            <p>
                Manage your account and security settings.
            </p>


            {/* =================================================
                PROFILE SETTINGS
            ================================================= */}

            <section className="settings-section">

                <h2>
                    👤 Profile Settings
                </h2>

                <form
                    onSubmit={handleProfileSubmit}
                >

                    {/* FIRST NAME */}

                    <div className="settings-field">

                        <label>
                            First Name
                        </label>

                        <input
                            type="text"
                            name="first_name"
                            value={profile.first_name || ""}
                            onChange={handleProfileChange}
                        />

                    </div>


                    {/* LAST NAME */}

                    <div className="settings-field">

                        <label>
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="last_name"
                            value={profile.last_name || ""}
                            onChange={handleProfileChange}
                        />

                    </div>


                    {/* USERNAME */}

                    <div className="settings-field">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={profile.username || ""}
                            onChange={handleProfileChange}
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="settings-field">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={profile.email || ""}
                            onChange={handleProfileChange}
                        />

                    </div>


                    {/* ROLE */}

                    <div className="settings-field">

                        <label>
                            Role
                        </label>

                        <input
                            type="text"
                            value={profile.role || ""}
                            disabled
                        />

                    </div>


                    <button type="submit">
                        Update Profile
                    </button>

                </form>


                {profileMessage && (

                    <p>
                        {profileMessage}
                    </p>

                )}

            </section>


            {/* =================================================
                SECURITY
            ================================================= */}

            <section className="settings-section">

                <h2>
                    🔐 Security
                </h2>

                <form
                    onSubmit={handlePasswordSubmit}
                >

                    {/* CURRENT PASSWORD */}

                    <div className="settings-field">

                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            name="current_password"
                            value={
                                passwordData.current_password
                            }
                            onChange={handlePasswordChange}
                            required
                        />

                    </div>


                    {/* NEW PASSWORD */}

                    <div className="settings-field">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            name="new_password"
                            value={
                                passwordData.new_password
                            }
                            onChange={handlePasswordChange}
                            required
                        />

                    </div>


                    <button type="submit">
                        Change Password
                    </button>

                </form>


                {passwordMessage && (

                    <p>
                        {passwordMessage}
                    </p>

                )}

            </section>


            {/* =================================================
                LOGOUT
            ================================================= */}

            <section className="settings-section">

                <h2>
                    🚪 Account
                </h2>

                <p>
                    Sign out from your account.
                </p>

                <button
                    type="button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </section>

        </div>

    );

}

export default Settings;
