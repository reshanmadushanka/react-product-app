import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Index from "./Index";
import AddProduct from "./product/AddProduct";
import EditProduct from "./product/EditProduct";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />
            </Routes>
        </div>
    );
}

export default App;
