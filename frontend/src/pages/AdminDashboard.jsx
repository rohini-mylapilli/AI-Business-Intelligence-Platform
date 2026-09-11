import { useEffect, useState } from "react";
import axios from "axios";

import "./AdminDashboard.css";

import Users from "./Users";
import Sales from "./Sales";
import Products from "./Products";
import Analytics from "./Analytics";
import Reports from "./Reports";
import Settings from "./Settings";
import { API_BASE_URL } from "../api";


function AdminDashboard({ onLogout }) {

    const [currentPage, setCurrentPage] = useState("dashboard");

    const [dashboardData, setDashboardData] = useState({
        total_users: 0,
        total_sales: 0,
        total_revenue: 0,
        total_reports: 0,
        total_products: 0,
    });

    const [loading, setLoading] = useState(true);


    // =========================
    // DASHBOARD DATA
    // =========================

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const accessToken = localStorage.getItem("access");

                const response = await axios.get(
                    `${API_BASE_URL}/api/dashboard/`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                console.log(
                    "DASHBOARD RESPONSE:",
                    response.data
                );

                setDashboardData(response.data);

            } catch (error) {

                console.error(
                    "DASHBOARD API ERROR:",
                    error.response?.data || error.message
                );

            } finally {

                setLoading(false);

            }

        };

        fetchDashboardData();

    }, [currentPage]);


    return (

        <div className="admin-dashboard">


            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="sidebar">

                <div className="logo">
                    AI
                </div>

                <h2>AI Business</h2>


                <nav>

                    <button
                        onClick={() =>
                            setCurrentPage("dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        onClick={() =>
                            setCurrentPage("users")
                        }
                    >
                        Users
                    </button>


                    <button
                        onClick={() =>
                            setCurrentPage("products")
                        }
                    >
                        Products
                    </button>


                    <button
                        onClick={() =>
                            setCurrentPage("sales")
                        }
                    >
                        Sales
                    </button>


                    <button 
                         onClick={() => setCurrentPage("analytics")}>
                        Analytics
                    </button>


                    <button onClick={() => setCurrentPage("reports")}>
                        Reports
                    </button>


                    <button onClick={() => setCurrentPage("settings")}>
                        Settings
                    </button>

                </nav>


                <button
                    className="logout-button"
                    onClick={onLogout}
                >
                    Logout
                </button>

            </aside>



            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="dashboard-content">


                {/* USERS */}

                {currentPage === "users" ? (

                    <Users />



                /* PRODUCTS */

                ) : currentPage === "products" ? (

                    <Products />



                /* SALES */

                ) : currentPage === "sales" ? (

                    <Sales />

                ) : currentPage === "analytics"?(
                    <Analytics />
                ) : currentPage === "reports"?(
                    <Reports />
                ) : currentPage === "settings"?(
                    <Settings />
                /* DASHBOARD */

                ) : (

                    <>


                        {/* HEADER */}

                        <header className="dashboard-header">

                            <div>

                                <h1>
                                    Admin Dashboard
                                </h1>

                                <p>
                                    Welcome to AI Business
                                    Intelligence Platform
                                </p>

                            </div>


                            <div className="admin-profile">

                                <span>
                                    👤
                                </span>

                                <span>
                                    Admin
                                </span>

                                <button
                                    className="header-logout"
                                    onClick={onLogout}
                                >
                                    Logout
                                </button>

                            </div>

                        </header>



                        {/* =========================
                            STATISTICS
                        ========================= */}

                        <section className="stats-container">


                            {/* TOTAL USERS */}

                            <div
                                className="stat-card"
                                onClick={() =>
                                    setCurrentPage("users")
                                }
                            >

                                <div className="stat-icon">
                                    👥
                                </div>

                                <div>

                                    <p>
                                        Total Users
                                    </p>

                                    <h2>
                                        {dashboardData.total_users}
                                    </h2>

                                </div>

                            </div>



                            {/* TOTAL SALES */}

                            <div
                                className="stat-card"
                                onClick={() =>
                                    setCurrentPage("sales")
                                }
                            >

                                <div className="stat-icon">
                                    🛒
                                </div>

                                <div>

                                    <p>
                                        Total Sales
                                    </p>

                                    <h2>
                                        {dashboardData.total_sales}
                                    </h2>

                                </div>

                            </div>



                            {/* TOTAL REVENUE */}

                            <div className="stat-card">

                                <div className="stat-icon">
                                    💰
                                </div>

                                <div>

                                    <p>
                                        Total Revenue
                                    </p>

                                    <h2>
                                        ₹
                                        {Number(
                                            dashboardData.total_revenue
                                        ).toLocaleString("en-IN")}
                                    </h2>

                                </div>

                            </div>



                            {/* TOTAL REPORTS */}

                            <div className="stat-card">

                                <div className="stat-icon">
                                    📊
                                </div>

                                <div>

                                    <p>
                                        Total Reports
                                    </p>

                                    <h2>
                                        {dashboardData.total_reports}
                                    </h2>

                                </div>

                            </div>

                        </section>



                        {/* ANALYTICS */}

                        <section className="analytics-section">

                            <div className="analytics-card">

                                <h2>
                                    Business Analytics
                                </h2>

                                <p>
                                    Overview of your business
                                    performance.
                                </p>

                                <p>
                                    Total Products:
                                    {" "}
                                    {dashboardData.total_products}
                                </p>

                                <p>
                                    Total Sales:
                                    {" "}
                                    {dashboardData.total_sales}
                                </p>

                                <p>
                                    Total Revenue:
                                    {" "}
                                    ₹
                                    {Number(
                                        dashboardData.total_revenue
                                    ).toLocaleString("en-IN")}
                                </p>

                            </div>


                            <div className="analytics-card">

                                <h2>
                                    Recent Activity
                                </h2>

                                <p>
                                    No recent activity.
                                </p>

                            </div>

                        </section>

                    </>

                )}

            </main>

        </div>

    );

}

export default AdminDashboard;