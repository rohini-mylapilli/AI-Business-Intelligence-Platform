import { useEffect, useState } from "react";
import axios from "axios";
import "./Sales.css";
import { API_BASE_URL } from "../api";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

function Sales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // FILTER STATES
    // =========================

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [soldByFilter, setSoldByFilter] = useState("ALL");
    const [dateFilter, setDateFilter] = useState("");

    // =========================
    // FETCH SALES
    // =========================

    const fetchSales = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("access");

            const response = await axios.get(
                `${API_BASE_URL}/api/sales/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "SALES RESPONSE:",
                response.data
            );

            const salesData = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setSales(salesData);

        } catch (error) {
            console.error(
                "SALES ERROR:",
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
                "Unable to load sales data."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    // =========================
    // DELETE SALE
    // =========================

    const deleteSale = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this sale?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const token =
                localStorage.getItem("access");

            await axios.delete(
                `${API_BASE_URL}/api/sales/${id}/`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setSales(
                (previousSales) =>
                    previousSales.filter(
                        (sale) =>
                            sale.id !== id
                    )
            );

            alert(
                "Sale deleted successfully"
            );

        } catch (error) {
            console.error(
                "DELETE SALE ERROR:",
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

            alert(
                "Unable to delete sale"
            );
        }
    };

    // =========================
    // GET CATEGORIES
    // =========================

    const categories = [
        ...new Set(
            sales.map(
                (sale) =>
                    sale.category
            )
        ),
    ];

    // =========================
    // GET SOLD BY USERS
    // =========================

    const soldByUsers = [
        ...new Set(
            sales.map(
                (sale) =>
                    sale.sold_by_name
            )
        ),
    ];

    // =========================
    // FILTER SALES
    // =========================

    const filteredSales =
        sales.filter((sale) => {

            const matchesSearch =
                sale.product_name
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesCategory =
                categoryFilter === "ALL" ||
                sale.category ===
                    categoryFilter;

            const matchesSoldBy =
                soldByFilter === "ALL" ||
                sale.sold_by_name ===
                    soldByFilter;

            const saleDate =
                sale.sale_date
                    ? new Date(
                        sale.sale_date
                    )
                        .toISOString()
                        .split("T")[0]
                    : "";

            const matchesDate =
                dateFilter === "" ||
                saleDate ===
                    dateFilter;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesSoldBy &&
                matchesDate
            );
        });

    // =========================
    // SUMMARY VALUES
    // =========================

    const totalSales =
        sales.length;

    const totalItemsSold =
        sales.reduce(
            (total, sale) =>
                total +
                Number(
                    sale.quantity || 0
                ),
            0
        );

    const totalRevenue =
        sales.reduce(
            (total, sale) =>
                total +
                Number(
                    sale.total_amount || 0
                ),
            0
        );

    // =========================
    // PRODUCT-WISE CHART DATA
    // =========================

    const productSalesData =
        Object.values(
            sales.reduce(
                (acc, sale) => {

                    const productName =
                        sale.product_name;

                    if (
                        !acc[productName]
                    ) {
                        acc[productName] = {
                            product:
                                productName,
                            quantity: 0,
                        };
                    }

                    acc[
                        productName
                    ].quantity +=
                        Number(
                            sale.quantity || 0
                        );

                    return acc;
                },
                {}
            )
        );

    // =========================
    // CATEGORY-WISE CHART DATA
    // =========================

    const categorySalesData =
        Object.values(
            sales.reduce(
                (acc, sale) => {

                    const category =
                        sale.category;

                    if (
                        !acc[category]
                    ) {
                        acc[category] = {
                            category:
                                category,
                            quantity: 0,
                        };
                    }

                    acc[
                        category
                    ].quantity +=
                        Number(
                            sale.quantity || 0
                        );

                    return acc;
                },
                {}
            )
        );

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="sales-page">
                <h2>
                    Loading sales...
                </h2>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div className="sales-page">
                <h2>
                    {error}
                </h2>
            </div>
        );
    }

    // =========================
    // MAIN PAGE
    // =========================

    return (
        <div className="sales-page">

            <h1>
                Sales Management
            </h1>

            <p>
                View all product sales details
            </p>

            <section className="sales-summary">

                <div className="sales-summary-card">

                    <div className="summary-icon">
                        🛒
                    </div>

                    <div>

                        <p>
                            Total Sales
                        </p>

                        <h2>
                            {totalSales}
                        </h2>

                    </div>

                </div>

                <div className="sales-summary-card">

                    <div className="summary-icon">
                        💰
                    </div>

                    <div>

                        <p>
                            Total Revenue
                        </p>

                        <h2>
                            ₹
                            {totalRevenue.toLocaleString(
                                "en-IN"
                            )}
                        </h2>

                    </div>

                </div>

                <div className="sales-summary-card">

                    <div className="summary-icon">
                        📦
                    </div>

                    <div>

                        <p>
                            Items Sold
                        </p>

                        <h2>
                            {totalItemsSold}
                        </h2>

                    </div>

                </div>

            </section>

            <section className="sales-charts-container">

                <div className="sales-chart-card">

                    <h2>
                        Product-wise Sales
                    </h2>

                    <p>
                        Quantity of products sold
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
                                data={
                                    productSalesData
                                }
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 50,
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="product"
                                    angle={-20}
                                    textAnchor="end"
                                    interval={0}
                                />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="quantity"
                                    name="Items Sold"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                <div className="sales-chart-card">

                    <h2>
                        Category-wise Sales
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
                                        categorySalesData
                                    }
                                    dataKey="quantity"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    label
                                >

                                    {categorySalesData.map(
                                        (
                                            entry,
                                            index
                                        ) => (

                                            <Cell
                                                key={
                                                    `cell-${index}`
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

            <div className="sales-filters">

                <input
                    type="text"
                    placeholder="Search Product..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

                <select
                    value={
                        categoryFilter
                    }
                    onChange={(e) =>
                        setCategoryFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="ALL">
                        All Categories
                    </option>

                    {categories.map(
                        (category) => (

                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>

                        )
                    )}

                </select>

                <select
                    value={
                        soldByFilter
                    }
                    onChange={(e) =>
                        setSoldByFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="ALL">
                        All Users
                    </option>

                    {soldByUsers.map(
                        (user) => (

                            <option
                                key={user}
                                value={user}
                            >
                                {user}
                            </option>

                        )
                    )}

                </select>

                <input
                    type="date"
                    value={
                        dateFilter
                    }
                    onChange={(e) =>
                        setDateFilter(
                            e.target.value
                        )
                    }
                />

                <button
                    onClick={() => {

                        setSearch("");

                        setCategoryFilter(
                            "ALL"
                        );

                        setSoldByFilter(
                            "ALL"
                        );

                        setDateFilter("");

                    }}
                >
                    Clear Filters
                </button>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>
                            ID
                        </th>

                        <th>
                            Product
                        </th>

                        <th>
                            Category
                        </th>

                        <th>
                            Quantity
                        </th>

                        <th>
                            Sold By
                        </th>

                        <th>
                            Total Amount
                        </th>

                        <th>
                            Sale Date
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {filteredSales.length === 0 ? (

                        <tr>

                            <td colSpan="8">
                                No sales found
                            </td>

                        </tr>

                    ) : (

                        filteredSales.map(
                            (sale) => (

                                <tr
                                    key={sale.id}
                                >

                                    <td>
                                        {sale.id}
                                    </td>

                                    <td>
                                        {sale.product_name}
                                    </td>

                                    <td>
                                        {sale.category}
                                    </td>

                                    <td>
                                        {sale.quantity}
                                    </td>

                                    <td>
                                        {sale.sold_by_name}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            sale.total_amount
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td>
                                        {new Date(
                                            sale.sale_date
                                        ).toLocaleDateString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                deleteSale(
                                                    sale.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            )
                        )

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default Sales;