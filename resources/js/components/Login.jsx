import React, { useState } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/login", formData);
            // const phoneNumber = `+94${response.data.user.phone}`;

            // const recaptchaVerifier = new RecaptchaVerifier(
            //     auth,
            //     "recaptcha-container",
            //     { size: "normal" }
            // );

            // const confirmationResult = await signInWithPhoneNumber(
            //     auth,
            //     phoneNumber,
            //     recaptchaVerifier
            // );
            // setConfirmationResult(confirmationResult);

            // // Handle user input for OTP
            // const code = prompt("Enter OTP sent to your phone");
            // setVerificationCode(code);

            // const result = await confirmationResult.confirm(code);
            // const idToken = await result.user.getIdToken();

            // const verifyResponse = await axios.post(`/api/2fa`, { idToken });
            // if (verifyResponse.data.message === "2FA verified") {
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
            // } else {
            //     Swal.fire({
            //         icon: "error",
            //         title: "Login Failed",
            //         text: "2FA verification failed",
            //     });
            // }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: "Invalid email or password. Please try again.",
                });
            } else {
                const responseData = error.response.data;
                setValidationErrors(responseData);
                if (responseData) {
                    setValidationErrors(responseData);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: responseData || "Login failed.",
                    });
                }
            }
        }
    };

    return (
        <section className="App">
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
                                        Login
                                    </h2>
                                    <form method="POST" onSubmit={handleLogin}>
                                        <div className="form-outline mb-4">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary mt-4"
                                        >
                                            Submit
                                        </button>
                                    </form>
                                    <div id="recaptcha-container"></div>
                                    <p className="text-center text-muted mt-5 mb-0">
                                        Not an account?{" "}
                                        <Link to="/register" className="link">
                                            Register here
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

export default Login;
