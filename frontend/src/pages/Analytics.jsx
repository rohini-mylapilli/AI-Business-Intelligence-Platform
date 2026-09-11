import { useEffect, useState } from "react";
import axios from "axios";
import "./Analytics.css";
import { API_BASE_URL } from "../api";

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";


function Analytics() {

    // =========================
    // STATES
    // =========================

    const [dashboard, setDashboard] = useState(null);

    const [categorySales, setCategorySales] = useState([]);

    const [topProducts, setTopProducts] = useState([]);

    const [salesTrend, setSalesTrend] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // FETCH ANALYTICS DATA
    // =========================

    useEffect(() => {

        const fetchAnalytics = async () => {

            try {

                setLoading(true);

                setError("");


                const token =
                    localStorage.getItem("access");


                const config = {

                    headers: {

                        Authorization:
                            `Bearer ${token}`,

                    },

                };


                // Dashboard summary

                const dashboardResponse =
                    await axios.get(

                        `${API_BASE_URL}/api/dashboard/`,

                        config

                    );


                // Category sales

                const categoryResponse =
                    await axios.get(

                        `${API_BASE_URL}/api/dashboard/sales-by-category/`,

                        config

                    );


                // Top products

                const productsResponse =
                    await axios.get(

                        `${API_BASE_URL}/api/dashboard/top-selling-products/`,

                        config

                    );


                // Sales trend

                const trendResponse =
                    await axios.get(

                        `${API_BASE_URL}/api/dashboard/sales-trend/`,

                        config

                    );


                console.log(
                    "ANALYTICS DASHBOARD:",
                    dashboardResponse.data
                );


                console.log(
                    "CATEGORY SALES:",
                    categoryResponse.data
                );


                console.log(
                    "TOP PRODUCTS:",
                    productsResponse.data
                );


                console.log(
                    "SALES TREND:",
                    trendResponse.data
                );


                setDashboard(
                    dashboardResponse.data
                );


                setCategorySales(
                    categoryResponse.data
                );


                setTopProducts(
                    productsResponse.data
                );


                setSalesTrend(
                    trendResponse.data
                );


            } catch (error) {

                console.error(
                    "ANALYTICS ERROR:",
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


                setError(
                    "Unable to load analytics data."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchAnalytics();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div>

                <h2>
                    Loading Analytics...
                </h2>

            </div>

        );

    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (

            <div>

                <h2>
                    {error}
                </h2>

            </div>

        );

    }


    // =========================
    // AI RECOMMENDATIONS
    // =========================

    const recommendations = [];


    // Recommendation 1
    // Based on top-selling product

    if (topProducts.length > 0) {

        const bestProduct =
            topProducts[0];


        recommendations.push({

            type: "success",

            icon: "🔥",

            title: "Top Selling Product",

            message:
                `${bestProduct.product__name || bestProduct.product_name} is currently your best-selling product.`,

        });

    }


    // Recommendation 2
    // Based on best category

    if (categorySales.length > 0) {

        const bestCategory =
            categorySales[0];


        recommendations.push({

            type: "info",

            icon: "📈",

            title: "Strong Category",

            message:
                `${bestCategory.product__category || bestCategory.category} is performing strongly. Consider promoting products in this category.`,

        });

    }


    // Recommendation 3
    // Revenue recommendation

    if (
        dashboard &&
        Number(
            dashboard.total_revenue || 0
        ) > 0
    ) {

        recommendations.push({

            type: "money",

            icon: "💰",

            title: "Revenue Opportunity",

            message:
                "Your business is generating revenue from sales. Focus on your best-selling products to improve overall revenue.",

        });

    }


    // Default recommendation

    if (
        recommendations.length === 0
    ) {

        recommendations.push({

            type: "info",

            icon: "🤖",

            title: "AI Recommendation",

            message:
                "More sales data is required to generate useful business recommendations.",

        });

    }


    return (

        <div className="analytics-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="analytics-header">

                <h1>
                    Business Analytics
                </h1>

                <p>
                    Overview of your business performance.
                </p>

            </div>



            {/* =========================
                BUSINESS PERFORMANCE
            ========================= */}

            <section className="analytics-summary">


                {/* USERS */}

                <div className="analytics-card">

                    <div className="analytics-icon">
                        👥
                    </div>

                    <div>

                        <p>
                            Total Users
                        </p>

                        <h2>

                            {dashboard?.total_users ??
                                0}

                        </h2>

                    </div>

                </div>



                {/* PRODUCTS */}

                <div className="analytics-card">

                    <div className="analytics-icon">
                        📦
                    </div>

                    <div>

                        <p>
                            Total Products
                        </p>

                        <h2>

                            {dashboard?.total_products ??
                                0}

                        </h2>

                    </div>

                </div>



                {/* SALES */}

                <div className="analytics-card">

                    <div className="analytics-icon">
                        🛒
                    </div>

                    <div>

                        <p>
                            Total Sales
                        </p>

                        <h2>

                            {dashboard?.total_sales ??
                                0}

                        </h2>

                    </div>

                </div>



                {/* REVENUE */}

                <div className="analytics-card">

                    <div className="analytics-icon">
                        💰
                    </div>

                    <div>

                        <p>
                            Total Revenue
                        </p>

                        <h2>

                            ₹
                            {Number(
                                dashboard?.total_revenue ||
                                0
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </h2>

                    </div>

                </div>


            </section>



            {/* =========================
                CHARTS
            ========================= */}

            <section className="analytics-charts">


                {/* =========================
                    SALES TREND
                ========================= */}

                <div className="analytics-chart-card">

                    <h2>
                        Sales Trend
                    </h2>

                    <p>
                        Sales and revenue over time
                    </p>


                    <div
                        style={{
                            width: "100%",
                            height: 350,
                        }}
                    >

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <LineChart
                                data={salesTrend}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="sale_date__date"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />


                                <Line
                                    type="monotone"
                                    dataKey="total_sales"
                                    name="Sales"
                                />


                                <Line
                                    type="monotone"
                                    dataKey="total_revenue"
                                    name="Revenue"
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>



                {/* =========================
                    TOP PRODUCTS
                ========================= */}

                <div className="analytics-chart-card">

                    <h2>
                        Top Selling Products
                    </h2>

                    <p>
                        Best performing products
                    </p>


                    <div
                        style={{
                            width: "100%",
                            height: 350,
                        }}
                    >

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                data={topProducts}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="product__name"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />


                                <Bar
                                    dataKey="total_quantity"
                                    name="Quantity Sold"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>



                {/* =========================
                    CATEGORY SALES
                ========================= */}

                <div className="analytics-chart-card">

                    <h2>
                        Category Performance
                    </h2>

                    <p>
                        Sales distribution by category
                    </p>


                    <div
                        style={{
                            width: "100%",
                            height: 350,
                        }}
                    >

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie

                                    data={
                                        categorySales
                                    }

                                    dataKey="total_sales"

                                    nameKey="product__category"

                                    cx="50%"

                                    cy="50%"

                                    outerRadius={120}

                                    label

                                >

                                    {categorySales.map(

                                        (
                                            entry,
                                            index
                                        ) => (

                                            <Cell
                                                key={
                                                    `category-${index}`
                                                }
                                            />

                                        )

                                    )}

                                </Pie>


                                <Tooltip />


                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>


            </section>



            {/* =========================
                AI RECOMMENDATIONS
            ========================= */}

            <section className="ai-recommendations">


                <div className="ai-header">

                    <div>

                        <h2>
                            🤖 AI Recommendations
                        </h2>

                        <p>
                            Smart business insights based on your sales data
                        </p>

                    </div>

                </div>


                <div className="recommendations-list">


                    {recommendations.map(

                        (
                            recommendation,
                            index
                        ) => (

                            <div
                                className="recommendation-card"
                                key={index}
                            >

                                <div className="recommendation-icon">

                                    {recommendation.icon}

                                </div>


                                <div>

                                    <h3>

                                        {
                                            recommendation.title
                                        }

                                    </h3>


                                    <p>

                                        {
                                            recommendation.message
                                        }

                                    </p>

                                </div>

                            </div>

                        )

                    )}


                </div>


            </section>


        </div>

    );

}


export default Analytics;