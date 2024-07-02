import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const navigate = useNavigate();
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        description: "",
    });
    const token = localStorage.getItem("token");

    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const addProduct = async () => {
        try {
            const { data } = await axios.post("/api/products", newProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire("Success", "Product added successfully", "success").then(
                () => {
                    navigate("/dashboard");
                }
            );
        } catch (error) {
            console.error("Error adding product:", error);
            Swal.fire("Error", "Failed to add product", "error");
        }
    };

    return (
        <div className="container mt-5">
            <h4 className="mb-4">Add New Product</h4>
            <form>
                <div className="form-group mb-3">
                    <label htmlFor="productName" className="form-label">
                        Product Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="productName"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="productPrice" className="form-label">
                        Product Price
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="productPrice"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        placeholder="Enter product price"
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="productDescription" className="form-label">
                        Product Description
                    </label>
                    <textarea
                        className="form-control"
                        id="productDescription"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        placeholder="Enter product description"
                        rows="3"
                    ></textarea>
                </div>
                <button
                    type="button"
                    className="btn btn-success me-2"
                    onClick={addProduct}
                >
                    Add Product
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/dashboard")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
