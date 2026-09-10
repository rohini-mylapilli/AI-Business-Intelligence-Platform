import { useState } from "react";
import axios from "axios";
import "./Login.css";


function UserIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="field-icon"
        >
            <circle
                cx="12"
                cy="8"
                r="4"
            />

            <path
                d="M4 21c0-4 3.5-7 8-7s8 3 8 7"
            />
        </svg>
    );
}


function LockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="field-icon"
        >
            <rect
                x="5"
                y="10"
                width="14"
                height="11"
                rx="2"
            />

            <path
                d="M8 10V7a4 4 0 0 1 8 0v3"
            />
        </svg>
    );
}


function EyeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="eye-icon"
        >
            <path
                d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"
            />

            <circle
                cx="12"
                cy="12"
                r="2.5"
            />
        </svg>
    );
}


function ShieldIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="shield-icon"
        >
            <path
                d="M12 3l8 3v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3z"
            />

            <path
                d="M9 12l2 2 4-4"
            />
        </svg>
    );
}


function Login({ onLoginSuccess }) {

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        console.log(
            "LOGIN BUTTON CLICKED"
        );


        if (loading) {
            return;
        }


        try {

            setLoading(true);


            // =================================================
            // STEP 1: LOGIN API
            // =================================================

            const response = await axios.post(

                "http://127.0.0.1:8000/api/auth/login/",

                {
                    username: username,
                    password: password,
                }

            );


            console.log(
                "LOGIN RESPONSE:",
                response.data
            );


            // =================================================
            // STEP 2: GET JWT TOKENS
            // =================================================

            const accessToken =
                response.data.access;

            const refreshToken =
                response.data.refresh;


            if (!accessToken) {

                throw new Error(
                    "Access token not received."
                );

            }


            // =================================================
            // STEP 3: SAVE TOKENS
            // =================================================

            localStorage.setItem(
                "access",
                accessToken
            );

            localStorage.setItem(
                "refresh",
                refreshToken
            );


            console.log(
                "JWT TOKENS SAVED"
            );


            // =================================================
            // STEP 4: GET USER PROFILE
            // =================================================

            const profileResponse =
                await axios.get(

                    "http://127.0.0.1:8000/api/auth/profile/",

                    {
                        headers: {

                            Authorization:
                                `Bearer ${accessToken}`,

                        },
                    }

                );


            console.log(
                "PROFILE RESPONSE:",
                profileResponse.data
            );


            // =================================================
            // STEP 5: GET USER ROLE
            // =================================================

            const user =
                profileResponse.data;


            const role =
                user.role;


            console.log(
                "LOGGED-IN USER:",
                user
            );


            console.log(
                "USER ROLE:",
                role
            );


            // =================================================
            // STEP 6: VALIDATE ROLE
            // =================================================

            const allowedRoles = [
                "ADMIN",
                "MANAGER",
                "EMPLOYEE",
            ];


            if (
                !allowedRoles.includes(role)
            ) {

                throw new Error(
                    "Invalid user role."
                );

            }


            // =================================================
            // STEP 7: SAVE ROLE + USER
            // =================================================

            localStorage.setItem(
                "role",
                role
            );


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            console.log(
                "ROLE SAVED:",
                role
            );


            // =================================================
            // STEP 8: SUCCESS MESSAGE
            // =================================================

            alert(
                `Login successful! Role: ${role}`
            );


            // =================================================
            // STEP 9: SEND ROLE TO APP.JSX
            // =================================================

            onLoginSuccess(role);


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
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


            // =================================================
            // REMOVE INVALID LOGIN DATA
            // =================================================

            localStorage.removeItem(
                "access"
            );

            localStorage.removeItem(
                "refresh"
            );

            localStorage.removeItem(
                "role"
            );

            localStorage.removeItem(
                "user"
            );


            // =================================================
            // ERROR MESSAGE
            // =================================================

            if (
                error.response?.status === 401
            ) {

                alert(
                    "Invalid username or password."
                );

            }

            else if (
                error.response?.status === 403
            ) {

                alert(
                    "You do not have permission to login."
                );

            }

            else if (
                error.response
            ) {

                alert(
                    "Login failed. Please check the console."
                );

            }

            else {

                alert(
                    "Unable to connect to backend."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="login-page">


            {/* ============================================
                BACKGROUND DECORATIONS
            ============================================ */}

            <div
                className="background-circle circle-left"
            ></div>


            <div
                className="background-circle circle-right"
            ></div>


            <div
                className="dot-pattern"
            ></div>


            <div
                className="glow-dot dot-one"
            ></div>


            <div
                className="glow-dot dot-two"
            ></div>


            <div
                className="glow-dot dot-three"
            ></div>


            {/* ============================================
                BACKGROUND GRAPH
            ============================================ */}

            <div
                className="graph graph-left"
            >

                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>


            <div
                className="graph graph-right"
            >

                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>


            {/* ============================================
                LOGIN CARD
            ============================================ */}

            <div className="login-card">


                <div className="login-content">


                    {/* ========================================
                        AI LOGO
                    ======================================== */}

                    <div className="ai-logo">
                        AI
                    </div>


                    <h1>
                        AI Business Intelligence
                    </h1>


                    <div className="title-decoration">

                        <span></span>

                        <i></i>

                        <span></span>

                    </div>


                    <p className="subtitle">

                        Intelligent insights for smarter
                        business decisions

                    </p>


                    {/* ========================================
                        LOGIN FORM
                    ======================================== */}

                    <form
                        onSubmit={handleLogin}
                    >


                        {/* ====================================
                            USERNAME
                        ==================================== */}

                        <div className="input-group">

                            <label>
                                Username
                            </label>


                            <div className="input-box">

                                <UserIcon />


                                <input

                                    type="text"

                                    placeholder="Enter your username"

                                    value={username}

                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }

                                    required

                                    disabled={loading}

                                />

                            </div>

                        </div>


                        {/* ====================================
                            PASSWORD
                        ==================================== */}

                        <div className="input-group">

                            <label>
                                Password
                            </label>


                            <div className="input-box">

                                <LockIcon />


                                <input

                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }

                                    placeholder="Enter your password"

                                    value={password}

                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }

                                    required

                                    disabled={loading}

                                />


                                <button

                                    type="button"

                                    className="eye-button"

                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }

                                    disabled={loading}

                                >

                                    <EyeIcon />

                                </button>

                            </div>

                        </div>


                        {/* ====================================
                            LOGIN BUTTON
                        ==================================== */}

                        <button

                            type="submit"

                            className="login-button"

                            disabled={loading}

                        >

                            <span>

                                {loading
                                    ? "Logging in..."
                                    : "Login"}

                            </span>


                            <span className="login-arrow">

                                {loading
                                    ? "..."
                                    : "→"}

                            </span>

                        </button>


                    </form>


                    {/* ========================================
                        SECURE TEXT
                    ======================================== */}

                    <div className="secure-text">

                        <ShieldIcon />

                        <span>

                            Secure role-based business platform

                        </span>

                    </div>


                </div>

            </div>

        </div>

    );

}


export default Login;