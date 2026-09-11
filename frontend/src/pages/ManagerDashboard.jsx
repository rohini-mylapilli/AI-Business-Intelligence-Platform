import { useEffect, useState } from "react";
import axios from "axios";
import "./ManagerDashboard.css";
import { API_BASE_URL } from "../api";

function ManagerDashboard({
    onLogout,
    activePage,
    setActivePage
}) {

    // =====================================================
    // DASHBOARD STATE
    // =====================================================

    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // PRODUCT MODAL STATE
    // =====================================================

    const [showProductModal, setShowProductModal] =
        useState(false);

    const [showViewModal, setShowViewModal] =
        useState(false);

    const [editingProduct, setEditingProduct] =
        useState(null);

    const [selectedProduct, setSelectedProduct] =
        useState(null);


    // =====================================================
    // PRODUCT FORM
    // =====================================================

    const [productName, setProductName] =
        useState("");

    const [productCategory, setProductCategory] =
        useState("ELECTRONICS");

    const [productPrice, setProductPrice] =
        useState("");

    const [productStock, setProductStock] =
        useState("");

    const [productLoading, setProductLoading] =
        useState(false);

    const [productError, setProductError] =
        useState("");


    // =====================================================
    // PASSWORD STATE
    // =====================================================

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [passwordMessage, setPasswordMessage] =
        useState("");

    const [passwordError, setPasswordError] =
        useState("");

    const [passwordLoading, setPasswordLoading] =
        useState(false);


    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = () => {

        return localStorage.getItem("access");

    };


    // =====================================================
    // API CONFIG
    // =====================================================

    const getConfig = () => {

        const token = getToken();

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

    };


    // =====================================================
    // FETCH DASHBOARD DATA
    // =====================================================

    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {

                setError(
                    "Authentication token not found."
                );

                return;

            }

            const config = getConfig();

            const [
                salesResponse,
                productsResponse
            ] = await Promise.all([

                axios.get(
                    `${API_BASE_URL}/api/sales/`,
                    config
                ),

                axios.get(
                    `${API_BASE_URL}/api/products/`,
                    config
                )

            ]);

            const salesData =
                Array.isArray(salesResponse.data)
                    ? salesResponse.data
                    : salesResponse.data.results || [];

            const productsData =
                Array.isArray(productsResponse.data)
                    ? productsResponse.data
                    : productsResponse.data.results || [];

            setSales(salesData);
            setProducts(productsData);

        }

        catch (err) {

            console.error(
                "MANAGER DASHBOARD ERROR:",
                err.response?.data || err
            );

            if (err.response?.status === 401) {

                setError(
                    "Session expired. Please login again."
                );

            }

            else if (err.response?.status === 403) {

                setError(
                    "You do not have permission to view this data."
                );

            }

            else {

                setError(
                    "Unable to load dashboard data."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchDashboardData();

    }, []);


    // =====================================================
    // CALCULATE DASHBOARD VALUES
    // =====================================================

    const totalSales = sales.length;


    const totalRevenue = sales.reduce(
        (total, sale) => {

            return total +
                Number(sale.total_amount || 0);

        },
        0
    );


    const productsSold = sales.reduce(
        (total, sale) => {

            return total +
                Number(sale.quantity || 0);

        },
        0
    );


    const lowStock = products.filter(
        product =>
            Number(product.stock || 0) <= 5
    ).length;


    // =====================================================
    // EMPLOYEE WISE REPORT
    // =====================================================

    const employeeReports = Object.values(

        sales.reduce((employees, sale) => {

            const employeeName =
                sale.sold_by_name ||
                "Unknown Employee";


            if (!employees[employeeName]) {

                employees[employeeName] = {

                    name: employeeName,

                    totalSales: 0,

                    productsSold: 0,

                    totalRevenue: 0

                };

            }


            employees[employeeName].totalSales += 1;


            employees[employeeName].productsSold +=
                Number(sale.quantity || 0);


            employees[employeeName].totalRevenue +=
                Number(sale.total_amount || 0);


            return employees;

        }, {})

    );


    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(value);

    };


    // =====================================================
    // OPEN ADD PRODUCT
    // =====================================================

    const openAddProduct = () => {

        setEditingProduct(null);

        setProductName("");
        setProductCategory("ELECTRONICS");
        setProductPrice("");
        setProductStock("");

        setProductError("");

        setShowProductModal(true);

    };


    // =====================================================
    // OPEN EDIT PRODUCT
    // =====================================================

    const openEditProduct = (product) => {

        setEditingProduct(product);

        setProductName(
            product.name || ""
        );

        setProductCategory(
            product.category || "ELECTRONICS"
        );

        setProductPrice(
            product.price || ""
        );

        setProductStock(
            product.stock ?? ""
        );

        setProductError("");

        setShowProductModal(true);

    };


    // =====================================================
    // CLOSE PRODUCT MODAL
    // =====================================================

    const closeProductModal = () => {

        setShowProductModal(false);

        setEditingProduct(null);

        setProductError("");

    };


    // =====================================================
    // ADD / EDIT PRODUCT
    // =====================================================

    const handleProductSubmit = async (e) => {

        e.preventDefault();

        setProductError("");


        if (!productName.trim()) {

            setProductError(
                "Product name is required."
            );

            return;

        }


        if (productPrice === "") {

            setProductError(
                "Product price is required."
            );

            return;

        }


        if (productStock === "") {

            setProductError(
                "Product stock is required."
            );

            return;

        }


        try {

            setProductLoading(true);

            const productData = {

                name: productName.trim(),

                category: productCategory,

                price: Number(productPrice),

                stock: Number(productStock)

            };


            const config = getConfig();


            if (editingProduct) {

                await axios.patch(

                    `${API_BASE_URL}/api/products/${editingProduct.id}/`,

                    productData,

                    config

                );

            }

            else {

                await axios.post(

                    `${API_BASE_URL}/api/products/`,

                    productData,

                    config

                );

            }


            await fetchDashboardData();

            closeProductModal();

        }

        catch (err) {

            console.error(
                "PRODUCT SAVE ERROR:",
                err.response?.data || err
            );

            const backendError =
                err.response?.data;

            if (backendError) {

                const firstError =
                    Object.values(backendError)[0];

                setProductError(

                    Array.isArray(firstError)
                        ? firstError[0]
                        : String(firstError)

                );

            }

            else {

                setProductError(
                    "Unable to save product."
                );

            }

        }

        finally {

            setProductLoading(false);

        }

    };


    // =====================================================
    // VIEW PRODUCT
    // =====================================================

    const handleViewProduct = async (product) => {

        try {

            const response = await axios.get(

                `${API_BASE_URL}/api/products/${product.id}/`,

                getConfig()

            );

            setSelectedProduct(
                response.data
            );

            setShowViewModal(true);

        }

        catch (err) {

            console.error(
                "VIEW PRODUCT ERROR:",
                err.response?.data || err
            );

            setError(
                "Unable to load product details."
            );

        }

    };


    // =====================================================
    // CLOSE VIEW MODAL
    // =====================================================

    const closeViewModal = () => {

        setShowViewModal(false);

        setSelectedProduct(null);

    };


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handlePasswordChange = async (e) => {

        e.preventDefault();

        setPasswordMessage("");
        setPasswordError("");


        if (
            currentPassword.trim() === "" ||
            newPassword === "" ||
            confirmPassword === ""
        ) {

            setPasswordError(
                "All fields are required."
            );

            return;

        }


        if (newPassword.length < 8) {

            setPasswordError(
                "New password must be at least 8 characters."
            );

            return;

        }


        if (newPassword !== confirmPassword) {

            setPasswordError(
                "New password and confirm password do not match."
            );

            return;

        }


        if (currentPassword === newPassword) {

            setPasswordError(
                "New password must be different from current password."
            );

            return;

        }


        try {

            setPasswordLoading(true);


            const response = await axios.post(

                `${API_BASE_URL}/api/auth/change-password/`,

                {
                    current_password:
                        currentPassword,

                    new_password:
                        newPassword,

                    confirm_password:
                        confirmPassword
                },

                getConfig()

            );


            setPasswordMessage(

                response.data.message ||
                "Password changed successfully."

            );


            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        }

        catch (err) {

            console.error(
                "CHANGE PASSWORD ERROR:",
                err.response?.data || err
            );

            if (err.response?.status === 401) {

                setPasswordError(
                    "Session expired. Please login again."
                );

            }

            else if (err.response?.data?.detail) {

                setPasswordError(
                    err.response.data.detail
                );

            }

            else {

                setPasswordError(
                    "Unable to change password."
                );

            }

        }

        finally {

            setPasswordLoading(false);

        }

    };


    // =====================================================
    // DASHBOARD PAGE
    // =====================================================

    const DashboardPage = () => {

        return (

            <div className="manager-content">

                <div className="page-header">

                    <div>

                        <h1>
                            Manager Dashboard
                        </h1>

                        <p>
                            Monitor business performance and team activities
                        </p>

                    </div>


                    <div className="user-info">

                        <span>
                            👤
                        </span>

                        <strong>
                            Manager
                        </strong>

                        <button
                            className="top-logout-btn"
                            onClick={onLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>


                {error && (

                    <div className="dashboard-error">
                        {error}
                    </div>

                )}


                <div className="dashboard-cards">

                    <div className="dashboard-card">

                        <div className="card-icon">
                            🧾
                        </div>

                        <h3>
                            Total Sales
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : totalSales}
                        </h2>

                        <p>
                            Sales transactions
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            💰
                        </div>

                        <h3>
                            Total Revenue
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : formatCurrency(totalRevenue)}
                        </h2>

                        <p>
                            Total sales revenue
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            📦
                        </div>

                        <h3>
                            Products Sold
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : productsSold}
                        </h2>

                        <p>
                            Total quantity sold
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            ⚠️
                        </div>

                        <h3>
                            Low Stock
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : lowStock}
                        </h2>

                        <p>
                            Products with stock ≤ 5
                        </p>

                    </div>

                </div>


                <div className="dashboard-section">

                    <h2>
                        Sales Overview
                    </h2>

                    <div className="overview-box">

                        <div>

                            <span>
                                Sales Records
                            </span>

                            <strong>
                                {totalSales}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Total Revenue
                            </span>

                            <strong>
                                {formatCurrency(totalRevenue)}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Products Sold
                            </span>

                            <strong>
                                {productsSold}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        );

    };


    // =====================================================
    // PRODUCTS PAGE
    // =====================================================

    const ProductsPage = () => {

        return (

            <div className="manager-content">

                <div className="page-header">

                    <div>

                        <h1>
                            Products
                        </h1>

                        <p>
                            View and manage business products.
                        </p>

                    </div>

                </div>


                <div className="dashboard-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Product Management
                            </h2>

                            <p>
                                Available products in the system.
                            </p>

                        </div>


                        <button
                            className="primary-btn"
                            onClick={openAddProduct}
                        >
                            + Add Product
                        </button>

                    </div>


                    <div className="table-container">

                        <table className="manager-table">

                            <thead>

                                <tr>

                                    <th>Product</th>

                                    <th>Category</th>

                                    <th>Price</th>

                                    <th>Stock</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {products.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="empty-row"
                                        >
                                            No products found.
                                        </td>

                                    </tr>

                                ) : (

                                    products.map((product) => (

                                        <tr key={product.id}>

                                            <td>
                                                {product.name}
                                            </td>

                                            <td>
                                                {product.category}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    Number(product.price)
                                                )}
                                            </td>

                                            <td>
                                                {product.stock}
                                            </td>

                                            <td>

                                                <button
                                                    className="view-btn"
                                                    onClick={() =>
                                                        handleViewProduct(product)
                                                    }
                                                >
                                                    View
                                                </button>


                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        openEditProduct(product)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        );

    };


    // =====================================================
    // EMPLOYEE REPORTS PAGE
    // =====================================================

    const EmployeeReportsPage = () => {

        return (

            <div className="manager-content">

                <div className="page-header">

                    <div>

                        <h1>
                            Employee Reports
                        </h1>

                        <p>
                            Monitor employee sales and performance.
                        </p>

                    </div>


                    <button
                        className="primary-btn"
                        onClick={fetchDashboardData}
                    >
                        🔄 Refresh
                    </button>

                </div>


                <div className="dashboard-cards">


                    <div className="dashboard-card">

                        <div className="card-icon">
                            👥
                        </div>

                        <h3>
                            Active Employees
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : employeeReports.length}
                        </h2>

                        <p>
                            Employees with sales
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            🧾
                        </div>

                        <h3>
                            Total Sales
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : totalSales}
                        </h2>

                        <p>
                            All employee transactions
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            📦
                        </div>

                        <h3>
                            Products Sold
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : productsSold}
                        </h2>

                        <p>
                            Total quantity sold
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-icon">
                            💰
                        </div>

                        <h3>
                            Total Revenue
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : formatCurrency(totalRevenue)}
                        </h2>

                        <p>
                            Revenue generated
                        </p>

                    </div>

                </div>


                <div className="dashboard-section">

                    <h2>
                        Employee Performance
                    </h2>

                    <p>
                        Individual employee sales report.
                    </p>


                    <div className="table-container">

                        <table className="manager-table">

                            <thead>

                                <tr>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Total Sales
                                    </th>

                                    <th>
                                        Products Sold
                                    </th>

                                    <th>
                                        Total Revenue
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="empty-row"
                                        >
                                            Loading employee reports...
                                        </td>

                                    </tr>

                                ) : employeeReports.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="empty-row"
                                        >
                                            No employee sales found.
                                        </td>

                                    </tr>

                                ) : (

                                    employeeReports.map(
                                        (employee, index) => (

                                            <tr
                                                key={index}
                                            >

                                                <td>

                                                    👤 {" "}

                                                    <strong>
                                                        {employee.name}
                                                    </strong>

                                                </td>


                                                <td>
                                                    {employee.totalSales}
                                                </td>


                                                <td>
                                                    {employee.productsSold}
                                                </td>


                                                <td>
                                                    {formatCurrency(
                                                        employee.totalRevenue
                                                    )}
                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                <div className="dashboard-section">

                    <h2>
                        All Employee Sales
                    </h2>

                    <p>
                        Complete sales transaction history.
                    </p>


                    <div className="table-container">

                        <table className="manager-table">

                            <thead>

                                <tr>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Quantity
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {sales.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="empty-row"
                                        >
                                            No sales found.
                                        </td>

                                    </tr>

                                ) : (

                                    sales.map((sale) => (

                                        <tr
                                            key={sale.id}
                                        >

                                            <td>
                                                {sale.sold_by_name || "-"}
                                            </td>


                                            <td>
                                                {sale.customer_name || "-"}
                                            </td>


                                            <td>
                                                {sale.product_name || "-"}
                                            </td>


                                            <td>
                                                {sale.quantity || 0}
                                            </td>


                                            <td>
                                                {formatCurrency(
                                                    Number(
                                                        sale.total_amount || 0
                                                    )
                                                )}
                                            </td>


                                            <td>

                                                {sale.sale_date

                                                    ? new Date(
                                                        sale.sale_date
                                                    ).toLocaleString()

                                                    : "-"

                                                }

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        );

    };


    // =====================================================
    // SETTINGS PAGE
    // =====================================================

    const SettingsPage = () => {

        return (

            <div className="manager-settings">

                <div className="settings-header">

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your manager account settings.
                    </p>

                </div>


                <div className="settings-card">

                    <h2>
                        Account
                    </h2>

                    <p>
                        Role: <strong>Manager</strong>
                    </p>


                    <button
                        className="logout-btn"
                        onClick={onLogout}
                    >
                        Logout
                    </button>

                </div>


                <div className="settings-card">

                    <h2>
                        Change Password
                    </h2>


                    {passwordMessage && (

                        <div className="success-message">

                            {passwordMessage}

                        </div>

                    )}


                    {passwordError && (

                        <div className="error-message">

                            {passwordError}

                        </div>

                    )}


                    <form
                        onSubmit={handlePasswordChange}
                        className="password-form"
                    >

                        <div className="form-group">

                            <label>
                                Current Password
                            </label>

                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                minLength="8"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                minLength="8"
                            />

                        </div>


                        <button
                            type="submit"
                            className="change-password-btn"
                            disabled={passwordLoading}
                        >

                            {passwordLoading
                                ? "Changing..."
                                : "Change Password"}

                        </button>

                    </form>

                </div>

            </div>

        );

    };


    // =====================================================
    // PAGE RENDER
    // =====================================================

    const renderPage = () => {

        if (activePage === "dashboard") {

            return <DashboardPage />;

        }

        if (activePage === "products") {

            return <ProductsPage />;

        }

        if (activePage === "reports") {

            return <EmployeeReportsPage />;

        }

        if (activePage === "settings") {

            return <SettingsPage />;

        }

        return <DashboardPage />;

    };


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="manager-layout">


            {/* SIDEBAR */}

            <aside className="manager-sidebar">

                <div className="sidebar-logo">

                    <div className="logo-circle">
                        AI
                    </div>

                    <h2>
                        AI Business
                    </h2>

                </div>


                <nav className="manager-nav">


                    <button
                        className={
                            activePage === "dashboard"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage("dashboard")
                        }
                    >
                        📊 Dashboard
                    </button>


                    <button
                        className={
                            activePage === "products"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage("products")
                        }
                    >
                        📦 Products
                    </button>


                    <button
                        className={
                            activePage === "reports"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage("reports")
                        }
                    >
                        👥 Employee Reports
                    </button>


                    <button
                        className={
                            activePage === "settings"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage("settings")
                        }
                    >
                        ⚙️ Settings
                    </button>


                    <button
                        className="nav-item logout-nav"
                        onClick={onLogout}
                    >
                        🚪 Logout
                    </button>

                </nav>

            </aside>


            {/* MAIN CONTENT */}

            <main className="manager-main">

                {renderPage()}

            </main>


            {/* ADD / EDIT PRODUCT MODAL */}

            {showProductModal && (

                <div
                    className="modal-overlay"
                    onClick={closeProductModal}
                >

                    <div
                        className="product-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h2>

                                {editingProduct
                                    ? "Edit Product"
                                    : "Add Product"}

                            </h2>


                            <button
                                className="modal-close"
                                onClick={closeProductModal}
                            >
                                ×
                            </button>

                        </div>


                        {productError && (

                            <div className="error-message">

                                {productError}

                            </div>

                        )}


                        <form
                            onSubmit={handleProductSubmit}
                        >

                            <div className="form-group">

                                <label>
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) =>
                                        setProductName(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    value={productCategory}
                                    onChange={(e) =>
                                        setProductCategory(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="ELECTRONICS">
                                        Electronics
                                    </option>

                                    <option value="CLOTHING">
                                        Clothing
                                    </option>

                                    <option value="GROCERY">
                                        Grocery
                                    </option>

                                    <option value="FURNITURE">
                                        Furniture
                                    </option>

                                    <option value="OTHERS">
                                        Others
                                    </option>

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Price
                                </label>

                                <input
                                    type="number"
                                    value={productPrice}
                                    onChange={(e) =>
                                        setProductPrice(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    value={productStock}
                                    onChange={(e) =>
                                        setProductStock(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeProductModal}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={productLoading}
                                >

                                    {productLoading
                                        ? "Saving..."
                                        : editingProduct
                                            ? "Update Product"
                                            : "Add Product"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* VIEW PRODUCT MODAL */}

            {showViewModal &&
                selectedProduct && (

                    <div
                        className="modal-overlay"
                        onClick={closeViewModal}
                    >

                        <div
                            className="product-modal view-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="modal-header">

                                <h2>
                                    Product Details
                                </h2>


                                <button
                                    className="modal-close"
                                    onClick={closeViewModal}
                                >
                                    ×
                                </button>

                            </div>


                            <div className="product-details">

                                <div>

                                    <span>
                                        Product Name
                                    </span>

                                    <strong>
                                        {selectedProduct.name}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Category
                                    </span>

                                    <strong>
                                        {selectedProduct.category}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Price
                                    </span>

                                    <strong>

                                        {formatCurrency(
                                            Number(
                                                selectedProduct.price
                                            )
                                        )}

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Stock
                                    </span>

                                    <strong>
                                        {selectedProduct.stock}
                                    </strong>

                                </div>

                            </div>


                            <div className="modal-actions">

                                <button
                                    className="cancel-btn"
                                    onClick={closeViewModal}
                                >
                                    Close
                                </button>


                                <button
                                    className="primary-btn"
                                    onClick={() => {

                                        closeViewModal();

                                        openEditProduct(
                                            selectedProduct
                                        );

                                    }}
                                >
                                    Edit Product
                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>

    );

}

export default ManagerDashboard;