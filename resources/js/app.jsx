/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

import "./bootstrap";

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import "../css/app.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("app"));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
