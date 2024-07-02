import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [editingData, setEditingData] = useState({
        name: "",
        price: "",
        description: "",
    });
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEditingData(data.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id, token]);

    const handleEditInputChange = (e) => {
        setEditingData({ ...editingData, [e.target.name]: e.target.value });
    };

    const updateProduct = async () => {
        try {
            await axios.put(`/api/products/${id}`, editingData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire(
                "Success",
                "Product updated successfully",
                "success"
            ).then(() => {
                navigate("/dashboard");
            });
        } catch (error) {
            console.error("Error updating product:", error);
            Swal.fire("Error", "Failed to update product", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h4>Edit Product</h4>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={editingData.name}
                    onChange={handleEditInputChange}
                    placeholder="Edit product name"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    name="price"
                    value={editingData.price}
                    onChange={handleEditInputChange}
                    placeholder="Edit product price"
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={editingData.description}
                    onChange={handleEditInputChange}
                    placeholder="Edit product description"
                />
            </div>
            <button className="btn btn-primary" onClick={updateProduct}>
                Save
            </button>
            <button
                className="btn btn-secondary ml-2"
                onClick={() => navigate("/dashboard")}
            >
                Cancel
            </button>
        </div>
    );
};

export default EditProduct;
