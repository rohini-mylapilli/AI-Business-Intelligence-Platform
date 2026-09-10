import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./EmployeeDashboard.css";

function EmployeeDashboard({ onLogout }) {

    // =====================================================
    // STATE
    // =====================================================

    const [activePage, setActivePage] =
        useState("dashboard");

    const [products, setProducts] =
        useState([]);

    const [sales, setSales] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");



    // =====================================================
    // BILLING STATE
    // =====================================================

    const [selectedProduct, setSelectedProduct] =
        useState("");

    const [quantity, setQuantity] =
        useState(1);

    const [customerName, setCustomerName] =
        useState("");

    const [customerPhone, setCustomerPhone] =
        useState("");

    const [billingLoading, setBillingLoading] =
        useState(false);

    const [billingMessage, setBillingMessage] =
        useState("");

    const [billingError, setBillingError] =
        useState("");



    // =====================================================
    // BILLING REFS
    // =====================================================

    const customerNameRef =
        useRef(null);

    const customerPhoneRef =
        useRef(null);

    const productRef =
        useRef(null);

    const quantityRef =
        useRef(null);



    // =====================================================
    // HANDLE ENTER KEY
    // =====================================================

    const handleBillingEnter = (
        e,
        nextRef
    ) => {

        if (e.key === "Enter") {

            e.preventDefault();

            nextRef.current?.focus();

        }

    };



    // =====================================================
    // GET AUTH CONFIG
    // =====================================================

    const getConfig = () => {

        const token =
            localStorage.getItem("access");

        console.log(
            "ACCESS TOKEN:",
            token
        );

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

    };



    // =====================================================
    // FETCH PRODUCTS
    // =====================================================

    const fetchProducts = async () => {

        try {

            const response =
                await axios.get(
                    "http://127.0.0.1:8000/api/products/",
                    getConfig()
                );

            console.log(
                "PRODUCTS RESPONSE:",
                response.data
            );

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

            setProducts(data);

        } catch (err) {

            console.error(
                "PRODUCT ERROR:",
                err.response?.data || err
            );

            if (
                err.response?.status === 401
            ) {

                setError(
                    "Authentication token expired. Please login again."
                );

            }

        }

    };



    // =====================================================
    // FETCH SALES
    // =====================================================

    const fetchSales = async () => {

        try {

            const response =
                await axios.get(
                    "http://127.0.0.1:8000/api/sales/",
                    getConfig()
                );

            console.log(
                "SALES RESPONSE:",
                response.data
            );

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

            setSales(data);

        } catch (err) {

            console.error(
                "SALES ERROR:",
                err.response?.data || err
            );

            if (
                err.response?.status === 401
            ) {

                setError(
                    "Authentication token expired. Please login again."
                );

            }

            else if (
                err.response?.status === 403
            ) {

                setError(
                    "You do not have permission to view sales."
                );

            }

        }

    };



    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);

            setError("");

            await Promise.all([
                fetchProducts(),
                fetchSales()
            ]);

        } finally {

            setLoading(false);

        }

    };



    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);



    // =====================================================
    // DASHBOARD VALUES
    // =====================================================

    const totalSales =
        sales.length;

    const productsSold =
        sales.reduce(
            (total, sale) => {

                return (
                    total +
                    Number(
                        sale.quantity || 0
                    )
                );

            },
            0
        );

    const totalRevenue =
        sales.reduce(
            (total, sale) => {

                return (
                    total +
                    Number(
                        sale.total_amount || 0
                    )
                );

            },
            0
        );



    // =====================================================
    // CURRENCY FORMAT
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
    // GET SELECTED PRODUCT
    // =====================================================

    const selectedProductData =
        products.find(
            (product) =>

                String(product.id) ===
                String(selectedProduct)
        );



    // =====================================================
    // BILL TOTAL
    // =====================================================

    const billTotal =
        selectedProductData
            ? (
                Number(
                    selectedProductData.price
                ) *
                Number(
                    quantity || 0
                )
            )
            : 0;



    // =====================================================
    // CREATE BILL
    // =====================================================

    const handleCreateBill = async (e) => {

        e.preventDefault();

        setBillingMessage("");

        setBillingError("");



        // =================================================
        // CUSTOMER NAME VALIDATION
        // =================================================

        if (!customerName.trim()) {

            setBillingError(
                "Please enter customer name."
            );

            customerNameRef.current?.focus();

            return;

        }



        // =================================================
        // CUSTOMER PHONE VALIDATION
        // =================================================

        if (!customerPhone.trim()) {

            setBillingError(
                "Please enter customer phone number."
            );

            customerPhoneRef.current?.focus();

            return;

        }



        // =================================================
        // PRODUCT VALIDATION
        // =================================================

        if (!selectedProduct) {

            setBillingError(
                "Please select a product."
            );

            productRef.current?.focus();

            return;

        }



        // =================================================
        // QUANTITY VALIDATION
        // =================================================

        if (
            !quantity ||
            Number(quantity) <= 0
        ) {

            setBillingError(
                "Please enter a valid quantity."
            );

            quantityRef.current?.focus();

            return;

        }



        // =================================================
        // STOCK VALIDATION
        // =================================================

        if (
            selectedProductData &&
            Number(quantity) >
            Number(
                selectedProductData.stock
            )
        ) {

            setBillingError(
                `Only ${selectedProductData.stock} items are available.`
            );

            quantityRef.current?.focus();

            return;

        }



        try {

            setBillingLoading(true);



            // =============================================
            // GET LOGGED-IN USER
            // =============================================

            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {

                throw new Error(
                    "User information not found. Please login again."
                );

            }

            const user =
                JSON.parse(savedUser);

            console.log(
                "LOGGED-IN USER:",
                user
            );



            // =============================================
            // GET USER ID
            // =============================================

            const userId =
                user.id ||
                user.user_id;

            if (!userId) {

                throw new Error(
                    "User ID not found. Please login again."
                );

            }



            // =============================================
            // COMPLETE SALE PAYLOAD
            // =============================================

            const salePayload = {

                product:
                    Number(
                        selectedProduct
                    ),

                quantity:
                    Number(
                        quantity
                    ),

                customer_name:
                    customerName.trim(),

                customer_phone:
                    customerPhone.trim(),

                total_amount:
                    Number(
                        billTotal
                    ),

                sold_by:
                    Number(
                        userId
                    ),

                sale_date:
                    new Date().toISOString()

            };

            console.log(
                "SALE PAYLOAD:",
                salePayload
            );



            // =============================================
            // CREATE SALE
            // =============================================

            const response =
                await axios.post(

                    "http://127.0.0.1:8000/api/sales/",

                    salePayload,

                    getConfig()

                );

            console.log(
                "BILL CREATED:",
                response.data
            );



            // =============================================
            // SUCCESS MESSAGE
            // =============================================

            setBillingMessage(
                "Bill created successfully."
            );



            // =============================================
            // RESET FORM
            // =============================================

            setCustomerName("");

            setCustomerPhone("");

            setSelectedProduct("");

            setQuantity(1);



            // =============================================
            // REFRESH DATA
            // =============================================

            await loadData();



            // =============================================
            // FOCUS FIRST FIELD AGAIN
            // =============================================

            setTimeout(() => {

                customerNameRef.current?.focus();

            }, 100);



        } catch (err) {

            console.error(
                "BILLING ERROR:",
                err.response?.data || err
            );

            if (!err.response) {

                setBillingError(
                    err.message ||
                    "Unable to connect to backend."
                );

                return;

            }

            const backendError =
                err.response.data;

            console.log(
                "BACKEND ERROR:",
                backendError
            );

            const errorMessages =
                Object.entries(
                    backendError
                )
                    .map(
                        ([field, messages]) => {

                            const message =
                                Array.isArray(messages)
                                    ? messages.join(", ")
                                    : messages;

                            return `${field}: ${message}`;

                        }
                    )
                    .join(" | ");

            if (errorMessages) {

                setBillingError(
                    `Billing Error: ${errorMessages}`
                );

            }

            else if (
                backendError.detail
            ) {

                setBillingError(
                    backendError.detail
                );

            }

            else {

                setBillingError(
                    "Unable to create bill."
                );

            }

        } finally {

            setBillingLoading(false);

        }

    };



    // =====================================================
    // DASHBOARD PAGE
    // =====================================================

    const DashboardPage = () => {

        return (

            <div className="employee-content">

                <div className="employee-header">

                    <div>

                        <h1>
                            Employee Dashboard
                        </h1>

                        <p>
                            Manage sales, billing and daily activities.
                        </p>

                    </div>



                    <div className="employee-user">

                        <span>
                            👤
                        </span>

                        <strong>
                            Employee
                        </strong>

                        <button
                            onClick={onLogout}
                            className="employee-logout-btn"
                        >
                            Logout
                        </button>

                    </div>

                </div>



                {error && (

                    <div className="employee-error">

                        {error}

                    </div>

                )}



                <div className="employee-cards">



                    <div className="employee-card">

                        <div className="employee-card-icon">
                            🧾
                        </div>

                        <h3>
                            My Sales
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : totalSales
                            }
                        </h2>

                        <p>
                            Sales transactions
                        </p>

                    </div>



                    <div className="employee-card">

                        <div className="employee-card-icon">
                            📦
                        </div>

                        <h3>
                            Products Sold
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : productsSold
                            }
                        </h2>

                        <p>
                            Total quantity sold
                        </p>

                    </div>



                    <div className="employee-card">

                        <div className="employee-card-icon">
                            💰
                        </div>

                        <h3>
                            My Revenue
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : formatCurrency(
                                    totalRevenue
                                )
                            }
                        </h2>

                        <p>
                            Total sales revenue
                        </p>

                    </div>



                    <div className="employee-card">

                        <div className="employee-card-icon">
                            🛍️
                        </div>

                        <h3>
                            Products
                        </h3>

                        <h2>
                            {loading
                                ? "..."
                                : products.length
                            }
                        </h2>

                        <p>
                            Available products
                        </p>

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

            <div className="employee-content">

                <div className="employee-header">

                    <div>

                        <h1>
                            Products
                        </h1>

                        <p>
                            View available products and stock.
                        </p>

                    </div>

                </div>



                <div className="employee-section">

                    <h2>
                        Available Products
                    </h2>



                    <div className="employee-table-container">

                        <table className="employee-table">

                            <thead>

                                <tr>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Stock
                                    </th>

                                </tr>

                            </thead>



                            <tbody>

                                {products.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="empty-row"
                                        >
                                            No products found.
                                        </td>

                                    </tr>

                                ) : (

                                    products.map(
                                        (product) => (

                                            <tr
                                                key={product.id}
                                            >

                                                <td>
                                                    {product.name}
                                                </td>

                                                <td>
                                                    {product.category}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        Number(
                                                            product.price
                                                        )
                                                    )}
                                                </td>

                                                <td>
                                                    {product.stock}
                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        );

    };



    // =====================================================
    // SALES PAGE
    // =====================================================

    const SalesPage = () => {

        return (

            <div className="employee-content">

                <div className="employee-header">

                    <div>

                        <h1>
                            My Sales
                        </h1>

                        <p>
                            View your completed sales transactions.
                        </p>

                    </div>

                </div>



                <div className="employee-section">

                    <h2>
                        Sales History
                    </h2>



                    <div className="employee-table-container">

                        <table className="employee-table">

                            <thead>

                                <tr>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Quantity
                                    </th>

                                    <th>
                                        Total
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

                                    sales.map(
                                        (sale) => (

                                            <tr
                                                key={sale.id}
                                            >

                                                <td>
                                                    {sale.customer_name || "-"}
                                                </td>

                                                <td>
                                                    {sale.customer_phone || "-"}
                                                </td>

                                                <td>
                                                    {sale.product_name || "-"}
                                                </td>

                                                <td>
                                                    {sale.quantity}
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

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        );

    };



    // =====================================================
    // BILLING PAGE
    // =====================================================

    const BillingPage = () => {

        return (

            <div className="employee-content">

                <div className="employee-header">

                    <div>

                        <h1>
                            Billing
                        </h1>

                        <p>
                            Create a bill for a customer.
                        </p>

                    </div>

                </div>



                <div className="employee-section">

                    <h2>
                        Create Customer Bill
                    </h2>



                    {billingMessage && (

                        <div className="employee-success">

                            {billingMessage}

                        </div>

                    )}



                    {billingError && (

                        <div className="employee-error">

                            <strong>
                                Billing Error:
                            </strong>

                            <br />

                            {billingError}

                        </div>

                    )}



                    <form
                        className="billing-form"
                        onSubmit={
                            handleCreateBill
                        }
                    >



                        {/* CUSTOMER NAME */}

                        <div className="billing-form-group">

                            <label>
                                Customer Name
                            </label>

                            <input
                                ref={
                                    customerNameRef
                                }
                                type="text"
                                value={
                                    customerName
                                }
                                onChange={(e) =>
                                    setCustomerName(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) =>
                                    handleBillingEnter(
                                        e,
                                        customerPhoneRef
                                    )
                                }
                                placeholder="Enter customer name"
                                disabled={
                                    billingLoading
                                }
                            />

                        </div>



                        {/* CUSTOMER PHONE */}

                        <div className="billing-form-group">

                            <label>
                                Customer Phone
                            </label>

                            <input
                                ref={
                                    customerPhoneRef
                                }
                                type="text"
                                value={
                                    customerPhone
                                }
                                onChange={(e) =>
                                    setCustomerPhone(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) =>
                                    handleBillingEnter(
                                        e,
                                        productRef
                                    )
                                }
                                placeholder="Enter customer phone number"
                                disabled={
                                    billingLoading
                                }
                            />

                        </div>



                        {/* PRODUCT */}

                        <div className="billing-form-group">

                            <label>
                                Select Product
                            </label>

                            <select
                                ref={
                                    productRef
                                }
                                value={
                                    selectedProduct
                                }
                                onChange={(e) =>
                                    setSelectedProduct(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) =>
                                    handleBillingEnter(
                                        e,
                                        quantityRef
                                    )
                                }
                                disabled={
                                    billingLoading
                                }
                            >

                                <option value="">
                                    Select a product
                                </option>



                                {products.map(
                                    (product) => (

                                        <option
                                            key={
                                                product.id
                                            }
                                            value={
                                                product.id
                                            }
                                            disabled={
                                                Number(
                                                    product.stock
                                                ) === 0
                                            }
                                        >

                                            {product.name}
                                            {" - ₹"}
                                            {product.price}
                                            {" - Stock: "}
                                            {product.stock}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>



                        {/* PRODUCT INFORMATION */}

                        {selectedProductData && (

                            <div className="billing-product-info">

                                <div>

                                    <span>
                                        Price
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            Number(
                                                selectedProductData.price
                                            )
                                        )}
                                    </strong>

                                </div>



                                <div>

                                    <span>
                                        Available Stock
                                    </span>

                                    <strong>
                                        {selectedProductData.stock}
                                    </strong>

                                </div>

                            </div>

                        )}



                        {/* QUANTITY */}

                        <div className="billing-form-group">

                            <label>
                                Quantity
                            </label>

                            <input
                                ref={
                                    quantityRef
                                }
                                type="number"
                                min="1"
                                max={
                                    selectedProductData
                                        ? selectedProductData.stock
                                        : undefined
                                }
                                value={
                                    quantity
                                }
                                onChange={(e) =>
                                    setQuantity(
                                        e.target.value
                                    )
                                }
                                disabled={
                                    billingLoading
                                }
                            />

                        </div>



                        {/* TOTAL */}

                        <div className="billing-total-box">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                {formatCurrency(
                                    billTotal
                                )}
                            </strong>

                        </div>



                        {/* BUTTONS */}

                        <div className="billing-actions">

                            <button
                                type="button"
                                className="employee-secondary-btn"
                                onClick={() => {

                                    setCustomerName("");

                                    setCustomerPhone("");

                                    setSelectedProduct("");

                                    setQuantity(1);

                                    setBillingMessage("");

                                    setBillingError("");

                                    setTimeout(() => {

                                        customerNameRef.current?.focus();

                                    }, 50);

                                }}
                                disabled={
                                    billingLoading
                                }
                            >
                                Clear
                            </button>



                            <button
                                type="submit"
                                className="employee-primary-btn"
                                disabled={
                                    billingLoading
                                }
                            >

                                {billingLoading
                                    ? "Creating Bill..."
                                    : "Create Bill"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        );

    };



    // =====================================================
    // REPORTS PAGE
    // =====================================================

    const ReportsPage = () => {

        return (

            <div className="employee-content">

                <div className="employee-header">

                    <div>

                        <h1>
                            Reports
                        </h1>

                        <p>
                            View your sales performance.
                        </p>

                    </div>

                </div>



                <div className="employee-section">

                    <h2>
                        My Performance
                    </h2>



                    <div className="employee-report-box">

                        <div>

                            <span>
                                Total Sales
                            </span>

                            <strong>
                                {totalSales}
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



                        <div>

                            <span>
                                Revenue
                            </span>

                            <strong>
                                {formatCurrency(
                                    totalRevenue
                                )}
                            </strong>

                        </div>

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

            <div className="employee-content">

                <div className="employee-header">

                    <div>

                        <h1>
                            Settings
                        </h1>

                        <p>
                            Manage your employee account.
                        </p>

                    </div>

                </div>



                <div className="employee-section">

                    <h2>
                        Account
                    </h2>

                    <p>
                        Role:{" "}

                        <strong>
                            Employee
                        </strong>
                    </p>



                    <button
                        className="employee-logout-btn"
                        onClick={onLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        );

    };



    // =====================================================
    // PAGE RENDER
    // =====================================================

    const renderPage = () => {

        if (
            activePage === "dashboard"
        ) {

            return DashboardPage();

        }

        if (
            activePage === "products"
        ) {

            return ProductsPage();

        }

        if (
            activePage === "sales"
        ) {

            return SalesPage();

        }

        if (
            activePage === "billing"
        ) {

            return BillingPage();

        }

        if (
            activePage === "reports"
        ) {

            return ReportsPage();

        }

        if (
            activePage === "settings"
        ) {

            return SettingsPage();

        }

        return DashboardPage();

    };



    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="employee-layout">



            {/* SIDEBAR */}

            <aside className="employee-sidebar">



                <div className="employee-logo">

                    <div className="employee-logo-circle">
                        AI
                    </div>

                    <h2>
                        AI Business
                    </h2>

                </div>



                <nav className="employee-nav">



                    <button
                        className={
                            activePage === "dashboard"
                                ? "employee-nav-item active"
                                : "employee-nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "dashboard"
                            )
                        }
                    >
                        📊 Dashboard
                    </button>



                    <button
                        className={
                            activePage === "products"
                                ? "employee-nav-item active"
                                : "employee-nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "products"
                            )
                        }
                    >
                        📦 Products
                    </button>



                    <button
                        className={
                            activePage === "sales"
                                ? "employee-nav-item active"
                                : "employee-nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "sales"
                            )
                        }
                    >
                        🛒 Sales
                    </button>



                    <button
                        className={
                            activePage === "billing"
                                ? "employee-nav-item active"
                                : "employee-nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "billing"
                            )
                        }
                    >
                        🧾 Billing
                    </button>



                    <button
                        className={
                            activePage === "reports"
                                ? "employee-nav-item active"
                                : "employee-nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "reports"
                            )
                        }
                    >
                        📈 Reports
                    </button>



                    <button
                        className={
                            activePage === "settings"
                                ? "employee-nav-item active"
                                : "employee-nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "settings"
                            )
                        }
                    >
                        ⚙️ Settings
                    </button>



                    <button
                        className="employee-nav-item employee-logout-nav"
                        onClick={
                            onLogout
                        }
                    >
                        🚪 Logout
                    </button>

                </nav>

            </aside>



            {/* MAIN CONTENT */}

            <main className="employee-main">

                {renderPage()}

            </main>

        </div>

    );

}

export default EmployeeDashboard;