import { useState } from "react";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function App() {

    // =====================================================
    // LOGIN STATE
    // =====================================================

    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("access")
    );


    // =====================================================
    // USER ROLE
    // =====================================================

    const [userRole, setUserRole] = useState(
        localStorage.getItem("role") || ""
    );


    // =====================================================
    // MANAGER ACTIVE PAGE
    // =====================================================

    const [managerPage, setManagerPage] = useState("dashboard");


    // =====================================================
    // LOGIN SUCCESS
    // =====================================================

    const handleLoginSuccess = (role) => {

        console.log("LOGIN SUCCESS");
        console.log("USER ROLE:", role);

        // Save role
        localStorage.setItem("role", role);

        // Update login state
        setUserRole(role);
        setIsLoggedIn(true);

        // IMPORTANT:
        // Every new login should start from Dashboard
        setManagerPage("dashboard");
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        console.log("LOGOUT");

        // Remove authentication information
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("role");

        // Reset React state
        setIsLoggedIn(false);
        setUserRole("");

        // Reset manager page
        setManagerPage("dashboard");
    };


    // =====================================================
    // LOGIN PAGE
    // =====================================================

    if (!isLoggedIn) {

        return (
            <Login
                onLoginSuccess={handleLoginSuccess}
            />
        );
    }


    // =====================================================
    // ADMIN
    // =====================================================

    if (userRole === "ADMIN") {

        return (
            <AdminDashboard
                onLogout={handleLogout}
            />
        );
    }


    // =====================================================
    // MANAGER
    // =====================================================

    if (userRole === "MANAGER") {

        return (
            <ManagerDashboard
                onLogout={handleLogout}
                activePage={managerPage}
                setActivePage={setManagerPage}
            />
        );
    }


    // =====================================================
    // EMPLOYEE
    // =====================================================

    if (userRole === "EMPLOYEE") {

        return (
            <EmployeeDashboard
                onLogout={handleLogout}
            />
        );
    }


    // =====================================================
    // UNKNOWN ROLE
    // =====================================================

    return (
        <div>

            <h2>
                Unknown user role
            </h2>

            <button onClick={handleLogout}>
                Back to Login
            </button>

        </div>
    );
}

export default App;