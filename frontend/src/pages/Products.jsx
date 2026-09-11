import { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";
import { API_BASE_URL } from "../api";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "ELECTRONICS",
        price: "",
        stock: "",
    });

    const [editingId, setEditingId] = useState(null);

    // =========================
    // FETCH PRODUCTS
    // =========================
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("access");

            console.log("PRODUCT ACCESS TOKEN:", token);

            const response = await axios.get(
                `${API_BASE_URL}/api/products/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("PRODUCTS RESPONSE:", response.data);

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setProducts(data);
        } catch (error) {
            console.error("PRODUCTS FETCH ERROR:", error);
            console.error("STATUS:", error.response?.status);
            console.error(
                "BACKEND ERROR:",
                JSON.stringify(error.response?.data, null, 2)
            );

            setError("Unable to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // ADD PRODUCT
    // =========================
    const handleAddProduct = () => {
        setEditingId(null);

        setFormData({
            name: "",
            category: "ELECTRONICS",
            price: "",
            stock: "",
        });

        setShowForm(true);
    };

    // =========================
    // EDIT PRODUCT
    // =========================
    const handleEdit = (product) => {
        console.log("EDIT PRODUCT:", product);

        setEditingId(product.id);

        setFormData({
            name: product.name,
            category: String(product.category).toUpperCase(),
            price: product.price,
            stock: product.stock,
        });

        setShowForm(true);
    };

    // =========================
    // ADD / UPDATE PRODUCT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("access");

            const data = {
                name: formData.name,
                category: formData.category.toUpperCase(),
                price: Number(formData.price),
                stock: Number(formData.stock),
            };

            console.log("PRODUCT SAVE DATA:", data);

            if (editingId) {
                // =========================
                // UPDATE
                // =========================
                const response = await axios.patch(
                    `${API_BASE_URL}/api/products/${editingId}/`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log(
                    "PRODUCT UPDATE RESPONSE:",
                    response.data
                );

                alert("Product updated successfully");
            } else {
                // =========================
                // ADD
                // =========================
                const response = await axios.post(
                    `${API_BASE_URL}/api/products/`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log(
                    "PRODUCT ADD RESPONSE:",
                    response.data
                );

                alert("Product added successfully");
            }

            setShowForm(false);
            setEditingId(null);

            setFormData({
                name: "",
                category: "ELECTRONICS",
                price: "",
                stock: "",
            });

            await fetchProducts();

        } catch (error) {
            console.error("PRODUCT SAVE ERROR:", error);
            console.error("STATUS:", error.response?.status);

            console.error(
                "BACKEND ERROR:",
                JSON.stringify(error.response?.data, null, 2)
            );

            alert(
                JSON.stringify(
                    error.response?.data || "Unable to save product",
                    null,
                    2
                )
            );
        }
    };

    // =========================
    // DELETE PRODUCT
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("access");

            await axios.delete(
                `${API_BASE_URL}/api/products/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Product deleted successfully");

            setProducts((previousProducts) =>
                previousProducts.filter(
                    (product) => product.id !== id
                )
            );

        } catch (error) {
            console.error("DELETE PRODUCT ERROR:", error);
            console.error("STATUS:", error.response?.status);

            console.error(
                "BACKEND ERROR:",
                JSON.stringify(error.response?.data, null, 2)
            );

            alert(
                JSON.stringify(
                    error.response?.data || "Unable to delete product",
                    null,
                    2
                )
            );
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="products-page">
                <h2>Loading products...</h2>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================
    if (error) {
        return (
            <div className="products-page">
                <h2>{error}</h2>
            </div>
        );
    }

    // =========================
    // UI
    // =========================
    return (
        <div className="products-page">

            <h1>Products Management</h1>

            <p>Manage your business products</p>

            <button onClick={handleAddProduct}>
                + Add Product
            </button>

            {/* =========================
                ADD / EDIT FORM
            ========================= */}

            {showForm && (
                <form onSubmit={handleSubmit}>

                    <h2>
                        {editingId
                            ? "Edit Product"
                            : "Add Product"}
                    </h2>

                    <div>
                        <label>Product Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div>
                        <label>Category</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
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

                    <div>
                        <label>Price</label>

                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label>Stock</label>

                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="Enter stock"
                            min="0"
                            required
                        />
                    </div>

                    <button type="submit">
                        {editingId
                            ? "Update Product"
                            : "Save Product"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingId(null);
                        }}
                    >
                        Cancel
                    </button>

                </form>
            )}

            {/* =========================
                PRODUCTS TABLE
            ========================= */}

            <table>

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {products.length === 0 ? (

                        <tr>
                            <td colSpan="7">
                                No products found
                            </td>
                        </tr>

                    ) : (

                        products.map((product) => (

                            <tr key={product.id}>

                                <td>
                                    {product.id}
                                </td>

                                <td>
                                    {product.name}
                                </td>

                                <td>
                                    {product.category}
                                </td>

                                <td>
                                    ₹
                                    {Number(
                                        product.price
                                    ).toLocaleString("en-IN")}
                                </td>

                                <td>
                                    {product.stock}
                                </td>

                                <td>
                                    {product.created_at
                                        ? new Date(
                                            product.created_at
                                        ).toLocaleDateString("en-IN")
                                        : "-"
                                    }
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            handleEdit(product)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(product.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default Products;