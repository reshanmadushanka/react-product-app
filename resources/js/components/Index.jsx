import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
    return(
        <div className="container">
            <div className="header">
                <Link to="/login" className="link">Login</Link>
                <Link to="/register" className="link">Register</Link>
            </div>
            
            <h1 className="main-title">Welcome To Home Page</h1>
            
        </div>

    )
}

export default Index;