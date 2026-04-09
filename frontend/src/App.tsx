import { BrowserRouter, Routes, Route } from "react-router";
import './App.css';
import Navbar from "./Navbar";
import Home from "./Home";
import Details from "./components/Details";
import Checkout from "./Checkout";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/details/:id" element={<Details />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
