import React from "react";
import axios from "axios";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
    const navigate = useNavigate();
    const [confirmationResult, setConfirmationResult] = React.useState(null);

    const initialValues = {
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Full Name is required"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        phone: Yup.string().required("Phone number is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Password confirmation is required"),
    });

    const handleRegister = async (values, { setSubmitting }) => {
        try {
            console.log(values.phone);
            const phoneNumber = `+94${values.phone}`;

            const recaptchaVerifier = new RecaptchaVerifier(
                "recaptcha-container",
                { size: "normal" },
                auth
            );

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                recaptchaVerifier
            );
            setConfirmationResult(confirmationResult);

            // Handle user input for OTP
            const { value: code } = await Swal.fire({
                title: "Enter OTP",
                input: "text",
                inputLabel: "OTP",
                inputPlaceholder: "Enter OTP sent to your phone",
                inputValidator: (value) => {
                    if (!value) {
                        return "You need to enter the OTP!";
                    }
                },
            });
            if (code) {
                const result = await confirmationResult.confirm(code);
                const idToken = await result.user.getIdToken();

                const verifyResponse = await axios.post(`/api/2fa`, {
                    idToken,
                });
                if (verifyResponse.data.message === "2FA verified") {
                    const response = await axios.post("/api/register", values);
                    const token = response.data.token;
                    localStorage.setItem("token", token);
                    Swal.fire({
                        icon: "success",
                        title: "Registration Successful",
                        text: "Welcome!",
                    }).then(() => {
                        navigate("/dashboard");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Registration Failed",
                        text: "2FA verification failed",
                    });
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: "Invalid email or password. Please try again.",
                });
            } else {
                const responseData = error.message;
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: responseData || "Registration failed.",
                });
            }
        }
        setSubmitting(false);
    };

    return (
        <section>
            <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="card" style={{ borderRadius: "15px" }}>
                                <div className="card-body p-5">
                                    <h2 className="text-uppercase text-center mb-5">
                                        Create an account
                                    </h2>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleRegister}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form>
                                                <div className="form-outline mb-4">
                                                    <Field
                                                        type="text"
                                                        name="name"
                                                        placeholder="Enter Full Name"
                                                        className="form-control form-control"
                                                    />
                                                    <ErrorMessage name="name" component="div" className="text-danger" />
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <Field
                                                        type="email"
                                                        name="email"
                                                        placeholder="Enter Email"
                                                        className="form-control form-control"
                                                    />
                                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <Field
                                                        type="text"
                                                        name="phone"
                                                        placeholder="Phone"
                                                        className="form-control form-control"
                                                    />
                                                    <ErrorMessage name="phone" component="div" className="text-danger" />
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <Field
                                                        type="password"
                                                        name="password"
                                                        placeholder="Enter Password"
                                                        className="form-control form-control"
                                                    />
                                                    <ErrorMessage name="password" component="div" className="text-danger" />
                                                </div>
                                                <div className="form-outline mb-4">
                                                    <Field
                                                        type="password"
                                                        name="password_confirmation"
                                                        placeholder="Confirm Password"
                                                        className="form-control form-control"
                                                    />
                                                    <ErrorMessage name="password_confirmation" component="div" className="text-danger" />
                                                </div>
                                                <div id="recaptcha-container" className="m-4"></div>
                                                <div className="d-flex justify-content-center mt-2">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                                                        disabled={isSubmitting}
                                                    >
                                                        Register
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                    <p className="text-center text-muted mt-5 mb-0">
                                        Have already an account?{" "}
                                        <Link to="/login" className="fw-bold text-body">
                                            Login here
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
