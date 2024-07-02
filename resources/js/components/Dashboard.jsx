import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState("");
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await axios.get("/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserDetails(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Swal.fire({
                        icon: "error",
                        title: "Authentication Failed",
                        text: "Please log in again.",
                    }).then(() => {
                        navigate("/");
                    });
                } else {
                    console.error("Error fetching user details:", error);
                }
            }
        };
        const fetchProducts = async () => {
            const { data } = await axios.get("/api/products", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(data.data);
        };

        fetchUserDetails();
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(products.filter((product) => product.id !== id));
            Swal.fire("Success", "Product deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting product:", error);
            Swal.fire("Error", "Failed to delete product", "error");
        }
    };
    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h3>Welcome To Dashboard</h3>
                    {userDetails && (
                        <div>
                            <p>Name: {userDetails.name}</p>
                            <p>Email: {userDetails.email}</p>
                        </div>
                    )}

                    <h4 className="mt-4">Product List</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.description}</td>
                                    <td>
                                        <Link
                                            to={`/edit-product/${product.id}`}
                                            className="btn btn-warning mr-2"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                deleteProduct(product.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Link to="/add-product" className="btn btn-success">
                        Add Product
                    </Link>

                    <button
                        className="btn btn-primary m-4"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
