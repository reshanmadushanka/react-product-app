// resources/js/components/Register.js
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [formdata, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });
    const handleChange = (e) => {
        setFormData({ ...formdata, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/register", formdata);
            const phoneNumber = `+94${response.data.user.phone}`;

            const recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                { size: "invisible" }
            );

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                recaptchaVerifier
            );
            setConfirmationResult(confirmationResult);

            // Handle user input for OTP
            const code = prompt("Enter OTP sent to your phone");
            setVerificationCode(code);

            const result = await confirmationResult.confirm(code);
            const idToken = await result.user.getIdToken();

            const verifyResponse = await axios.post(`/api/2fa`, { idToken });
            if (verifyResponse.data.message === "2FA verified") {
                const token = response.data.token;
                localStorage.setItem("token", token);
                // localStorage.setItem("user", JSON.stringify(response.data.user));
                Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    text: "Welcome back!",
                }).then(() => {
                    navigate("/dashboard");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: "2FA verification failed",
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: "Invalid email or password. Please try again.",
                });
            } else {
                const responseData = error;
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: responseData || "Login failed.",
                });
            }
        }
    };

    return (
        <section>
            <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                <div className="container h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div
                                className="card"
                                style={{ borderRadius: "15px" }}
                            >
                                <div className="card-body p-5">
                                    <h2 className="text-uppercase text-center mb-5">
                                        Create an account
                                    </h2>
                                    <form onSubmit={handleRegister}>
                                        <div className="form-outline mb-4">
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="Enter Full Name"
                                                className="form-control form-control"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                placeholder="Enter Email"
                                                className="form-control form-control"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input
                                                type="text"
                                                placeholder="Phone"
                                                name="phone"
                                                required
                                                className="form-control form-control"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input
                                                type="Password"
                                                name="password"
                                                required
                                                placeholder="Enter Password"
                                                className="form-control form-control"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                placeholder="Confirm Password"
                                                className="form-control form-control"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div class="d-flex justify-content-center mt-2">
                                            <button
                                                type="submit"
                                                class="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                                            >
                                                Register
                                            </button>
                                        </div>
                                    </form>
                                    <p className="text-center text-muted mt-5 mb-0">
                                        Have already an account?{" "}
                                        <Link
                                            to="/login"
                                            className="fw-bold text-body"
                                        >
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
