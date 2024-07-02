import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
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
                        navigate("/login");
                    });
                } else {
                    console.error("Error fetching user details:", error);
                }
            }
        };

        const fetchProducts = async () => {
            try {
                const { data } = await axios.get("/api/products", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(data.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchUserDetails();
        fetchProducts();
    }, [navigate, token]);

    const deleteProduct = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                await axios.delete(`/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(products.filter((product) => product.id !== id));
                Swal.fire("Deleted!", "Product has been deleted.", "success");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            Swal.fire("Error", "Failed to delete product", "error");
        }
    };

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="#">
                        Dashboard
                    </Link>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <h3 className="text-center">Welcome To Dashboard</h3>
                        {userDetails && (
                            <div className="mb-4">
                                <p>
                                    <strong>Name:</strong> {userDetails.name}
                                </p>
                                <p>
                                    <strong>Email:</strong> {userDetails.email}
                                </p>
                            </div>
                        )}

                        <h4 className="mt-4">Product List</h4>
                        {products.length > 0 ? (
                            <table className="table table-striped table-bordered mt-3">
                                <thead className="thead-dark">
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
                                            <td>${product.price}</td>
                                            <td>{product.description}</td>
                                            <td>
                                                <Link
                                                    to={`/edit-product/${product.id}`}
                                                    className="btn btn-warning btn-sm m-1"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        deleteProduct(
                                                            product.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="alert alert-info mt-3">
                                No products found. Please add some products.
                            </div>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            <Link to="/add-product" className="btn btn-success">
                                Add Product
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
