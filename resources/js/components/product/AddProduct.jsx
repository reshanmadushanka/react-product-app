import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Validation schema
const validationSchema = yup.object({
    name: yup.string().required("Product name is required"),
    price: yup
        .number()
        .required("Product price is required")
        .positive("Price must be positive"),
    description: yup.string().required("Product description is required"),
});

const AddProduct = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const formik = useFormik({
        initialValues: {
            name: "",
            price: "",
            description: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                const { data } = await axios.post("/api/products", values, {
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
                if (error.response && error.response.data && error.response.data.errors) {
                    const apiErrors = error.response.data.errors;
                    const formattedErrors = Object.keys(apiErrors).reduce((acc, key) => {
                        acc[key] = apiErrors[key][0];
                        return acc;
                    }, {});
                    setErrors(formattedErrors);
                } else {
                    Swal.fire("Error", "Failed to add product", "error");
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h4 className="mb-4 text-center">Add New Product</h4>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="productName" className="form-label">
                                Product Name
                            </label>
                            <input
                                type="text"
                                className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                id="productName"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter product name"
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="invalid-feedback">{formik.errors.name}</div>
                            ) : null}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="productPrice" className="form-label">
                                Product Price
                            </label>
                            <input
                                type="text"
                                className={`form-control ${formik.touched.price && formik.errors.price ? 'is-invalid' : ''}`}
                                id="productPrice"
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter product price"
                            />
                            {formik.touched.price && formik.errors.price ? (
                                <div className="invalid-feedback">{formik.errors.price}</div>
                            ) : null}
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="productDescription" className="form-label">
                                Product Description
                            </label>
                            <textarea
                                className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                                id="productDescription"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter product description"
                                rows="3"
                            ></textarea>
                            {formik.touched.description && formik.errors.description ? (
                                <div className="invalid-feedback">{formik.errors.description}</div>
                            ) : null}
                        </div>
                        <div className="d-flex justify-content-between">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={formik.isSubmitting}
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
