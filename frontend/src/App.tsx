import { BrowserRouter, Routes, Route } from "react-router";

// Import your global styles
import './App.css';

// Import all the custom components we just built
import Navbar from "./Navbar";
import Home from "./Home";
import Details from "./components/Details";
import Checkout from "./Checkout";

function App() {
    return (
        <BrowserRouter>
            {/* The Navbar sits OUTSIDE the Routes so it never unmounts! */}
            <Navbar />

            {/* The Routes determine which component swaps in below the Navbar */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/details/:id" element={<Details />} />
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
