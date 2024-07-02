import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

// Validation schema
const validationSchema = yup.object({
    name: yup.string().required("Product name is required"),
    price: yup
        .number()
        .required("Product price is required")
        .positive("Price must be positive"),
    description: yup.string().required("Product description is required"),
});

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [initialValues, setInitialValues] = useState({
        name: "",
        price: "",
        description: "",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setInitialValues(data.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id, token]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                await axios.put(`/api/products/${id}`, values, {
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
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.errors
                ) {
                    const apiErrors = error.response.data.errors;
                    const formattedErrors = Object.keys(apiErrors).reduce(
                        (acc, key) => {
                            acc[key] = apiErrors[key][0];
                            return acc;
                        },
                        {}
                    );
                    setErrors(formattedErrors);
                } else {
                    Swal.fire("Error", "Failed to update product", "error");
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h4 className="mb-4 text-center">Edit Product</h4>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="name">Product Name</label>
                            <input
                                type="text"
                                className={`form-control ${
                                    formik.touched.name && formik.errors.name
                                        ? "is-invalid"
                                        : ""
                                }`}
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Edit product name"
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="invalid-feedback">
                                    {formik.errors.name}
                                </div>
                            ) : null}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="price">Product Price</label>
                            <input
                                type="text"
                                className={`form-control ${
                                    formik.touched.price && formik.errors.price
                                        ? "is-invalid"
                                        : ""
                                }`}
                                id="price"
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Edit product price"
                            />
                            {formik.touched.price && formik.errors.price ? (
                                <div className="invalid-feedback">
                                    {formik.errors.price}
                                </div>
                            ) : null}
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="description">
                                Product Description
                            </label>
                            <textarea
                                className={`form-control ${
                                    formik.touched.description &&
                                    formik.errors.description
                                        ? "is-invalid"
                                        : ""
                                }`}
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Edit product description"
                                rows="3"
                            ></textarea>
                            {formik.touched.description &&
                            formik.errors.description ? (
                                <div className="invalid-feedback">
                                    {formik.errors.description}
                                </div>
                            ) : null}
                        </div>
                        <div className="d-flex justify-content-between">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={formik.isSubmitting}
                            >
                                Save
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

export default EditProduct;
